<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ItemPenjualanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('item_penjualan')->insert([
            ['nota' => 'NOTA_1', 'kode_barang' => 'BRG_1', 'qty' => 2],
            ['nota' => 'NOTA_1', 'kode_barang' => 'BRG_2', 'qty' => 2],
            ['nota' => 'NOTA_10', 'kode_barang' => 'BRG_5', 'qty' => 10],
            ['nota' => 'NOTA_2', 'kode_barang' => 'BRG_6', 'qty' => 1],
            ['nota' => 'NOTA_3', 'kode_barang' => 'BRG_4', 'qty' => 1],
            ['nota' => 'NOTA_3', 'kode_barang' => 'BRG_6', 'qty' => 1],
            ['nota' => 'NOTA_3', 'kode_barang' => 'BRG_7', 'qty' => 1],
            ['nota' => 'NOTA_4', 'kode_barang' => 'BRG_10', 'qty' => 2],
            ['nota' => 'NOTA_4', 'kode_barang' => 'BRG_9', 'qty' => 2],
            ['nota' => 'NOTA_5', 'kode_barang' => 'BRG_3', 'qty' => 1],
            ['nota' => 'NOTA_6', 'kode_barang' => 'BRG_3', 'qty' => 1],
            ['nota' => 'NOTA_6', 'kode_barang' => 'BRG_5', 'qty' => 1],
            ['nota' => 'NOTA_6', 'kode_barang' => 'BRG_7', 'qty' => 1],
            ['nota' => 'NOTA_7', 'kode_barang' => 'BRG_5', 'qty' => 1],
            ['nota' => 'NOTA_7', 'kode_barang' => 'BRG_6', 'qty' => 1],
            ['nota' => 'NOTA_7', 'kode_barang' => 'BRG_7', 'qty' => 1],
            ['nota' => 'NOTA_7', 'kode_barang' => 'BRG_8', 'qty' => 1],
            ['nota' => 'NOTA_8', 'kode_barang' => 'BRG_5', 'qty' => 1],
            ['nota' => 'NOTA_8', 'kode_barang' => 'BRG_9', 'qty' => 1],
            ['nota' => 'NOTA_9', 'kode_barang' => 'BRG_5', 'qty' => 1],
        ]);
    }
}
