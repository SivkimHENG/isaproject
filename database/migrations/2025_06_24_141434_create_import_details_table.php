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
        Schema::create('import_details', function (Blueprint $table) {
            $table->unsignedInteger('import_id');
            $table->unsignedInteger('product_id');
            $table->smallInteger('quantity');
            $table->decimal('price', 19,4);
            $table->decimal('amount', 19,4);
            $table->timestamps();

            $table->primary(['import_id', 'product_id']);
            $table->foreign('import_id')->references('id')->on('imports');
            $table->foreign('product_id')->references('id')->on('products');


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('import_details');
    }
};
