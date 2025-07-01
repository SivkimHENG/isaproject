<?php
namespace App\Actions;
use App\Models\Product;

class CreateProductAction
{
    public function execute(array $data): Product
    {

        $productData = [
            'name' => $data['name'],
            'quantity' => $data['quantity'],
            'unit_price_stock' => $data['unit_price_stock'],
            'sale_unit_price' => $data['sale_unit_price'],
        ];

        return Product::create($productData);

    }
}
