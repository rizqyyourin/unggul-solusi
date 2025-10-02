# Test CRUD Operations - Toko API

# Base URL
$baseUrl = "http://localhost:8000/api"

Write-Host "=== TESTING TOKO API CRUD OPERATIONS ===" -ForegroundColor Green
Write-Host ""

# Function to make HTTP requests
function Invoke-ApiRequest {
    param(
        [string]$Method,
        [string]$Url,
        [string]$Body = $null
    )
    
    try {
        if ($Body) {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Body $Body -ContentType "application/json"
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method $Method
        }
        return $response
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Test 1: GET All Pelanggan
Write-Host "1. Testing GET /api/pelanggan" -ForegroundColor Yellow
$response = Invoke-ApiRequest -Method "GET" -Url "$baseUrl/pelanggan"
if ($response) {
    Write-Host "✓ Success: Found $($response.data.Count) pelanggan" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to get pelanggan" -ForegroundColor Red
}
Write-Host ""

# Test 2: GET Specific Pelanggan
Write-Host "2. Testing GET /api/pelanggan/PELANGGAN_1" -ForegroundColor Yellow
$response = Invoke-ApiRequest -Method "GET" -Url "$baseUrl/pelanggan/PELANGGAN_1"
if ($response) {
    Write-Host "✓ Success: $($response.data.nama)" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to get specific pelanggan" -ForegroundColor Red
}
Write-Host ""

# Test 3: POST New Pelanggan
Write-Host "3. Testing POST /api/pelanggan" -ForegroundColor Yellow
$newPelanggan = @{
    id_pelanggan = "PELANGGAN_TEST"
    nama = "Test User"
    domisili = "Jakarta"
    jenis_kelamin = "PRIA"
} | ConvertTo-Json

$response = Invoke-ApiRequest -Method "POST" -Url "$baseUrl/pelanggan" -Body $newPelanggan
if ($response) {
    Write-Host "✓ Success: Created pelanggan $($response.data.nama)" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to create pelanggan" -ForegroundColor Red
}
Write-Host ""

# Test 4: PUT Update Pelanggan
Write-Host "4. Testing PUT /api/pelanggan/PELANGGAN_TEST" -ForegroundColor Yellow
$updatePelanggan = @{
    nama = "Test User Updated"
    domisili = "Bandung"
} | ConvertTo-Json

$response = Invoke-ApiRequest -Method "PUT" -Url "$baseUrl/pelanggan/PELANGGAN_TEST" -Body $updatePelanggan
if ($response) {
    Write-Host "✓ Success: Updated pelanggan to $($response.data.nama)" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to update pelanggan" -ForegroundColor Red
}
Write-Host ""

# Test 5: GET All Barang
Write-Host "5. Testing GET /api/barang" -ForegroundColor Yellow
$response = Invoke-ApiRequest -Method "GET" -Url "$baseUrl/barang"
if ($response) {
    Write-Host "✓ Success: Found $($response.data.Count) barang" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to get barang" -ForegroundColor Red
}
Write-Host ""

# Test 6: POST New Barang
Write-Host "6. Testing POST /api/barang" -ForegroundColor Yellow
$newBarang = @{
    kode = "BRG_TEST"
    nama = "Test Product"
    kategori = "ELEKTRONIK"
    harga = 100000
} | ConvertTo-Json

$response = Invoke-ApiRequest -Method "POST" -Url "$baseUrl/barang" -Body $newBarang
if ($response) {
    Write-Host "✓ Success: Created barang $($response.data.nama)" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to create barang" -ForegroundColor Red
}
Write-Host ""

# Test 7: GET All Penjualan
Write-Host "7. Testing GET /api/penjualan" -ForegroundColor Yellow
$response = Invoke-ApiRequest -Method "GET" -Url "$baseUrl/penjualan"
if ($response) {
    Write-Host "✓ Success: Found $($response.data.Count) penjualan" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to get penjualan" -ForegroundColor Red
}
Write-Host ""

# Test 8: POST New Penjualan
Write-Host "8. Testing POST /api/penjualan" -ForegroundColor Yellow
$newPenjualan = @{
    id_nota = "NOTA_TEST"
    tgl = "2025-09-30"
    kode_pelanggan = "PELANGGAN_1"
    items = @(
        @{
            kode_barang = "BRG_1"
            qty = 2
        },
        @{
            kode_barang = "BRG_TEST"
            qty = 1
        }
    )
} | ConvertTo-Json -Depth 3

$response = Invoke-ApiRequest -Method "POST" -Url "$baseUrl/penjualan" -Body $newPenjualan
if ($response) {
    Write-Host "✓ Success: Created penjualan $($response.data.id_nota) with subtotal $($response.data.subtotal)" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to create penjualan" -ForegroundColor Red
}
Write-Host ""

# Test 9: DELETE Test Data
Write-Host "9. Cleaning up test data..." -ForegroundColor Yellow

# Delete test penjualan
$response = Invoke-ApiRequest -Method "DELETE" -Url "$baseUrl/penjualan/NOTA_TEST"
if ($response) {
    Write-Host "✓ Deleted test penjualan" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to delete test penjualan" -ForegroundColor Red
}

# Delete test barang
$response = Invoke-ApiRequest -Method "DELETE" -Url "$baseUrl/barang/BRG_TEST"
if ($response) {
    Write-Host "✓ Deleted test barang" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to delete test barang" -ForegroundColor Red
}

# Delete test pelanggan
$response = Invoke-ApiRequest -Method "DELETE" -Url "$baseUrl/pelanggan/PELANGGAN_TEST"
if ($response) {
    Write-Host "✓ Deleted test pelanggan" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to delete test pelanggan" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== CRUD TESTING COMPLETED ===" -ForegroundColor Green