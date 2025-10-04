<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Migration untuk membuat tabel penjualan di database
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
    // Membuat tabel penjualan
    Schema::create('penjualan', function (Blueprint $table) {
            // Kolom id_nota sebagai primary key
            $table->string('id_nota', 20)->primary();
            // Kolom tanggal penjualan
            $table->date('tgl');
            // Kolom kode pelanggan (relasi ke tabel pelanggan)
            $table->string('kode_pelanggan', 20);
            // Kolom subtotal total belanja
            $table->unsignedInteger('subtotal')->default(0);
            
        // Foreign key ke tabel pelanggan
        $table->foreign('kode_pelanggan')->references('id_pelanggan')->on('pelanggan')
            ->onUpdate('cascade')->onDelete('restrict');
            // Index untuk kolom tanggal
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
