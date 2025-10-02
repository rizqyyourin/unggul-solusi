<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    protected $table = 'barang';
    protected $primaryKey = 'kode';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'kode',
        'nama',
        'kategori',
        'harga'
    ];

    protected $casts = [
        'harga' => 'integer',
        'kategori' => 'string',
    ];

    // Relationship
    public function itemPenjualan()
    {
        return $this->hasMany(ItemPenjualan::class, 'kode_barang', 'kode');
    }
}
