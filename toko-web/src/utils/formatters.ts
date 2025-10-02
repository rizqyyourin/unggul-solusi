/**
 * Format number to Indonesian Rupiah currency
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
 * Format number with thousands separator
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(num)
}

/**
 * Parse currency string back to number
 */
export const parseCurrency = (currencyString: string): number => {
  return parseInt(currencyString.replace(/[^0-9]/g, '')) || 0
}

/**
 * Generate random ID with prefix
 */
export const generateId = (prefix: string, length: number = 6): string => {
  const timestamp = Date.now().toString().slice(-4)
  const random = Math.random().toString(36).substring(2, length - 2)
  return `${prefix}_${timestamp}${random}`.toUpperCase()
}

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Debounce function for search input
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