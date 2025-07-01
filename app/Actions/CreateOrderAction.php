<?php

namespace App\Actions;

use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class CreateOrderAction {

   public function execute(array $validatedData)
    {
        return DB::transaction(function () use ($validatedData) {
            // Create order
            $order = Order::create([
                'customer_id' => $validatedData['customer_id'],
                'staff_id' => $validatedData['staff_id'],
                'order_date' => $validatedData['order_date'],
                'total' => 0, // Initialize total
            ]);

            $totalAmount = 0;

            foreach ($validatedData['products'] as $productData) {
                $product = Product::lockForUpdate()->find($productData['id']);

                // Validate stock
                if ($product->quantity < $productData['quantity']) {
                    throw new \Exception("Insufficient stock for product: {$product->name}");
                }

                // Calculate subtotal
                $subtotal = $product->sale_unit_price * $productData['quantity'];

                // Create order detail
                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $productData['quantity'],
                    'price' => $product->sale_unit_price,
                    'amount' => $subtotal,
                ]);

                // Update total
                $totalAmount += $subtotal;

                // Update stock
                $product->decrement('quantity', $productData['quantity']);
            }

            // Update order total
            $order->update(['total' => $totalAmount]);

            return $order;
        });
    }
}
