<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PelangganController;
use App\Http\Controllers\Api\BarangController;
use App\Http\Controllers\Api\PenjualanController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// API Routes for Toko Database

// Pelanggan CRUD Routes
Route::apiResource('pelanggan', PelangganController::class);

// Barang CRUD Routes  
Route::apiResource('barang', BarangController::class);

// Penjualan CRUD Routes
Route::apiResource('penjualan', PenjualanController::class);

// Additional routes if needed
Route::get('/', function () {
    return response()->json([
        'message' => 'Toko API is running!',
        'version' => '1.0',
        'endpoints' => [
            'pelanggan' => [
                'GET /api/pelanggan' => 'Get all pelanggan',
                'POST /api/pelanggan' => 'Create new pelanggan',
                'GET /api/pelanggan/{id}' => 'Get pelanggan by ID',
                'PUT /api/pelanggan/{id}' => 'Update pelanggan by ID',
                'DELETE /api/pelanggan/{id}' => 'Delete pelanggan by ID'
            ],
            'barang' => [
                'GET /api/barang' => 'Get all barang',
                'POST /api/barang' => 'Create new barang',
                'GET /api/barang/{id}' => 'Get barang by ID',
                'PUT /api/barang/{id}' => 'Update barang by ID',
                'DELETE /api/barang/{id}' => 'Delete barang by ID'
            ],
            'penjualan' => [
                'GET /api/penjualan' => 'Get all penjualan',
                'POST /api/penjualan' => 'Create new penjualan',
                'GET /api/penjualan/{id}' => 'Get penjualan by ID',
                'PUT /api/penjualan/{id}' => 'Update penjualan by ID',
                'DELETE /api/penjualan/{id}' => 'Delete penjualan by ID'
            ]
        ]
    ]);
});