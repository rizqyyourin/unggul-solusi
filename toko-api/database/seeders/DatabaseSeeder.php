<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed data in correct order respecting foreign keys
        $this->call([
            PelangganSeeder::class,
            BarangSeeder::class,
            PenjualanSeeder::class,
            ItemPenjualanSeeder::class,
        ]);
    }
}
