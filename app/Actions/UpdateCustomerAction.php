<?php

namespace App\Actions;

use App\Models\Customer;

class UpdateCustomerAction {


    public function execute(int $id , array $data) : Customer
    {

        $customer = Customer::findOrFail($id);

        $customerData = [
            'name' => $data['name'],
            'contact' => $data['contact']
        ];


        $customer->update($customerData);

        return $customer->fresh();



    }



}


