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
        Schema::create('item_penjualan', function (Blueprint $table) {
            $table->string('nota', 20);
            $table->string('kode_barang', 20);
            $table->unsignedInteger('qty');
            
            $table->primary(['nota', 'kode_barang']);
            $table->foreign('nota')->references('id_nota')->on('penjualan')
                  ->onUpdate('cascade')->onDelete('cascade');
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
