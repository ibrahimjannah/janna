<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Coupon;
use Carbon\Carbon;

class CouponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $coupons = [
            [
                'code' => 'ROYAL5',
                'type' => 'percentage',
                'value' => 5,
                'min_cart_amount' => 100,
                'expires_at' => Carbon::now()->addYear(),
                'is_active' => true,
                'free_delivery' => false,
            ],
            [
                'code' => 'ROYAL10',
                'type' => 'percentage',
                'value' => 10,
                'min_cart_amount' => 300,
                'expires_at' => Carbon::now()->addYear(),
                'is_active' => true,
                'free_delivery' => false,
            ],
            [
                'code' => 'ROYAL15',
                'type' => 'percentage',
                'value' => 15,
                'min_cart_amount' => 500,
                'expires_at' => Carbon::now()->addYear(),
                'is_active' => true,
                'free_delivery' => false,
            ],
            [
                'code' => 'ROYAL20FREE',
                'type' => 'percentage',
                'value' => 20,
                'min_cart_amount' => 1000,
                'expires_at' => Carbon::now()->addYear(),
                'is_active' => true,
                'free_delivery' => true,
            ],
        ];

        foreach ($coupons as $coupon) {
            Coupon::updateOrCreate(
                ['code' => $coupon['code']],
                $coupon
            );
        }

        $this->command->info('Coupons seeded successfully!');
    }
}
