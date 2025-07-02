<?php

namespace App\Actions;

use App\Models\Import;
use App\Models\ImportDetail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CreateImportAction
{
    public function execute(array $data): Import
    {
        Log::info('CreateImportAction received data:', [
            'import_details_count' => isset($data['import_details']) ? count($data['import_details']) : 0,
            'import_details_structure' => isset($data['import_details']) ? array_map('gettype', $data['import_details']) : [],
        ]);

        return DB::transaction(function () use ($data) {
            if (!isset($data['import_details']) || !is_array($data['import_details']) || empty($data['import_details'])) {
                throw new \Exception('Import details are required and must be a non-empty array');
            }

            $import = Import::create([
                'import_date' => $data['import_date'],
                'staff_id' => (int) $data['staff_id'],
                'supplier_id' => (int) $data['supplier_id'],
                'total' => (float) $data['total'],
            ]);

            foreach ($data['import_details'] as $index => $detail) {
                try {
                    $normalized = $this->normalizeDetailData($detail, $index);

                    ImportDetail::create([
                        'import_id' => $import->id,
                        'product_id' => $normalized['product_id'],
                        'quantity' => $normalized['quantity'],
                        'price' => $normalized['price'],
                        'amount' => $normalized['amount'],
                    ]);
                } catch (\Exception $e) {
                    Log::error('Error processing import detail:', [
                        'index' => $index,
                        'detail' => $detail,
                        'error' => $e->getMessage()
                    ]);
                    throw $e;
                }
            }

            return $import->load(['importDetails.product', 'staff', 'supplier']);
        });
    }

    private function normalizeDetailData($detail, int $index): array
    {
        Log::info('Normalizing detail data:', [
            'index' => $index,
            'detail_type' => gettype($detail),
            'detail_content' => $detail
        ]);

        // More robust unwrapping with safety checks
        $maxDepth = 5; // Prevent infinite loops
        $currentDepth = 0;

        while (is_array($detail) && $currentDepth < $maxDepth) {
            // Check if this looks like a proper detail structure
            if ($this->isValidDetailStructure($detail)) {
                break;
            }

            // If it's an array with numeric keys, try to unwrap the first element
            if (isset($detail[0]) && is_array($detail[0])) {
                $detail = $detail[0];
                $currentDepth++;
            } else {
                // If we can't unwrap further, break
                break;
            }
        }

        if (!is_array($detail)) {
            throw new \Exception("Invalid format at index $index: expected array, got " . gettype($detail));
        }

        if (!$this->isValidDetailStructure($detail)) {
            throw new \Exception("Invalid detail structure at index $index. Expected keys: product_id, quantity, price, amount. Got keys: " . implode(', ', array_keys($detail)));
        }

        return [
            'product_id' => $this->validateAndCast($detail['product_id'], 'int', 'product_id', $index),
            'quantity' => $this->validateAndCast($detail['quantity'], 'int', 'quantity', $index),
            'price' => $this->validateAndCast($detail['price'], 'float', 'price', $index),
            'amount' => $this->validateAndCast($detail['amount'], 'float', 'amount', $index),
        ];
    }

    private function isValidDetailStructure(array $detail): bool
    {
        $requiredKeys = ['product_id', 'quantity', 'price', 'amount'];
        return count(array_intersect($requiredKeys, array_keys($detail))) === count($requiredKeys);
    }

    private function validateAndCast($value, string $type, string $fieldName, int $index): int|float
    {
        if ($value === null || $value === '') {
            throw new \Exception("Field '$fieldName' cannot be empty in import detail at position " . ($index + 1));
        }

        if (!is_numeric($value) && !is_string($value)) {
            throw new \Exception("Field '$fieldName' must be numeric in import detail at position " . ($index + 1) . ". Got: " . gettype($value));
        }

        $numericValue = is_string($value) ? trim($value) : $value;

        if (!is_numeric($numericValue)) {
            throw new \Exception("Field '$fieldName' must be numeric in import detail at position " . ($index + 1) . ". Value: '$numericValue'");
        }

        return $type === 'int' ? (int)$numericValue : (float)$numericValue;
    }
}
