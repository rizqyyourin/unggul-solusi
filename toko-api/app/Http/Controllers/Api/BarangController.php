<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class BarangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            // Menggunakan raw query untuk pengurutan yang lebih efisien berdasarkan angka di kode
            $barang = Barang::orderByRaw("CAST(SUBSTRING(kode, 5) AS UNSIGNED)")->get();
            
            return response()->json([
                'success' => true,
                'message' => 'Data barang berhasil diambil',
                'data' => $barang
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data barang',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'kode' => 'required|string|max:20|unique:barang,kode',
                'nama' => 'required|string|max:100',
                'kategori' => 'required|in:ATK,RT,MASAK,ELEKTRONIK',
                'harga' => 'required|integer|min:0'
            ]);

            $barang = Barang::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Data barang berhasil ditambahkan',
                'data' => $barang
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan data barang',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $barang = Barang::find($id);
            
            if (!$barang) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data barang tidak ditemukan'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Data barang berhasil diambil',
                'data' => $barang
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data barang',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $barang = Barang::find($id);
            
            if (!$barang) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data barang tidak ditemukan'
                ], 404);
            }

            $request->validate([
                'nama' => 'sometimes|required|string|max:100',
                'kategori' => 'sometimes|required|in:ATK,RT,MASAK,ELEKTRONIK',
                'harga' => 'sometimes|required|integer|min:0'
            ]);

            $barang->update($request->only(['nama', 'kategori', 'harga']));

            return response()->json([
                'success' => true,
                'message' => 'Data barang berhasil diupdate',
                'data' => $barang
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate data barang',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $barang = Barang::find($id);
            
            if (!$barang) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data barang tidak ditemukan'
                ], 404);
            }

            // Check if barang has item penjualan
            if ($barang->itemPenjualan()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak dapat menghapus barang yang memiliki data penjualan'
                ], 409);
            }

            $barang->delete();

            return response()->json([
                'success' => true,
                'message' => 'Data barang berhasil dihapus'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus data barang',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
