<?php

namespace App\Actions;

use App\Models\Order;
use App\Models\Payment;

class GetOrderDetailsAction
{
    /**
     * Get detailed information about an order including payment status
     */
    public function execute(Order $order): array
    {
        $existingPayments = Payment::where('order_id', $order->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $totalPaid = $existingPayments->sum('amount');
        $remainingAmount = $order->total - $totalPaid;
        $isFullyPaid = $remainingAmount <= 0;

        return [
            'order' => [
                'id' => $order->id,
                'total' => $order->total,
                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
            ],
            'payments' => $existingPayments->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'amount' => $payment->amount,
                    'pay_date' => $payment->pay_date,
                    'staff_name' => $payment->staff->name ?? 'Unknown',
                    'created_at' => $payment->created_at,
                ];
            }),
            'payment_summary' => [
                'total_paid' => $totalPaid,
                'remaining_amount' => $remainingAmount,
                'is_fully_paid' => $isFullyPaid,
                'payment_count' => $existingPayments->count(),
                'payment_percentage' => $order->total > 0 ? round(($totalPaid / $order->total) * 100, 2) : 0,
            ]
        ];
    }

    /**
     * Get simple payment status for an order
     */
    public function getPaymentStatus(Order $order): string
    {
        $totalPaid = Payment::where('order_id', $order->id)->sum('amount');
        $remaining = $order->total - $totalPaid;

        if ($remaining <= 0) {
            return 'fully_paid';
        } elseif ($totalPaid > 0) {
            return 'partially_paid';
        } else {
            return 'unpaid';
        }
    }
}
