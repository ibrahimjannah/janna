<?php

namespace Tests\Feature\POS;

use App\Models\User;
use App\Models\Table;
use App\Models\Menu;
use App\Models\Category;
use App\Models\StaffRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderFlowTest extends TestCase
{
    use RefreshDatabase;

    protected $staff;
    protected $table;
    protected $menu;

    protected function setUp(): void
    {
        parent::setUp();

        $this->staff = User::factory()->create();
        StaffRole::create([
            'user_id' => $this->staff->id,
            'role' => 'manager',
            'permissions' => ['orders', 'payments', 'tables', 'kitchen']
        ]);

        $this->table = Table::create(['table_number' => 'T1', 'capacity' => 4, 'status' => 'available']);
        
        $category = Category::create(['name' => 'Starters', 'slug' => 'starters']);
        $this->menu = Menu::create([
            'category_id' => $category->id,
            'name' => 'Samosa',
            'price' => 5.00,
            'description' => 'Delicious samosa'
        ]);
    }

    public function test_staff_can_create_order()
    {
        $response = $this->actingAs($this->staff)
            ->withHeaders(['X-Inertia' => 'true', 'X-POS-Port' => 'true']) // Simulate being on the correct port if needed
            ->post(route('pos.orders.store'), [
                'table_id' => $this->table->id,
                'order_type' => 'dine-in',
                'items' => [
                    [
                        'menu_id' => $this->menu->id,
                        'quantity' => 2,
                        'special_instructions' => 'Extra spicy'
                    ]
                ]
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('orders', ['table_id' => $this->table->id]);
        $this->assertEquals('occupied', $this->table->fresh()->status);
    }

    public function test_staff_can_process_payment()
    {
        $order = \App\Models\Order::create([
            'order_number' => 'ORD-TEST',
            'table_id' => $this->table->id,
            'order_type' => 'dine-in',
            'status' => 'pending',
            'subtotal' => 10.00,
            'tax' => 1.00,
            'total' => 11.00,
            'payment_status' => 'unpaid',
            'staff_id' => $this->staff->id
        ]);

        $response = $this->actingAs($this->staff)
            ->withHeaders(['X-Inertia' => 'true', 'X-POS-Port' => 'true'])
            ->post(route('pos.payment.store', $order->id), [
                'amount' => 11.00,
                'payment_method' => 'cash'
            ]);

        $response->assertStatus(200);
        $this->assertEquals('paid', $order->fresh()->payment_status);
        $this->assertEquals('completed', $order->fresh()->status);
        $this->assertEquals('available', $this->table->fresh()->status);
    }
}
