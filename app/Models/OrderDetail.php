<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    protected $primaryKey = ['order_id', 'product_id'];

    public $incrementing = false;

    protected $fillable = [
        'order_id', 'product_id', 'quantity', 'price', 'amount',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
