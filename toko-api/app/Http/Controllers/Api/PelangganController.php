<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pelanggan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class PelangganController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            // Menggunakan raw query untuk pengurutan yang lebih efisien
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
    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'id_pelanggan' => 'required|string|max:20|unique:pelanggan,id_pelanggan',
                'nama' => 'required|string|max:100',
                'domisili' => 'required|string|max:20',
                'jenis_kelamin' => 'required|in:PRIA,WANITA'
            ]);

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
    public function show(string $id): JsonResponse
    {
        try {
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
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $pelanggan = Pelanggan::find($id);
            
            if (!$pelanggan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data pelanggan tidak ditemukan'
                ], 404);
            }

            $request->validate([
                'nama' => 'sometimes|required|string|max:100',
                'domisili' => 'sometimes|required|string|max:20',
                'jenis_kelamin' => 'sometimes|required|in:PRIA,WANITA'
            ]);

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
    public function destroy(string $id): JsonResponse
    {
        try {
            $pelanggan = Pelanggan::find($id);
            
            if (!$pelanggan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data pelanggan tidak ditemukan'
                ], 404);
            }

            // Check if pelanggan has penjualan
            if ($pelanggan->penjualan()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak dapat menghapus pelanggan yang memiliki data penjualan'
                ], 409);
            }

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
