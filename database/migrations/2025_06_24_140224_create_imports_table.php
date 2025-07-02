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
        Schema::create('imports', function (Blueprint $table) {
            $table->increments('id');
            $table->date('import_date');
            $table->unsignedInteger('staff_id');
            $table->unsignedInteger('supplier_id');
            $table->decimal('total', 19,4);

            $table->foreign('staff_id')->references('id')->on('staffs');
            $table->foreign('supplier_id')->references('id')->on('suppliers');



            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('imports');
    }
};
