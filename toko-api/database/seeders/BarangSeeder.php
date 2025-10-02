<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BarangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('barang')->insert([
            ['kode' => 'BRG_1', 'nama' => 'PEN', 'kategori' => 'ATK', 'harga' => 15000],
            ['kode' => 'BRG_2', 'nama' => 'PENSIL', 'kategori' => 'ATK', 'harga' => 10000],
            ['kode' => 'BRG_3', 'nama' => 'PAYUNG', 'kategori' => 'RT', 'harga' => 70000],
            ['kode' => 'BRG_4', 'nama' => 'PANCI', 'kategori' => 'MASAK', 'harga' => 110000],
            ['kode' => 'BRG_5', 'nama' => 'SAPU', 'kategori' => 'RT', 'harga' => 40000],
            ['kode' => 'BRG_6', 'nama' => 'KIPAS', 'kategori' => 'ELEKTRONIK', 'harga' => 200000],
            ['kode' => 'BRG_7', 'nama' => 'KUALI', 'kategori' => 'MASAK', 'harga' => 120000],
            ['kode' => 'BRG_8', 'nama' => 'SIKAT', 'kategori' => 'RT', 'harga' => 30000],
            ['kode' => 'BRG_9', 'nama' => 'GELAS', 'kategori' => 'RT', 'harga' => 25000],
            ['kode' => 'BRG_10', 'nama' => 'PIRING', 'kategori' => 'RT', 'harga' => 35000],
        ]);
    }
}
