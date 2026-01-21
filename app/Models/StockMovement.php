<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    protected $fillable = [
        'ingredient_id',
        'type',
        'quantity',
        'cost',
        'reason',
        'order_id',
        'created_by',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'decimal:3',
        'cost' => 'decimal:2',
    ];

    /**
     * Relationships
     */
    public function ingredient()
    {
        return $this->belongsTo(Ingredient::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
