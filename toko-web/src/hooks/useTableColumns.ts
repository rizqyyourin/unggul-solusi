import { useMemo } from 'react'
import type { ColumnsType } from 'antd/es/table'
import React from 'react'
import TableActionButtons from '../components/common/TableActionButtons'

interface UseTableColumnsOptions<T> {
  onEdit: (record: T) => void
  onDelete: (record: T) => void
  actionColumnWidth?: number
  excludeActions?: boolean
}

// Hook helper yang menambahkan kolom aksi (Edit / Delete) ke daftar kolom tabel
// Gunakan ketika Anda ingin konsisten menampilkan tombol aksi pada tabel-tabel CRUD
export function useTableColumns<T>(
  baseColumns: ColumnsType<T>,
  options: UseTableColumnsOptions<T>
): ColumnsType<T> {
  const { onEdit, onDelete, actionColumnWidth = 120, excludeActions = false } = options

  return useMemo(() => {
    if (excludeActions) return baseColumns

    const actionColumn = {
      title: 'Aksi',
      key: 'action',
      width: actionColumnWidth,
      render: (_: unknown, record: T) => 
        // Cast to any to avoid TypeScript incompatibility when passing generic callbacks
        React.createElement(TableActionButtons as any, {
          record,
          onEdit,
          onDelete
        })
    }

    return [...baseColumns, actionColumn]
  }, [baseColumns, onEdit, onDelete, actionColumnWidth, excludeActions])
}