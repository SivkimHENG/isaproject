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
        Schema::create('payments', function (Blueprint $table) {
            $table->increments('id');
            $table->dateTime('pay_date');
            $table->unsignedTinyInteger('staff_id');
            $table->unsignedTinyInteger('order_id');
            $table->decimal('amount',19,4);
            $table->timestamps();

            $table->foreign('staff_id')->references('id')->on('staffs');
            $table->foreign('order_id')->references('id')->on('orders');


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
