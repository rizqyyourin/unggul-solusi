<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Migration untuk membuat tabel barang di database
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
    // Membuat tabel barang
    Schema::create('barang', function (Blueprint $table) {
            // Kolom kode barang sebagai primary key
            $table->string('kode', 20)->primary();
            // Kolom nama barang
            $table->string('nama', 100);
            // Kolom kategori barang
            $table->enum('kategori', ['ATK', 'RT', 'MASAK', 'ELEKTRONIK']);
            // Kolom harga barang
            $table->unsignedInteger('harga');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barang');
    }
};
