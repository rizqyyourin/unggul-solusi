<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// Model untuk representasi tabel item_penjualan di database
class ItemPenjualan extends Model
{
    // Nama tabel di database
    protected $table = 'item_penjualan';
    // Primary key gabungan (nota dan kode_barang)
    protected $primaryKey = ['nota', 'kode_barang'];
    // Primary key bertipe string, tidak auto increment
    public $incrementing = false;
    protected $keyType = 'string';
    // Tidak pakai kolom timestamps (created_at, updated_at)
    public $timestamps = false;

    // Kolom yang bisa diisi massal
    protected $fillable = [
        'nota',
        'kode_barang',
        'qty'
    ];

    // Konversi tipe data kolom
    protected $casts = [
        'qty' => 'integer',
    ];

    // Override untuk composite primary key
    // Override untuk composite primary key (agar bisa update/delete dengan 2 kolom)
    protected function setKeysForSaveQuery($query)
    {
        $keys = $this->getKeyName();
        if(!is_array($keys)){
            return parent::setKeysForSaveQuery($query);
        }

        foreach($keys as $keyName){
            $query->where($keyName, '=', $this->getKeyForSaveQuery($keyName));
        }

        return $query;
    }

    // Ambil nilai primary key untuk query
    protected function getKeyForSaveQuery($keyName = null)
    {
        if(is_null($keyName)){
            $keyName = $this->getKeyName();
        }

        if (isset($this->original[$keyName])) {
            return $this->original[$keyName];
        }

        return $this->getAttribute($keyName);
    }

    // Relationships
    public function penjualan()
    {
        return $this->belongsTo(Penjualan::class, 'nota', 'id_nota');
    }

    public function barang()
    {
        return $this->belongsTo(Barang::class, 'kode_barang', 'kode');
    }
}
