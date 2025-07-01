<?php

namespace App\Actions;

use App\Models\Supplier;

class UpdateSupplierAction {


    public function execute(int $id, array $data) : Supplier {

        $supplier = Supplier::findOrFail($id);

        $supplierData =  [
            'suppliers' => $data['suppliers'],
            'address' => $data['address'],
            'contact' => $data['contact']
        ];


        $supplier->update($supplierData);


        return $supplier->fresh();
    }


}
