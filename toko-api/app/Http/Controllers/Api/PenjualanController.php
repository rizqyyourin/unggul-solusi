<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Penjualan;
use App\Models\ItemPenjualan;
use App\Models\Barang;
use App\Models\Pelanggan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

class PenjualanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            // Menggunakan raw query untuk pengurutan yang efisien berdasarkan angka di id_nota
            $penjualan = Penjualan::with(['pelanggan', 'itemPenjualan.barang'])
                ->orderByRaw("CAST(SUBSTRING(id_nota, 6) AS UNSIGNED)")
                ->get();
            
            return response()->json([
                'success' => true,
                'message' => 'Data penjualan berhasil diambil',
                'data' => $penjualan
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data penjualan',
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
                'id_nota' => 'required|string|max:20|unique:penjualan,id_nota',
                'tgl' => 'required|date',
                'kode_pelanggan' => 'required|string|exists:pelanggan,id_pelanggan',
                'items' => 'required|array|min:1',
                'items.*.kode_barang' => 'required|string|exists:barang,kode',
                'items.*.qty' => 'required|integer|min:1'
            ]);

            DB::beginTransaction();

            // Calculate subtotal
            $subtotal = 0;
            foreach ($request->items as $item) {
                $barang = Barang::find($item['kode_barang']);
                $subtotal += $barang->harga * $item['qty'];
            }

            // Create penjualan
            $penjualan = Penjualan::create([
                'id_nota' => $request->id_nota,
                'tgl' => $request->tgl,
                'kode_pelanggan' => $request->kode_pelanggan,
                'subtotal' => $subtotal
            ]);

            // Create item penjualan
            foreach ($request->items as $item) {
                ItemPenjualan::create([
                    'nota' => $request->id_nota,
                    'kode_barang' => $item['kode_barang'],
                    'qty' => $item['qty']
                ]);
            }

            DB::commit();

            // Load relationships for response
            $penjualan->load(['pelanggan', 'itemPenjualan.barang']);

            return response()->json([
                'success' => true,
                'message' => 'Data penjualan berhasil ditambahkan',
                'data' => $penjualan
            ], 201);
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan data penjualan',
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
            $penjualan = Penjualan::with(['pelanggan', 'itemPenjualan.barang'])->find($id);
            
            if (!$penjualan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data penjualan tidak ditemukan'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Data penjualan berhasil diambil',
                'data' => $penjualan
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data penjualan',
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
            $penjualan = Penjualan::find($id);
            
            if (!$penjualan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data penjualan tidak ditemukan'
                ], 404);
            }

            $request->validate([
                'tgl' => 'sometimes|required|date',
                'kode_pelanggan' => 'sometimes|required|string|exists:pelanggan,id_pelanggan',
                'items' => 'sometimes|required|array|min:1',
                'items.*.kode_barang' => 'required_with:items|string|exists:barang,kode',
                'items.*.qty' => 'required_with:items|integer|min:1'
            ]);

            DB::beginTransaction();

            // Update penjualan data
            $updateData = $request->only(['tgl', 'kode_pelanggan']);
            
            // If items are provided, recalculate subtotal and update items
            if ($request->has('items')) {
                // Delete existing items
                ItemPenjualan::where('nota', $id)->delete();
                
                // Calculate new subtotal
                $subtotal = 0;
                foreach ($request->items as $item) {
                    $barang = Barang::find($item['kode_barang']);
                    $subtotal += $barang->harga * $item['qty'];
                }
                
                $updateData['subtotal'] = $subtotal;
                
                // Create new items
                foreach ($request->items as $item) {
                    ItemPenjualan::create([
                        'nota' => $id,
                        'kode_barang' => $item['kode_barang'],
                        'qty' => $item['qty']
                    ]);
                }
            }

            $penjualan->update($updateData);

            DB::commit();

            // Load relationships for response
            $penjualan->load(['pelanggan', 'itemPenjualan.barang']);

            return response()->json([
                'success' => true,
                'message' => 'Data penjualan berhasil diupdate',
                'data' => $penjualan
            ], 200);
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate data penjualan',
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
            $penjualan = Penjualan::find($id);
            
            if (!$penjualan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data penjualan tidak ditemukan'
                ], 404);
            }

            DB::beginTransaction();

            // Delete item penjualan first (due to foreign key)
            ItemPenjualan::where('nota', $id)->delete();
            
            // Delete penjualan
            $penjualan->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Data penjualan berhasil dihapus'
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus data penjualan',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
