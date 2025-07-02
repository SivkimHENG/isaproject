<?php

namespace App\Actions;

use App\Models\Order;
use App\Models\Payment;
use Exception;
use Illuminate\Support\Facades\DB;

class CreatePaymentAction
{
    public function execute(array $data): Payment
    {

        $this->validatePaymentAmount($data['order_id'], $data['amount']);

        return DB::transaction(function () use ($data) {
            return Payment::create([
                'pay_date' => $data['pay_date'],
                'staff_id' => $data['staff_id'],
                'order_id' => $data['order_id'],
                'amount' => $data['amount'],
            ]);

        });

    }

    public function validatePaymentAmount(int $orderId, float $amount): void
    {

        $order = Order::findOrFail($orderId);
        $existingPayments = Payment::where('order_id', $orderId)->sum('amount');
        $remainingAmount = $order->total - $existingPayments;

        if ($amount > $remainingAmount) {
            throw new Exception('Payment amount cannot exceed the remaining order balance of $'.number_format($remainingAmount, 2));
        }

        if ($amount <= 0) {
            throw new Exception('Payment amount must be greater than zero.');
        }
    }

    public function getRemainingAmount(int $orderId): float
    {

        $order = Order::findOrFail($orderId);
        $existingPayments = Payment::where('order_id', $orderId)->sum('amount');

        return $order->total - $existingPayments;

    }
}
