<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $table = 'customers';

    protected $primaryKey = 'id';

    protected $fillable = [
        'name', 'contact',
    ];


    public function orders()
    {
        return $this->hasMany(Order::class);

    }

}
