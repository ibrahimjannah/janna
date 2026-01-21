<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('delivery_address_id')->nullable()->after('customer_id')->constrained('addresses')->onDelete('set null');
            $table->decimal('delivery_fee', 10, 2)->default(0)->after('tax');
            $table->text('delivery_instructions')->nullable()->after('notes');
            $table->timestamp('estimated_delivery_time')->nullable()->after('delivery_instructions');
            $table->enum('delivery_status', ['pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'])->default('pending')->after('estimated_delivery_time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['delivery_address_id']);
            $table->dropColumn([
                'delivery_address_id',
                'delivery_fee',
                'delivery_instructions',
                'estimated_delivery_time',
                'delivery_status'
            ]);
        });
    }
};
