<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ImportDetail extends Model
{
    protected $table = 'import_details';

   public $incrementing = false;

    protected $primaryKey = null;


    protected $fillable = [
        'import_id',
        'product_id',
        'quantity',
        'price',
        'amount',
    ];





    public function import(): BelongsTo
    {
        return $this->belongsTo(Import::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    protected static function boot()
    {
        parent::boot();
        static::saving(function ($model) {
            $model->amount = $model->quantity * $model->price;
        });

    }


}

