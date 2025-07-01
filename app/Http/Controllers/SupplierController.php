<?php

namespace App\Http\Controllers;

use App\Actions\CreateSupplierAction;
use App\Actions\UpdateSupplierAction;
use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Models\Supplier;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index()
    {
        $supplier = Supplier::all();

        return Inertia::render('Supplier/Index', [
            'suppliers' => $supplier,
        ]);

    }

    public function store(StoreSupplierRequest $request, CreateSupplierAction $action)
    {
        try {
            $action->execute($request->validated());

            return redirect()->route('supplier.index')->with('success', 'Supplier created successfully');
        } catch (\Exception $e) {
            return redirect()->route('supplier.index')->with('error', 'Failed to create supplier');
        }
    }

    public function update(UpdateSupplierRequest $request, int $id, UpdateSupplierAction $action)
    {
        $supplier = $action->execute($id, $request->validated());
    }

    public function destroy($id)
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->delete();

        return back()->with('success', 'Supplier deleted successfully');

    }
}
