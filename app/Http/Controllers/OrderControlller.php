<?php

namespace App\Http\Controllers;

use App\Actions\CreateOrderAction;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\Staff;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderControlller extends Controller
{
    public function index(Request $request)
    {
        $staff = Staff::all();
        $orders = Order::with(['customer', 'staff'])->get();
        $customers = Customer::all();

        $search = $request->query('search');

        $products = Product::query()
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('product_id', 'LIKE', "%{$search}%");
            })
            ->get();

        return Inertia::render('Sale/Index', [
            'orders' => $orders,
            'products' => $products,
            'customers' => $customers,
            'staff' => $staff,
            'filters' => ['search' => $search],
        ]);
    }

    public function store(StoreOrderRequest $request)
    {
        $validated = $request->validated();

        $order = (new CreateOrderAction)->execute($validated);

    }
}
