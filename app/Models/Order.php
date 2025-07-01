<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'orders';

    protected $primaryKey = 'id';

   protected $fillable = [
        'order_date',
        'staff_id',
        'customer_id',
        'total'
    ];


    public function customer()
    {
        return $this->belongsTo(Customer::class);

    }

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class,'order_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
