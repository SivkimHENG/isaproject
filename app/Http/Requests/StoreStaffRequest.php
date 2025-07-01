<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStaffRequest extends FormRequest
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

            'fullname' => 'required|string|max:50',
            'gender' => 'required|in:M,F',
            'date_of_birth' => 'required|date',
            'position' => 'required|string|max:50',
            'salary' => 'required|numeric|min:0|max:1000000',
            'stopwork' => 'sometimes|boolean',
        ];
    }
}
