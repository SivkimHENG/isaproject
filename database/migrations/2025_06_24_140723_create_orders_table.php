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
        Schema::create('orders', function (Blueprint $table) {
            $table->increments('id');
            $table->date('order_date');
            $table->unsignedTinyInteger('staff_id');
            $table->unsignedTinyInteger('customer_id');
            $table->decimal('total',19,4);
            $table->timestamps();


            $table->foreign('staff_id')->references('id')->on('staffs');
            $table->foreign('customer_id')->references('id')->on('customers');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
