// Reusable search bar used across pages for filtering data
import { Input, Button, Space } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'

interface SearchBarProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  onClear?: () => void
  isSearching?: boolean
  loading?: boolean
  onKeyDown?: (e: React.KeyboardEvent) => void
}

export default function SearchBar({
  placeholder,
  value,
  onChange,
  onSearch,
  onClear,
  isSearching = false,
  loading = false,
  onKeyDown
}: SearchBarProps) {
  return (
    <div style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        style={{ flex: 1 }}
        prefix={<SearchOutlined style={{ color: '#999' }} />}
      />
      <Button 
        type="primary" 
        icon={<SearchOutlined />} 
        onClick={onSearch}
        loading={loading}
      >
        Cari
      </Button>
      {isSearching && onClear && (
        <Button 
          icon={<ReloadOutlined />} 
          onClick={onClear}
          title="Tampilkan semua data"
        >
          Reset
        </Button>
      )}
    </div>
  )
}