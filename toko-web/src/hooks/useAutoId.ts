import { useMemo } from 'react'

interface UseAutoIdOptions<T> {
  data: T[]
  prefix: string
  idField: keyof T
}

export function useAutoId<T>({ data, prefix, idField }: UseAutoIdOptions<T>): string {
  return useMemo(() => {
    if (!data || data.length === 0) return `${prefix}_1`
    
    const existingNumbers = data
      .filter(item => String(item[idField]).startsWith(`${prefix}_`))
      .map(item => {
        const num = parseInt(String(item[idField]).replace(`${prefix}_`, ''), 10)
        return isNaN(num) ? 0 : num
      })
      .filter(num => num > 0)
    
    if (existingNumbers.length === 0) return `${prefix}_1`
    
    const maxNumber = Math.max(...existingNumbers)
    return `${prefix}_${maxNumber + 1}`
  }, [data, prefix, idField])
}