<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// Model untuk representasi tabel barang di database
class Barang extends Model
{
    // Nama tabel di database
    protected $table = 'barang';
    // Primary key bukan id, tapi kode
    protected $primaryKey = 'kode';
    // Primary key bertipe string, tidak auto increment
    public $incrementing = false;
    protected $keyType = 'string';
    // Tidak pakai kolom timestamps (created_at, updated_at)
    public $timestamps = false;

    // Kolom yang bisa diisi massal
    protected $fillable = [
        'kode',
        'nama',
        'kategori',
        'harga'
    ];

    // Konversi tipe data kolom
    protected $casts = [
        'harga' => 'integer',
        'kategori' => 'string',
    ];

    // Relationship
    // Relasi: satu barang bisa punya banyak item penjualan
    public function itemPenjualan()
    {
        return $this->hasMany(ItemPenjualan::class, 'kode_barang', 'kode');
    }
}
