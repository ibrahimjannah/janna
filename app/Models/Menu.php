<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $fillable = ['category_id', 'name', 'description', 'price', 'image', 'spice_level', 'is_signature'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites');
    }

    public function isFavoritedBy(?User $user)
    {
        if (!$user) return false;
        return $this->favorites()->where('user_id', $user->id)->exists();
    }

    /**
     * Ingredient Management
     */
    public function ingredients()
    {
        return $this->belongsToMany(Ingredient::class, 'menu_ingredients')
                    ->withPivot('quantity_required')
                    ->withTimestamps();
    }

    public function isAvailable(): bool
    {
        // Check if all required ingredients are in stock
        foreach ($this->ingredients as $ingredient) {
            if (!$ingredient->is_active) {
                return false;
            }
            if ($ingredient->current_stock < $ingredient->pivot->quantity_required) {
                return false;
            }
        }
        return true;
    }

    public function getAvailablePortions(): int
    {
        if ($this->ingredients->isEmpty()) {
            return 999; // No ingredients tracked, assume available
        }

        $portions = [];
        foreach ($this->ingredients as $ingredient) {
            if (!$ingredient->is_active || $ingredient->current_stock <= 0) {
                return 0;
            }
            $portions[] = floor($ingredient->current_stock / $ingredient->pivot->quantity_required);
        }
        return min($portions);
    }
}
