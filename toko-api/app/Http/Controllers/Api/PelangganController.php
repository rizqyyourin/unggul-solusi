<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pelanggan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

// Controller untuk mengatur endpoint API pelanggan
class PelangganController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    /**
     * Ambil semua data pelanggan dari database
     * Endpoint: GET /api/pelanggan
     */
    public function index(): JsonResponse
    {
        try {
            // Menggunakan raw query untuk pengurutan yang lebih efisien
            // Ambil semua pelanggan, urut berdasarkan angka di id_pelanggan
            $pelanggan = Pelanggan::orderByRaw("CAST(SUBSTRING(id_pelanggan, 11) AS UNSIGNED)")->get();
            
            return response()->json([
                'success' => true,
                'message' => 'Data pelanggan berhasil diambil',
                'data' => $pelanggan
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data pelanggan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    /**
     * Tambah data pelanggan baru ke database
     * Endpoint: POST /api/pelanggan
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Validasi input dari user
            $request->validate([
                'id_pelanggan' => 'required|string|max:20|unique:pelanggan,id_pelanggan',
                'nama' => 'required|string|max:100',
                'domisili' => 'required|string|max:20',
                'jenis_kelamin' => 'required|in:PRIA,WANITA'
            ]);

            // Simpan data pelanggan baru ke database
            $pelanggan = Pelanggan::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Data pelanggan berhasil ditambahkan',
                'data' => $pelanggan
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
                'message' => 'Gagal menambahkan data pelanggan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    /**
     * Ambil detail pelanggan berdasarkan ID
     * Endpoint: GET /api/pelanggan/{id}
     */
    public function show(string $id): JsonResponse
    {
        try {
            // Cari pelanggan berdasarkan id
            $pelanggan = Pelanggan::find($id);
            
            if (!$pelanggan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data pelanggan tidak ditemukan'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Data pelanggan berhasil diambil',
                'data' => $pelanggan
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data pelanggan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    /**
     * Update data pelanggan berdasarkan ID
     * Endpoint: PUT /api/pelanggan/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            // Cari pelanggan yang mau diupdate
            $pelanggan = Pelanggan::find($id);
            
            if (!$pelanggan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data pelanggan tidak ditemukan'
                ], 404);
            }

            // Validasi input update
            $request->validate([
                'nama' => 'sometimes|required|string|max:100',
                'domisili' => 'sometimes|required|string|max:20',
                'jenis_kelamin' => 'sometimes|required|in:PRIA,WANITA'
            ]);

            // Update data pelanggan di database
            $pelanggan->update($request->only(['nama', 'domisili', 'jenis_kelamin']));

            return response()->json([
                'success' => true,
                'message' => 'Data pelanggan berhasil diupdate',
                'data' => $pelanggan
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
                'message' => 'Gagal mengupdate data pelanggan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    /**
     * Hapus pelanggan dari database
     * Endpoint: DELETE /api/pelanggan/{id}
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            // Cari pelanggan yang mau dihapus
            $pelanggan = Pelanggan::find($id);
            
            if (!$pelanggan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data pelanggan tidak ditemukan'
                ], 404);
            }

            // Check if pelanggan has penjualan
            // Cek apakah pelanggan punya relasi penjualan
            if ($pelanggan->penjualan()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak dapat menghapus pelanggan yang memiliki data penjualan'
                ], 409);
            }

            // Hapus pelanggan dari database
            $pelanggan->delete();

            return response()->json([
                'success' => true,
                'message' => 'Data pelanggan berhasil dihapus'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus data pelanggan',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
