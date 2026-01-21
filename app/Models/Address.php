<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'user_id',
        'address_line_1',
        'address_line_2',
        'city',
        'postcode',
        'phone',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    /**
     * Get the user that owns the address
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get orders delivered to this address
     */
    public function orders()
    {
        return $this->hasMany(Order::class, 'delivery_address_id');
    }

    /**
     * Get formatted full address
     */
    public function getFullAddress()
    {
        $address = $this->address_line_1;
        
        if ($this->address_line_2) {
            $address .= ', ' . $this->address_line_2;
        }
        
        $address .= ', ' . $this->city . ' ' . $this->postcode;
        
        return $address;
    }

    /**
     * Get full address attribute
     */
    public function getFullAddressAttribute()
    {
        return $this->getFullAddress();
    }

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        // When setting an address as default, unset other defaults
        static::saving(function ($address) {
            if ($address->is_default) {
                static::where('user_id', $address->user_id)
                    ->where('id', '!=', $address->id)
                    ->update(['is_default' => false]);
            }
        });
    }
}
