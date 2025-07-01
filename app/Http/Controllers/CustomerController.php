<?php

namespace App\Http\Controllers;

use App\Actions\StoreCustomerAction;
use App\Actions\UpdateCustomerAction;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Customer;
use Inertia\Inertia;

class CustomerController extends Controller {



    public function index()
    {
        $customers = Customer::all();
        return Inertia::render('Customer/Index',[
           'customers' =>  $customers
        ]);
    }

    public  function store(StoreCustomerRequest $request, StoreCustomerAction $action)
    {
        $customer = $action->execute($request->validated());
    }


    public function update(UpdateCustomerRequest $request, $id, UpdateCustomerAction $action)
    {
        $customer = $action->execute($id, $request->validated());
    }

    public function destroy($id)
    {
        try {
            $customer = Customer::findOrFail($id);
            $customer->delete();

            if (request()->wantsJson()) {
                return response()->json(['message' => 'Staff member deleted successfully']);
            }

            return redirect()->route('staff.index')->with('success', 'Staff member deleted successfully');
        } catch (\Exception $e) {
            if (request()->wantsJson()) {
                return response()->json(['error' => 'Failed to delete staff member'], 500);
            }

            return redirect()->route('staff.index')->with('error', 'Failed to delete staff member');
        }
    }
}
