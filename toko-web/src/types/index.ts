// Re-export all types from their respective files
export * from './pelanggan'
export * from './barang'
export * from './penjualan'

// Common types
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginationData {
  current: number
  pageSize: number
  total: number
}

export interface SearchableData {
  searchTerm: string
  filteredData: any[]
  isSearching: boolean
}