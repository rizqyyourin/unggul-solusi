// Reusable action buttons for table rows: Edit + Delete with confirmation
import { Button, Space, Popconfirm } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

interface TableActionButtonsProps<T = any> {
  record: T
  onEdit: (record: T) => void
  onDelete: (record: T) => void
  editText?: string
  deleteText?: string
  deleteConfirmTitle?: string
  deleteConfirmDescription?: string
  disabled?: {
    edit?: boolean
    delete?: boolean
  }
}

export default function TableActionButtons<T>({
  record,
  onEdit,
  onDelete,
  editText = 'Edit',
  deleteText = 'Hapus',
  deleteConfirmTitle = 'Konfirmasi Hapus',
  deleteConfirmDescription = 'Apakah Anda yakin ingin menghapus data ini?',
  disabled = {}
}: TableActionButtonsProps<T>) {
  return (
    <Space size="small">
      <Button 
        size="small" 
        type="primary"
        icon={<EditOutlined />}
        onClick={() => onEdit(record)}
        disabled={disabled.edit}
        style={{ background: '#1890ff', borderColor: '#1890ff' }}
      >
        {editText}
      </Button>
      <Popconfirm
        title={deleteConfirmTitle}
        description={deleteConfirmDescription}
        onConfirm={() => onDelete(record)}
        okText="Ya, Hapus"
        cancelText="Batal"
        okButtonProps={{ danger: true }}
      >
        <Button 
          danger 
          size="small" 
          icon={<DeleteOutlined />}
          disabled={disabled.delete}
          style={{ background: '#ff4d4f', borderColor: '#ff4d4f', color: 'white' }}
        >
          {deleteText}
        </Button>
      </Popconfirm>
    </Space>
  )
}