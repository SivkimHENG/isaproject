<?php

namespace App\Http\Controllers;

use App\Actions\CreatePaymentAction;
use App\Actions\GetOrderDetailsAction;
use App\Actions\GetPaymentDataAction;
use App\Http\Requests\StorePaymentRequest;
use App\Models\Order;
use Exception;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function __construct(
        private CreatePaymentAction $createPaymentAction,
        private GetPaymentDataAction $getPaymentDataAction,
        private GetOrderDetailsAction $getOrderDetailsAction,
    ) {}

    /**
     * Display the payment management page
     */
    public function index()
    {
        $data = $this->getPaymentDataAction->execute();

        return Inertia::render('Payment/Index', $data);
    }

    /**
     * Store a new payment
     */
    public function store(StorePaymentRequest $request)
    {
        try {
            $payment = $this->createPaymentAction->execute($request->validated());

            return back()->with('success', 'Payment processed successfully!');

        } catch (Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Get detailed information about an order including payment status
     */
    public function getOrderDetails(Order $order)
    {
        $details = $this->getOrderDetailsAction->execute($order);

        return response()->json($details);
    }

    /**
     * Get remaining amount for an order
     * Fixed: Proper route model binding and error handling
     */
    public function getRemainingAmount(Order $order)
    {
        try {
            $remainingAmount = $this->createPaymentAction->getRemainingAmount($order->id);

            return response()->json([
                'remaining_amount' => $remainingAmount,
                'formatted_amount' => '$' . number_format($remainingAmount, 2),
            ]);
        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 404);
        }
    }
}
