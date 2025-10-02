# Toko API - Laravel REST API

## Overview
API ini dibuat untuk sistem manajemen toko dengan fitur CRUD untuk:
1. **Data Pelanggan**
2. **Data Barang** 
3. **Data Penjualan**

## Database Structure

### Tabel Pelanggan
- `id_pelanggan` (varchar(20), Primary Key)
- `nama` (varchar(100))
- `domisili` (varchar(20))
- `jenis_kelamin` (enum: 'PRIA','WANITA')

### Tabel Barang
- `kode` (varchar(20), Primary Key)
- `nama` (varchar(100))
- `kategori` (enum: 'ATK','RT','MASAK','ELEKTRONIK')
- `harga` (int unsigned)

### Tabel Penjualan
- `id_nota` (varchar(20), Primary Key)
- `tgl` (date)
- `kode_pelanggan` (varchar(20), Foreign Key)
- `subtotal` (int unsigned)

### Tabel Item Penjualan
- `nota` (varchar(20), Foreign Key)
- `kode_barang` (varchar(20), Foreign Key)
- `qty` (int unsigned)
- Primary Key: (`nota`, `kode_barang`)

## Installation & Setup

1. Clone/Download project
2. Install dependencies: `composer install`
3. Configure database in `.env` file
4. Run migrations: `php artisan migrate`
5. Start server: `php artisan serve`

## API Endpoints

Base URL: `http://localhost:8000/api`

### 1. CRUD Pelanggan

#### GET /api/pelanggan
Get all pelanggan
```bash
curl -X GET http://localhost:8000/api/pelanggan
```

#### POST /api/pelanggan
Create new pelanggan
```bash
curl -X POST http://localhost:8000/api/pelanggan \
  -H "Content-Type: application/json" \
  -d '{
    "id_pelanggan": "PELANGGAN_11",
    "nama": "John Doe",
    "domisili": "Jakarta",
    "jenis_kelamin": "PRIA"
  }'
```

#### GET /api/pelanggan/{id}
Get pelanggan by ID
```bash
curl -X GET http://localhost:8000/api/pelanggan/PELANGGAN_1
```

#### PUT /api/pelanggan/{id}
Update pelanggan
```bash
curl -X PUT http://localhost:8000/api/pelanggan/PELANGGAN_11 \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "John Smith",
    "domisili": "Bandung"
  }'
```

#### DELETE /api/pelanggan/{id}
Delete pelanggan
```bash
curl -X DELETE http://localhost:8000/api/pelanggan/PELANGGAN_11
```

### 2. CRUD Barang

#### GET /api/barang
Get all barang
```bash
curl -X GET http://localhost:8000/api/barang
```

#### POST /api/barang
Create new barang
```bash
curl -X POST http://localhost:8000/api/barang \
  -H "Content-Type: application/json" \
  -d '{
    "kode": "BRG_11",
    "nama": "Laptop Gaming",
    "kategori": "ELEKTRONIK",
    "harga": 15000000
  }'
```

#### GET /api/barang/{id}
Get barang by ID
```bash
curl -X GET http://localhost:8000/api/barang/BRG_1
```

#### PUT /api/barang/{id}
Update barang
```bash
curl -X PUT http://localhost:8000/api/barang/BRG_11 \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Laptop Gaming ROG",
    "harga": 16000000
  }'
```

#### DELETE /api/barang/{id}
Delete barang
```bash
curl -X DELETE http://localhost:8000/api/barang/BRG_11
```

### 3. CRUD Penjualan

#### GET /api/penjualan
Get all penjualan with relationships
```bash
curl -X GET http://localhost:8000/api/penjualan
```

#### POST /api/penjualan
Create new penjualan with items
```bash
curl -X POST http://localhost:8000/api/penjualan \
  -H "Content-Type: application/json" \
  -d '{
    "id_nota": "NOTA_11",
    "tgl": "2025-09-30",
    "kode_pelanggan": "PELANGGAN_1",
    "items": [
      {
        "kode_barang": "BRG_1",
        "qty": 2
      },
      {
        "kode_barang": "BRG_2", 
        "qty": 1
      }
    ]
  }'
```

#### GET /api/penjualan/{id}
Get penjualan by ID with relationships
```bash
curl -X GET http://localhost:8000/api/penjualan/NOTA_1
```

#### PUT /api/penjualan/{id}
Update penjualan
```bash
curl -X PUT http://localhost:8000/api/penjualan/NOTA_11 \
  -H "Content-Type: application/json" \
  -d '{
    "tgl": "2025-10-01",
    "items": [
      {
        "kode_barang": "BRG_1",
        "qty": 3
      }
    ]
  }'
```

#### DELETE /api/penjualan/{id}
Delete penjualan
```bash
curl -X DELETE http://localhost:8000/api/penjualan/NOTA_11
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

## Features

- **Complete CRUD operations** for all entities
- **Data validation** with proper error handling  
- **Database relationships** properly loaded
- **Transaction support** for complex operations
- **Proper HTTP status codes**
- **Consistent JSON response format**
- **Foreign key constraints** respected

## Technologies Used

- **Laravel 12** - PHP Framework
- **MySQL** - Database
- **Eloquent ORM** - Database interaction
- **Laravel Validation** - Input validation
- **Database Transactions** - Data consistency

## Database Relationships

- `Pelanggan` → `Penjualan` (One-to-Many)
- `Penjualan` → `ItemPenjualan` (One-to-Many)
- `Barang` → `ItemPenjualan` (One-to-Many)
- `Pelanggan` ← `Penjualan` ← `ItemPenjualan` → `Barang`

The API automatically calculates subtotal when creating/updating penjualan based on barang prices and quantities.