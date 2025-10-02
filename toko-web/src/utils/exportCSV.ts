import { App } from 'antd'

export interface ExportColumn {
  key: string
  title: string
  render?: (value: any, record: any) => string
}

export interface ExportCSVOptions {
  filename: string
  data: any[]
  columns: ExportColumn[]
  searchContext?: string
}

export function useExportCSV() {
  const { message } = App.useApp()

  const exportToCSV = ({ filename, data, columns, searchContext }: ExportCSVOptions) => {
    try {
      if (data.length === 0) {
        message.warning('Tidak ada data untuk diekspor')
        return
      }

      // CSV headers
      const headers = columns.map(col => col.title)
      
      // Convert data to CSV rows
      const csvRows = [
        headers.join(','),
        ...data.map(record => 
          columns.map(col => {
            let value = record[col.key]
            
            // Apply custom render if exists
            if (col.render) {
              value = col.render(value, record)
            }
            
            // Handle special characters and wrap in quotes if needed
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
              value = `"${value.replace(/"/g, '""')}"`
            }
            
            return value || ''
          }).join(',')
        )
      ]
      
      // Create CSV content
      const csvContent = csvRows.join('\n')
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      
      const timestamp = new Date().toISOString().split('T')[0]
      const finalFilename = searchContext 
        ? `${filename}-${searchContext}-${timestamp}.csv`
        : `${filename}-${timestamp}.csv`
      
      link.setAttribute('download', finalFilename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      message.success(`Data berhasil diekspor (${data.length} record)`)
    } catch (error) {
      message.error('Gagal mengekspor data CSV')
    }
  }

  return { exportToCSV }
}