<?php

namespace App\Actions;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Staff;
use Illuminate\Support\Collection;

class GetPaymentDataAction
{
    public function execute(): array
    {
        return [
            'orders' => $this->getPendingOrders(),
            'staff' => $this->getStaffMembers(),
            'payments' => $this->getRecentPayments(),
            'stats' => $this->getStats(),

        ];

    }

    public function getPendingOrders(): Collection
    {

        return Order::select('id', 'total', 'created_at')
            ->where(function ($query) {
                $query->whereDoesntHave('payments')
                    ->orWhereHas('payments', function ($subquery) {
                        $subquery->select('order_id')->groupBy('order_id')
                            ->havingRaw('SUM(amount) < (SELECT total FROM orders WHERE orders.id = payments.order_id)');
                    });
            })
            ->orderBy('created_at', 'desc')
            ->take(50)
            ->get();

    }

    public function getStaffMembers(): Collection
    {
        return Staff::select('id', 'fullname')
            ->orderBy('fullname')->get();
    }

    public function getRecentPayments(): Collection
    {
        return Payment::with(['staff:id,fullname', 'order:id,total'])
            ->select('id', 'pay_date', 'amount', 'staff_id', 'order_id', 'created_at')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($payment) {
                $payment->order_total = $payment->order->total;

                return $payment;
            });
    }

    public function getStats(): array
    {

        $currentMonth = now()->month();
        $currentYear = now()->year();
        $lastMonth = now()->subMonth();

        $currentMonthRevenue = Payment::whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->sum('amount');

        $lastMonthRevenue = Payment::whereMonth('created_at', $lastMonth->month)
            ->whereYear('created_at', $lastMonth->year)->sum('amount');

        $revenueGrowth = $lastMonthRevenue > 0
                  ? round((($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1)
                  : 0;

        $totalOrders = Order::count();
        $lastMonthOrders = Order::whereMonth('created_at', $lastMonth->month)
            ->whereYear('created_at', $lastMonth->year)
            ->count();

        $currentMonthOrders = Order::whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->count();

        $orderGrowth = $lastMonthOrders > 0
            ? round((($currentMonthOrders - $lastMonthOrders) / $lastMonthOrders) * 100, 1)
            : 0;

        $pendingOrders = $this->getPendingOrders();
        $pendingAmount = $pendingOrders->sum('total');

        return [
            'totalOrders' => $totalOrders,
            'orderGrowth' => $orderGrowth,
            'pendingPayments' => $pendingOrders->count(),
            'pendingAmount' => $pendingAmount,
            'recentImports' => $this->getRecentImportsCount(),
            'revenue' => $currentMonthRevenue,
            'revenueGrowth' => $revenueGrowth,
        ];

    }

    private function getRecentImportsCount(): int
    {
        // Replace this with actual logic from your imports table
        // Example: return Import::whereDate('created_at', '>=', now()->subWeek())->count();
        return 8;
    }
}
