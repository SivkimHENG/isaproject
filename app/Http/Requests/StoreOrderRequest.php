<?php

namespace App\Http\Requests;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
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
            'customer_id' => ['required', 'exists:customers,id'],
            'staff_id' => ['required', 'exists:staffs,id'],
            'order_date' => ['required', 'date'],
            'products' => ['required', 'array', 'min:1'],
            'products.*.id' => [
                'required',
                Rule::exists('products', 'id')->where(function ($query) {
                    $query->where('quantity', '>', 0);
                }),
            ],
            'products.*.quantity' => [
                'required',
                'integer',
                'min:1',
                function ($attribute, $value, $fail) {
                    $index = explode('.', $attribute)[1];
                    $productId = $this->input("products.{$index}.id");

                    if ($product = Product::find($productId)) {
                        if ($value > $product->quantity) {
                            $fail("Quantity for {$product->name} exceeds available stock");
                        }
                    }
                },
      ],
        ];

    }
}
