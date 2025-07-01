<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Staff extends Model
{
    protected $table = 'staffs';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'fullname', 'gender', 'date_of_birth', 'position', 'salary', 'stopwork',
    ];


    public function orders()
    {
        return $this->hasMany(Order::class);
    }
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }



}

