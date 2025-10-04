<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Migration untuk membuat tabel item_penjualan di database
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
    // Membuat tabel item_penjualan
    Schema::create('item_penjualan', function (Blueprint $table) {
            // Kolom nota (relasi ke penjualan)
            $table->string('nota', 20);
            // Kolom kode_barang (relasi ke barang)
            $table->string('kode_barang', 20);
            // Kolom qty (jumlah barang yang dibeli)
            $table->unsignedInteger('qty');
            
            // Primary key gabungan (nota dan kode_barang)
            $table->primary(['nota', 'kode_barang']);
        // Foreign key ke penjualan
        $table->foreign('nota')->references('id_nota')->on('penjualan')
            ->onUpdate('cascade')->onDelete('cascade');
        // Foreign key ke barang
        $table->foreign('kode_barang')->references('kode')->on('barang')
            ->onUpdate('cascade')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_penjualan');
    }
};
