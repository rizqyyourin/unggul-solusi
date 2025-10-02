import { useState, useEffect, useMemo } from 'react'

export interface UseSearchOptions<T> {
  data: T[]
  searchFields: (keyof T)[]
  onSearch?: (term: string, results: T[]) => void
}

export function useSearch<T>({ data, searchFields, onSearch }: UseSearchOptions<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState<T[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Filtered data based on search
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

  // Update filtered data when search results change
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