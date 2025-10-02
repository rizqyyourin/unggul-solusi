import { ReactNode, useEffect, useState } from 'react'

export interface ResponsivePaginationConfig {
  current: number
  pageSize: number
  total: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  showTotal?: (total: number, range: [number, number]) => ReactNode
  pageSizeOptions?: string[]
  showLessItems?: boolean
  size?: 'default' | 'small'
  onChange?: (page: number, size?: number) => void
  onShowSizeChange?: (current: number, size: number) => void
}

interface UseResponsivePaginationProps {
  current: number
  pageSize: number
  total: number
  showTotal?: (total: number, range: [number, number]) => ReactNode
  onChange?: (page: number, size?: number) => void
  onShowSizeChange?: (current: number, size: number) => void
}

export function useResponsivePagination({
  current,
  pageSize,
  total,
  showTotal,
  onChange,
  onShowSizeChange
}: UseResponsivePaginationProps): ResponsivePaginationConfig {
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return {
    current,
    pageSize,
    total,
    showSizeChanger: true,
    showQuickJumper: !isMobile, // Hide quick jumper on mobile
    showTotal,
    pageSizeOptions: ['5', '10', '20', '50', '100'],
    showLessItems: isMobile, // Show fewer items on mobile
    size: isMobile ? 'small' : 'default',
    onChange,
    onShowSizeChange
  }
}