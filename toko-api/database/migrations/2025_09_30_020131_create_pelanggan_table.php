<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Migration untuk membuat tabel pelanggan di database
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
    // Membuat tabel pelanggan
    Schema::create('pelanggan', function (Blueprint $table) {
            // Kolom id_pelanggan sebagai primary key
            $table->string('id_pelanggan', 20)->primary();
            // Kolom nama pelanggan
            $table->string('nama', 100);
            // Kolom domisili pelanggan
            $table->string('domisili', 20);
            // Kolom jenis kelamin (PRIA/WANITA)
            $table->enum('jenis_kelamin', ['PRIA', 'WANITA']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pelanggan');
    }
};
