<?php
namespace App\Actions;
use App\Models\Supplier;

class CreateSupplierAction {


    public function execute(array $data) : Supplier
    {

        $supplierData = [
            'suppliers' => $data['suppliers'],
            'address' => $data['address'],
            'contact' => $data['contact']
        ];


        return Supplier::create($supplierData);

    }



}
