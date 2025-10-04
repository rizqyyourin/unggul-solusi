<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

// Seeder utama untuk menjalankan semua seeder lain
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    /**
     * Jalankan semua seeder untuk mengisi data awal database
     */
    public function run(): void
    {
        // Jalankan seeder sesuai urutan foreign key
        $this->call([
            PelangganSeeder::class,   // Isi data pelanggan
            BarangSeeder::class,      // Isi data barang
            PenjualanSeeder::class,   // Isi data penjualan
            ItemPenjualanSeeder::class, // Isi data item penjualan
        ]);
    }
}
