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
        Schema::create('staffs', function (Blueprint $table) {
            $table->unsignedTinyInteger('id')->primary();
            $table->string('fullname',50 );
            $table->string('gender',1);
            $table->date('date_of_birth');
            $table->string('position', 50);
            $table->decimal('salary', 19,4);
            $table->boolean('stopwork')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staffs');
    }
};
