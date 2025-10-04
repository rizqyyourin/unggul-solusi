import { useState, useEffect, useMemo } from 'react'

export interface UseSearchOptions<T> {
  data: T[]
  searchFields: (keyof T)[]
  onSearch?: (term: string, results: T[]) => void
}

// Hook untuk fitur pencarian sederhana pada daftar data.
// Input:
// - data: array sumber
// - searchFields: field-field yang akan dicari (mis. ['id_nota', 'kode_pelanggan'])
// Output penting:
// - searchTerm / setSearchTerm: state kata kunci
// - filteredData: hasil yang siap ditampilkan (akan berisi data penuh ketika tidak searching)
// - isSearching: boolean
// - handleSearch / handleClearSearch / handleSearchEnter: helper untuk kontrol input
// - searchResults: hasil pencarian murni (sama dengan filteredData kecuali ada side-effects)
export function useSearch<T>({ data, searchFields, onSearch }: UseSearchOptions<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState<T[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Hasil filter berdasarkan searchTerm
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) {
      return data
    }

    const term = searchTerm.toLowerCase().trim()
    return data.filter(item => 
      searchFields.some(field => {
        const value = item[field]
        if (value == null) return false
        return String(value).toLowerCase().includes(term)
      })
    )
  }, [data, searchTerm, searchFields])

  // Sync hasil pencarian ke state filteredData dan panggil callback bila ada
  useEffect(() => {
    setFilteredData(searchResults)
    if (onSearch) {
      onSearch(searchTerm, searchResults)
    }
  }, [searchResults, searchTerm, onSearch])

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsSearching(true)
    }
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    setIsSearching(false)
    setFilteredData(data)
  }

  const handleSearchEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
    isSearching,
    handleSearch,
    handleClearSearch,
    handleSearchEnter,
    searchResults
  }
}