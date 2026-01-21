<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $fillable = [
        'user_id',
        'session_id',
        'menu_id',
        'quantity',
        'price',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'quantity' => 'integer',
    ];

    /**
     * Get the user that owns the cart item
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the menu item
     */
    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }

    /**
     * Calculate subtotal for this cart item
     */
    public function getSubtotal()
    {
        return $this->price * $this->quantity;
    }

    /**
     * Get subtotal attribute
     */
    public function getSubtotalAttribute()
    {
        return $this->getSubtotal();
    }
}
