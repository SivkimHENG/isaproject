<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Staff;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        return Inertia::render('Payment/Index', [
            'staffs' => Staff::select('id', 'fullname')->get(),
            'orders' => Order::with('customer')
                ->select('id', 'order_date', 'total')->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'order_number' => 'Order-'.str_pad($order->id, 3, '0', STR_PAD_LEFT),
                        'total' => $order->total,
                        'customer_name' => $order->customer->name ?? 'N/A',
                        'paid_amount' => $order->payments->sum('amount'),

                    ];

                }),

        ]);
    }

    public function store() {}
}
