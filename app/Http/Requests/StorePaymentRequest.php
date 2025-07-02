<?php

namespace App\Http\Requests;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'pay_date' => 'required|date|before_or_equal:today',
            'staff_id' => 'required|exists:staffs,id',
            'order_id' => 'required|exists:orders,id',
            'amount' => 'required|numeric|min:0.01|max:999999.99',

        ];

    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->order_id && $this->amount) {
                $order = Order::find($this->order_id);
                if ($order) {
                    $existingPayments = Payment::where('order_id', $this->order_id)->sum('amount');
                    $remainingAmount = $order->total - $existingPayments;

                    if ($this->amount > $remainingAmount) {
                        $validator->errors()->add(
                            'amount',
                            'Payment amount cannot exceed the remaining order balance of $'.number_format($remainingAmount, 2)
                        );
                    }
                }
            }
        });

    }
}
