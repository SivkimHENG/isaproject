<?php

namespace App\Http\Controllers;

use App\Actions\CreateImportAction;
use App\Http\Requests\StoreImportRequest;
use App\Models\Import;
use App\Models\Product;
use App\Models\Staff;
use App\Models\Supplier;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ImportController extends Controller
{
    public function index()
    {
        $imports = Import::with(['staff', 'supplier', 'importDetails.product'])
            ->orderBy('import_date', 'desc')
            ->paginate(15);

        $recentImports = Import::with(['staff', 'supplier', 'importDetails'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($import) {
                return [
                    'id' => $import->id,
                    'import_number' => '#' . str_pad($import->id, 4, '0', STR_PAD_LEFT),
                    'supplier' => $import->supplier->suppliers,
                    'staff' => $import->staff->fullname,
                    'import_date' => $import->import_date->format('Y-m-d'),
                    'total' => $import->total,
                    'items_count' => $import->importDetails->sum('quantity'),
                    'status' => 'Processed',
                    'created_at' => $import->created_at->format('Y-m-d H:i'),
                ];
            });

        return Inertia::render('Import/Index', [
            'imports' => $imports,
            'recentImports' => $recentImports,
            'stats' => [
                'total_imports' => Import::count(),
                'this_week_imports' => Import::whereBetween('import_date', [
                    now()->startOfWeek(),
                    now()->endOfWeek(),
                ])->count(),
            ],
            'staffs' => Staff::select('id', 'fullname')->orderBy('fullname')->get(),
            'suppliers' => Supplier::select('id', 'suppliers')->orderBy('suppliers')->get(),
            'products' => Product::select('id', 'name', 'price')->orderBy('name')->get(),
        ]);
    }

    public function store(StoreImportRequest $request)
    {
        try {
            $validatedData = $request->validated();

            Log::info('StoreImportRequest validated data:', [
                'import_details_count' => count($validatedData['import_details']),
                'import_details_sample' => array_slice($validatedData['import_details'], 0, 2) // Log first 2 items for debugging
            ]);

            // Process import details with better error handling
            $processedDetails = [];

            foreach ($validatedData['import_details'] as $index => $detail) {
                try {
                    // Log the current detail being processed
                    Log::debug("Processing detail at index $index:", [
                        'detail_type' => gettype($detail),
                        'detail_keys' => is_array($detail) ? array_keys($detail) : 'not_array',
                        'detail_content' => $detail
                    ]);

                    $processedDetail = $this->processImportDetail($detail, $index);
                    $processedDetails[] = $processedDetail;

                } catch (\Exception $e) {
                    Log::error("Error processing import detail at index $index:", [
                        'detail' => $detail,
                        'error' => $e->getMessage()
                    ]);
                    throw new \Exception("Error processing import detail at position " . ($index + 1) . ": " . $e->getMessage());
                }
            }

            $validatedData['import_details'] = $processedDetails;

            $action = new CreateImportAction();
            $import = $action->execute($validatedData);

            return back()->with('success', [
                'message' => 'Import created successfully!',
                'import_id' => $import->id,
                'items_count' => count($validatedData['import_details']),
                'total_value' => $import->total,
            ]);

        } catch (\Exception $e) {
            Log::error('Error creating import:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            return back()->withErrors(['error' => 'Failed to create import: ' . $e->getMessage()]);
        }
    }

    private function processImportDetail($detail, int $index): array
    {
        // Handle nested arrays more safely
        $maxDepth = 5;
        $currentDepth = 0;

        while (is_array($detail) && $currentDepth < $maxDepth) {
            // Check if this is already a proper detail structure
            if ($this->isValidDetailArray($detail)) {
                break;
            }

            // If it's an array with a first element that's also an array, unwrap it
            if (isset($detail[0]) && is_array($detail[0])) {
                $detail = $detail[0];
                $currentDepth++;
            } else {
                break;
            }
        }

        if (!is_array($detail)) {
            throw new \Exception("Expected array for import detail, got " . gettype($detail));
        }

        if (!$this->isValidDetailArray($detail)) {
            throw new \Exception("Invalid import detail structure. Required keys: product_id, quantity, price, amount");
        }

        return [
            'product_id' => $this->castToInt($detail['product_id'], 'product_id'),
            'quantity' => $this->castToInt($detail['quantity'], 'quantity'),
            'price' => $this->castToFloat($detail['price'], 'price'),
            'amount' => $this->castToFloat($detail['amount'], 'amount'),
        ];
    }

    private function isValidDetailArray(array $detail): bool
    {
        $requiredKeys = ['product_id', 'quantity', 'price', 'amount'];
        $detailKeys = array_keys($detail);
        return count(array_intersect($requiredKeys, $detailKeys)) === count($requiredKeys);
    }

    private function castToInt($value, string $fieldName): int
    {
        if (!is_numeric($value)) {
            throw new \Exception("Field '$fieldName' must be numeric, got: " . gettype($value));
        }
        return (int) $value;
    }

    private function castToFloat($value, string $fieldName): float
    {
        if (!is_numeric($value)) {
            throw new \Exception("Field '$fieldName' must be numeric, got: " . gettype($value));
        }
        return (float) $value;
    }
}
