<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreImportRequest extends FormRequest
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
            'import_date' => 'required|date|before_or_equal:today',
            'staff_id' => 'required|integer|exists:staffs,id', // Fixed table name
            'supplier_id' => 'required|integer|exists:suppliers,id', // Fixed table name
            'total' => 'required|numeric|min:0|max:999999.99',
            'import_details' => 'required|array|min:1', // Changed to required
            'import_details.*.product_id' => 'required|integer|exists:products,id',
            'import_details.*.quantity' => 'required|integer|min:1|max:32767',
            'import_details.*.price' => 'required|numeric|min:0|max:999999.99',
            'import_details.*.amount' => 'required|numeric|min:0|max:999999.99',
        ];
    }
}
