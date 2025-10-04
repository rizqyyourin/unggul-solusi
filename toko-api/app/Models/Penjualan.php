<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// Model untuk representasi tabel penjualan di database
class Penjualan extends Model
{
    // Nama tabel di database
    protected $table = 'penjualan';
    // Primary key bukan id, tapi id_nota
    protected $primaryKey = 'id_nota';
    // Primary key bertipe string, tidak auto increment
    public $incrementing = false;
    protected $keyType = 'string';
    // Tidak pakai kolom timestamps (created_at, updated_at)
    public $timestamps = false;

    // Kolom yang bisa diisi massal
    protected $fillable = [
        'id_nota',
        'tgl',
        'kode_pelanggan',
        'subtotal'
    ];

    // Konversi tipe data kolom
    protected $casts = [
        'tgl' => 'date',
        'subtotal' => 'integer',
    ];

    // Relationships
    // Relasi: satu penjualan punya satu pelanggan
    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class, 'kode_pelanggan', 'id_pelanggan');
    }

    // Relasi: satu penjualan punya banyak item penjualan
    public function itemPenjualan()
    {
        return $this->hasMany(ItemPenjualan::class, 'nota', 'id_nota');
    }

    // Accessor untuk format tanggal
    // Accessor untuk format tanggal
    public function getTglFormattedAttribute()
    {
        return $this->tgl->format('Y-m-d');
    }
}
