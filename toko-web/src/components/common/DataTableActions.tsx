// Small toolbar for data tables: export and add actions
import { Button, Space } from 'antd'
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons'
import { ReactNode } from 'react'

interface DataTableActionsProps {
  onAdd: () => void
  onExport: () => void
  addText: string
  exportDisabled?: boolean
  customActions?: ReactNode[]
}

export default function DataTableActions({ 
  onAdd, 
  onExport, 
  addText, 
  exportDisabled = false,
  customActions = []
}: DataTableActionsProps) {
  return (
    <div className="data-table-actions">
      <Space size="small" wrap>
        {/* Export button - triggers CSV export via utils */}
        <Button 
          icon={<DownloadOutlined />} 
          onClick={onExport}
          size="middle"
          disabled={exportDisabled}
          title="Export data ke CSV"
        >
          <span className="export-text">Export CSV</span>
        </Button>
        {customActions.map((action, index) => (
          <span key={index}>{action}</span>
        ))}
        {/* Add button - opens modal/form to add new record */}
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={onAdd}
          size="middle"
        >
          <span className="add-text">{addText}</span>
        </Button>
      </Space>
    </div>
  )
}