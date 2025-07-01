<?php

namespace App\Actions;

use App\Models\Customer;

class StoreCustomerAction {

    public function execute(array $data): Customer
    {

        $customerData =  [
            'name' => $data['name'],
            'contact' => $data['contact']
        ];

        return Customer::create($customerData);


    }

}


