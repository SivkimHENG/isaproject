<?php
namespace App\Actions;
use App\Models\Product;

class UpdateProductAction
{
    public function execute(int $id,array $data): Product
    {

        $product = Product::findOrFail($id);
        $productData = [
            'name' => $data['name'],
            'quantity' => $data['quantity'],
            'unit_price_stock' => $data['unit_price_stock'],
            'sale_unit_price' => $data['sale_unit_price'],
        ];


        $product->update($productData);

        return $product->fresh();


    }
}

