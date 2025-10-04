<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// Model untuk representasi tabel pelanggan di database
class Pelanggan extends Model
{
    // Nama tabel di database
    protected $table = 'pelanggan';
    // Primary key bukan id, tapi id_pelanggan
    protected $primaryKey = 'id_pelanggan';
    // Primary key bertipe string, tidak auto increment
    public $incrementing = false;
    protected $keyType = 'string';
    // Tidak pakai kolom timestamps (created_at, updated_at)
    public $timestamps = false;

    // Kolom yang bisa diisi massal
    protected $fillable = [
        'id_pelanggan',
        'nama',
        'domisili',
        'jenis_kelamin'
    ];

    // Konversi tipe data kolom
    protected $casts = [
        'jenis_kelamin' => 'string',
    ];

    // Relationship
    // Relasi: satu pelanggan bisa punya banyak penjualan
    public function penjualan()
    {
        return $this->hasMany(Penjualan::class, 'kode_pelanggan', 'id_pelanggan');
    }
}
