# Toko API - Laravel REST API

![Laravel](https://img.shields.io/badge/Laravel-12.x-red.svg)
![PHP](https://img.shields.io/badge/PHP-8.3+-blue.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)

## 📋 Description

Sistem API berbasis web menggunakan Rest-API Laravel untuk manajemen toko dengan fitur CRUD lengkap untuk:

1. **Data Pelanggan** - Kelola informasi pelanggan
2. **Data Barang** - Kelola inventori barang 
3. **Data Penjualan** - Kelola transaksi penjualan dengan item

## 🏗️ Database Structure

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

## 🚀 Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/rizqyyourin/toko-api.git
   cd toko-api
   ```

2. **Install dependencies**
   ```bash
   composer install
   ```

3. **Environment setup**
   ```bash
   copy .env.example .env
   php artisan key:generate
   ```

4. **Database configuration**
   Edit `.env` file:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=toko_db
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. **Replikasi Data**
    ```powershell
    php artisan db:refresh-seed
    ```

6. **Start server**
   ```bash
   php artisan serve
   ```

## 📚 API Documentation

Base URL: `http://localhost:8000/api`

### Endpoints

#### Pelanggan
- `GET /api/pelanggan` - Get all pelanggan
- `POST /api/pelanggan` - Create pelanggan
- `GET /api/pelanggan/{id}` - Get pelanggan by ID
- `PUT /api/pelanggan/{id}` - Update pelanggan
- `DELETE /api/pelanggan/{id}` - Delete pelanggan

#### Barang
- `GET /api/barang` - Get all barang
- `POST /api/barang` - Create barang
- `GET /api/barang/{id}` - Get barang by ID
- `PUT /api/barang/{id}` - Update barang
- `DELETE /api/barang/{id}` - Delete barang

#### Penjualan
- `GET /api/penjualan` - Get all penjualan
- `POST /api/penjualan` - Create penjualan with items
- `GET /api/penjualan/{id}` - Get penjualan by ID
- `PUT /api/penjualan/{id}` - Update penjualan
- `DELETE /api/penjualan/{id}` - Delete penjualan

For detailed API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## 🧪 Testing

Run the PowerShell test script:
```powershell
.\test-api.ps1
```

## 🏆 Features

- ✅ Complete CRUD operations
- ✅ Data validation with error handling
- ✅ Database relationships properly loaded
- ✅ Transaction support for complex operations
- ✅ Proper HTTP status codes
- ✅ Consistent JSON response format
- ✅ Foreign key constraints respected
- ✅ Auto-calculation of subtotal

## 🛠️ Built With

- **Laravel 12** - PHP Framework
- **MySQL** - Database
- **Eloquent ORM** - Database interaction
- **Laravel Validation** - Input validation

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
