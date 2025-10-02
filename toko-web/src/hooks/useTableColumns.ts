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
        React.createElement(TableActionButtons, {
          record,
          onEdit,
          onDelete
        })
    }

    return [...baseColumns, actionColumn]
  }, [baseColumns, onEdit, onDelete, actionColumnWidth, excludeActions])
}