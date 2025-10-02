<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penjualan extends Model
{
    protected $table = 'penjualan';
    protected $primaryKey = 'id_nota';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id_nota',
        'tgl',
        'kode_pelanggan',
        'subtotal'
    ];

    protected $casts = [
        'tgl' => 'date',
        'subtotal' => 'integer',
    ];

    // Relationships
    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class, 'kode_pelanggan', 'id_pelanggan');
    }

    public function itemPenjualan()
    {
        return $this->hasMany(ItemPenjualan::class, 'nota', 'id_nota');
    }

    // Accessor untuk format tanggal
    public function getTglFormattedAttribute()
    {
        return $this->tgl->format('Y-m-d');
    }
}
