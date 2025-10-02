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
        Schema::create('penjualan', function (Blueprint $table) {
            $table->string('id_nota', 20)->primary();
            $table->date('tgl');
            $table->string('kode_pelanggan', 20);
            $table->unsignedInteger('subtotal')->default(0);
            
            $table->foreign('kode_pelanggan')->references('id_pelanggan')->on('pelanggan')
                  ->onUpdate('cascade')->onDelete('restrict');
            $table->index('tgl', 'idx_penjualan_tgl');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penjualan');
    }
};
