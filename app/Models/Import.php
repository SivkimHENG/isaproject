<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Import extends Model
{
    protected $table = 'imports';

    protected $primaryKey = 'id';

    protected $fillable = [
        'import_date',
        'staff_id',
        'supplier_id',
        'total',
    ];

    protected $casts = [
        'import_date' => 'date',
        'total' => 'decimal:2',
    ];

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function importDetails(): HasMany
    {
        return $this->hasMany(ImportDetail::class);
    }
}
