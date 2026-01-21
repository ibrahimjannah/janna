<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    protected $fillable = [
        'name',
        'unit',
        'current_stock',
        'minimum_stock',
        'cost_per_unit',
        'supplier',
        'last_restocked_at',
        'is_active',
    ];

    protected $casts = [
        'current_stock' => 'decimal:2',
        'minimum_stock' => 'decimal:2',
        'cost_per_unit' => 'decimal:2',
        'last_restocked_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Relationships
     */
    public function menuItems()
    {
        return $this->belongsToMany(Menu::class, 'menu_ingredients')
                    ->withPivot('quantity_required')
                    ->withTimestamps();
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    /**
     * Helper Methods
     */
    public function isLowStock(): bool
    {
        return $this->current_stock <= $this->minimum_stock;
    }

    public function deductStock(float $quantity, ?int $orderId = null, ?int $userId = null): void
    {
        $this->current_stock -= $quantity;
        $this->save();

        // Log the movement
        StockMovement::create([
            'ingredient_id' => $this->id,
            'type' => 'out',
            'quantity' => $quantity,
            'reason' => $orderId ? "Order #{$orderId}" : 'Manual deduction',
            'order_id' => $orderId,
            'created_by' => $userId,
        ]);
    }

    public function addStock(float $quantity, ?float $cost = null, string $reason = 'Restock', ?int $userId = null): void
    {
        $this->current_stock += $quantity;
        $this->last_restocked_at = now();
        $this->save();

        // Log the movement
        StockMovement::create([
            'ingredient_id' => $this->id,
            'type' => 'in',
            'quantity' => $quantity,
            'cost' => $cost,
            'reason' => $reason,
            'created_by' => $userId,
        ]);
    }

    public function adjustStock(float $newQuantity, string $reason, ?int $userId = null): void
    {
        $difference = $newQuantity - $this->current_stock;
        $this->current_stock = $newQuantity;
        $this->save();

        StockMovement::create([
            'ingredient_id' => $this->id,
            'type' => 'adjustment',
            'quantity' => abs($difference),
            'reason' => $reason,
            'created_by' => $userId,
            'notes' => "Adjusted from {$this->current_stock} to {$newQuantity}",
        ]);
    }
}
