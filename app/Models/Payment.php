<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $table = 'payments';

    protected $primaryKey = 'id';

    protected $fillable = [
        'pay_date',
        'amount',
        'staff_id',
        'order_id',
    ];

    public function staff()
    {
        return $this->belongsTo(Staff::class, 'staff_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
