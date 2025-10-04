// Utilitas format & parsing yang sering digunakan di UI
// Ditulis agar pembaca baru cepat paham cara menampilkan angka dan currency di format ID

/**
 * Format number ke tampilan Rupiah (contoh: 10000 -> "Rp10.000")
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Format number biasa dengan pemisah ribuan (contoh: 10000 -> "10.000")
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(num)
}

/**
 * Parse string currency menjadi angka (menghapus karakter non-digit)
 * Contoh: "Rp10.000" -> 10000
 */
export const parseCurrency = (currencyString: string): number => {
  return parseInt(currencyString.replace(/[^0-9]/g, '')) || 0
}

/**
 * Generate ID sederhana dengan prefix dan kombinasi timestamp + random
 * Berguna untuk membuat placeholder ID di client sebelum record disimpan di server
 */
export const generateId = (prefix: string, length: number = 6): string => {
  const timestamp = Date.now().toString().slice(-4)
  const random = Math.random().toString(36).substring(2, length - 2)
  return `${prefix}_${timestamp}${random}`.toUpperCase()
}

/**
 * Potong teks panjang dan tambahkan ellipsis jika melebihi maxLength
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Debounce sederhana untuk input pencarian
 * Membatasi frekuensi pemanggilan fungsi sehingga tidak terlalu sering memicu request
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}