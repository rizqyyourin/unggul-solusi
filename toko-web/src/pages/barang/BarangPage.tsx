import { useMemo, useState, useEffect } from 'react'
import { App, Button, Card, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { 
  PlusOutlined, 
  ShoppingOutlined, 
  SearchOutlined,
  ShoppingCartOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import { useList } from '../../lib/hooks'
import { api } from '../../lib/api'
import { useSearch } from '../../hooks/useSearch'
import { useExportCSV } from '../../utils/exportCSV'
import { sanitizeInput } from '../../utils/sanitize'
import { PageHeader, DataTableActions, SearchBar, useResponsivePagination } from '../../components/common'
import type { Barang } from '../../types'

const { Title } = Typography

type FormValues = Omit<Barang, 'kode'> & { kode?: string }

const kategoriOptions = [
  { value: 'ATK', label: 'ATK' },
  { value: 'RT', label: 'RT' },
  { value: 'MASAK', label: 'MASAK' },
  { value: 'ELEKTRONIK', label: 'ELEKTRONIK' }
]

// Warna kategori yang konsisten
const kategoriColors = {
  'ATK': 'blue',
  'RT': 'green', 
  'MASAK': 'orange',
  'ELEKTRONIK': 'purple'
} as const

export default function BarangPage() {
  const { message, modal } = App.useApp()
  const { data, loading, refresh, setData } = useList<Barang>('/barang')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Barang | null>(null)
  const [form] = Form.useForm<FormValues>()
  const [hargaDisplay, setHargaDisplay] = useState('')
  const [filteredKategori, setFilteredKategori] = useState<string[]>([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

  // Generate next kode barang
  const generateNextKode = (): string => {
    if (!data || data.length === 0) return 'BRG_1'
    
    const existingNumbers = data
      .filter(barang => barang.kode.startsWith('BRG_'))
      .map(barang => {
        const num = parseInt(barang.kode.replace('BRG_', ''), 10)
        return isNaN(num) ? 0 : num
      })
      .filter(num => num > 0)
    
    if (existingNumbers.length === 0) return 'BRG_1'
    
    const maxNumber = Math.max(...existingNumbers)
    return `BRG_${maxNumber + 1}`
  }

  // Format number as Indonesian currency (with dots as thousand separators)
  const formatCurrency = (value: string | number): string => {
    if (!value) return ''
    const numStr = value.toString().replace(/[^0-9]/g, '')
    if (!numStr) return ''
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  // Parse currency string to number
  const parseCurrency = (value: string): number => {
    if (!value) return 0
    return parseInt(value.replace(/\./g, ''), 10) || 0
  }

  // Use common search hook
  const {
    searchTerm,
    setSearchTerm,
    filteredData,
    isSearching,
    handleSearch,
    handleClearSearch,
    handleSearchEnter
  } = useSearch({
    data,
    searchFields: ['kode', 'nama', 'kategori'] as (keyof Barang)[]
  })

  // Use common export hook
  const { exportToCSV } = useExportCSV()

  // Use responsive pagination
  const paginationConfig = useResponsivePagination({
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: pagination.total,
    showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} barang${isSearching ? ' (hasil pencarian)' : ''}`,
    onChange: (page, size) => {
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: size || prev.pageSize
      }))
    },
    onShowSizeChange: (current, size) => {
      setPagination(prev => ({
        ...prev,
        current: 1,
        pageSize: size
      }))
    }
  })

  // Get current data to display
  const currentData = isSearching ? filteredData : data

  // Update pagination when data changes
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      total: currentData.length,
      current: 1 // Reset to first page when data changes
    }))
  }, [currentData])

  const handleExportCSV = () => {
    const dataToExport = isSearching ? currentData : data
    exportToCSV({
      filename: 'barang',
      data: dataToExport,
      columns: [
        { key: 'kode', title: 'Kode' },
        { key: 'nama', title: 'Nama' },
        { key: 'kategori', title: 'Kategori' },
        { key: 'harga', title: 'Harga', render: (value) => value.toString() }
      ],
      searchContext: isSearching ? 'hasil-pencarian' : undefined
    })
  }

  const columns: ColumnsType<Barang> = useMemo(() => [
    { 
      title: 'Kode', 
      dataIndex: 'kode',
      key: 'kode',
      sorter: (a: Barang, b: Barang) => {
        const numA = parseInt(a.kode.replace('BRG_', ''), 10)
        const numB = parseInt(b.kode.replace('BRG_', ''), 10)
        return numA - numB
      }
    },
    { 
      title: 'Nama Barang', 
      dataIndex: 'nama',
      key: 'nama',
      sorter: (a: Barang, b: Barang) => a.nama.localeCompare(b.nama),
      render: (nama: string) => (
        <Space>
          <ShoppingCartOutlined style={{ color: '#666', fontSize: '16px' }} />
          <span>{nama}</span>
        </Space>
      )
    },
    { 
      title: 'Kategori', 
      dataIndex: 'kategori',
      key: 'kategori',
      filters: kategoriOptions.map(opt => ({ text: opt.label, value: opt.value })),
      onFilter: (value, record) => record.kategori === value,
      sorter: (a: Barang, b: Barang) => a.kategori.localeCompare(b.kategori),
      render: (kategori: keyof typeof kategoriColors) => (
        <Tag color={kategoriColors[kategori] || 'default'}>{kategori}</Tag>
      )
    },
    { 
      title: 'Harga', 
      dataIndex: 'harga',
      key: 'harga',
      sorter: (a: Barang, b: Barang) => a.harga - b.harga,
      render: (harga: number) => new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR' 
      }).format(harga)
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 120,
      render: (_: unknown, record: Barang) => (
        <Space>
          <Button 
            size="small" 
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            style={{ background: '#1890ff', borderColor: '#1890ff' }}
          >
            Edit
          </Button>
          <Button 
            danger 
            size="small" 
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record)}
            style={{ background: '#ff4d4f', borderColor: '#ff4d4f', color: 'white' }}
          >
            Hapus
          </Button>
        </Space>
      )
    }
  ], [])

  function onAdd() {
    setEditing(null)
    form.resetFields()
    setHargaDisplay('')
    
    // Auto-generate next kode
    const nextKode = generateNextKode()
    form.setFieldsValue({ kode: nextKode })
    
    setOpen(true)
  }

  function onEdit(record: Barang) {
    setEditing(record)
    setHargaDisplay(formatCurrency(record.harga))
    form.setFieldsValue({
      ...record,
      harga: record.harga // Set form field value
    })
    setOpen(true)
  }

  function onDelete(record: Barang) {
    modal.confirm({
      title: `Hapus barang ${record.nama}?`,
      onOk: async () => {
        try {
          await api.delete(`/barang/${record.kode}`)
          message.success('Berhasil dihapus')
          setData((prev: Barang[]) => prev.filter(b => b.kode !== record.kode))
        } catch (e: any) {
          message.error(e?.response?.data?.message || 'Gagal menghapus')
        }
      }
    })
  }

  async function onSubmit(values: FormValues) {
    try {
      // Sanitize inputs
      const sanitizedValues = {
        ...values,
        nama: sanitizeInput.name(values.nama || ''),
        harga: parseCurrency(hargaDisplay),
        // Pastikan kode selalu ada, terutama saat edit
        kode: editing ? editing.kode : values.kode
      }

      // Validation after sanitization
      if (!sanitizedValues.nama || sanitizedValues.nama.length < 2) {
        message.error('Nama barang harus minimal 2 karakter setelah pembersihan')
        return
      }

      if (sanitizedValues.harga < 0) {
        message.error('Harga tidak boleh negatif')
        return
      }

      if (!hargaDisplay || sanitizedValues.harga === 0) {
        message.error('Harga harus diisi dan lebih dari 0')
        return
      }

      // Check for duplicate kode when adding new barang
      if (!editing && sanitizedValues.kode) {
        const kodeToCheck = sanitizedValues.kode.toLowerCase()
        const existingBarang = data.find(barang => 
          barang.kode.toLowerCase() === kodeToCheck
        )
        
        if (existingBarang) {
          message.error(`Kode barang "${sanitizedValues.kode}" sudah ada! Gunakan kode yang berbeda.`)
          return
        }
      }

      if (editing) {
        const updateData = { ...sanitizedValues }
        delete updateData.kode // Hapus kode dari payload karena ada di URL
        await api.put(`/barang/${editing.kode}`, updateData)
        message.success('Berhasil diperbarui')
      } else {
        await api.post('/barang', sanitizedValues)
        message.success('Berhasil ditambahkan')
      }
      setOpen(false)
      setHargaDisplay('')
      refresh()
      
      // Clear search if adding new item
      if (!editing && isSearching) {
        handleClearSearch()
      }
    } catch (e: any) {
      console.error('Error submitting form:', e)
      const errorMessage = e?.response?.data?.message || 
                          e?.response?.data?.error ||
                          e?.message ||
                          'Gagal menyimpan data'
      message.error(`Error: ${errorMessage}`)
    }
  }

  return (
    <>
      <PageHeader 
        icon={<ShoppingOutlined style={{ color: '#1890ff' }} />}
        title="Master Data Barang"
        description="Kelola data barang - tambah, edit, dan hapus informasi barang"
      />

      <Card 
        title={
          <Space size="small" wrap>
            <ShoppingOutlined />
            <span>Master Barang</span>
            <span style={{ color: '#666', fontWeight: 'normal', fontSize: '14px' }}>
              ({isSearching ? `${currentData.length} dari ${data.length}` : `${data.length}`} barang)
            </span>
          </Space>
        } 
        extra={
          <DataTableActions 
            onAdd={onAdd}
            onExport={handleExportCSV}
            addText="Tambah"
            exportDisabled={data.length === 0}
          />
        }
        style={{ borderRadius: 8 }}
      >
        <SearchBar 
          placeholder="Cari berdasarkan kode, nama, atau kategori..."
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          isSearching={isSearching}
          onKeyDown={handleSearchEnter}
        />

        {isSearching && (
          <div style={{ 
            marginBottom: 16, 
            padding: '8px 12px', 
            background: '#f0f9ff', 
            border: '1px solid #bae6fd',
            borderRadius: 6,
            fontSize: '14px',
            color: '#0369a1'
          }}>
            <SearchOutlined style={{ marginRight: 8 }} />
            Menampilkan hasil pencarian untuk: <strong>"{searchTerm}"</strong>
            <Button 
              size="small" 
              type="link" 
              onClick={handleClearSearch}
              style={{ padding: '0 4px', marginLeft: 8 }}
            >
              Hapus filter
            </Button>
          </div>
        )}

        <Table 
          rowKey="kode" 
          loading={loading} 
          columns={columns} 
          dataSource={currentData} 
          pagination={paginationConfig}
          scroll={{ x: 800 }}
          size="middle"
          showSorterTooltip={{ target: 'sorter-icon' }}
          sortDirections={['ascend', 'descend']}
        />
      </Card>
      <Modal 
        open={open} 
        title={editing ? 'Edit Barang' : 'Tambah Barang'} 
        onCancel={() => {
          setOpen(false)
          setHargaDisplay('')
        }} 
        onOk={() => form.submit()} 
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          {editing ? (
            <Form.Item label="Kode Barang">
              <Input value={editing.kode} disabled style={{ background: '#f5f5f5' }} />
            </Form.Item>
          ) : (
            <Form.Item 
              name="kode" 
              label="Kode Barang" 
              rules={[
                { required: true, message: 'Kode barang harus diisi' },
                { 
                  pattern: /^BRG_\d+$/, 
                  message: 'Format kode harus BRG_XXX (contoh: BRG_1, BRG_10)' 
                },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve()
                    
                    const existingBarang = data.find(barang => 
                      barang.kode.toLowerCase() === value.toLowerCase()
                    )
                    
                    if (existingBarang) {
                      return Promise.reject(new Error(`Kode "${value}" sudah ada! Gunakan kode yang berbeda.`))
                    }
                    
                    return Promise.resolve()
                  }
                }
              ]}
            > 
              <Input 
                placeholder="BRG_1" 
                onChange={(e) => {
                  const value = e.target.value.toUpperCase()
                  form.setFieldsValue({ kode: value })
                }}
              /> 
            </Form.Item>
          )}
          <Form.Item 
            name="nama" 
            label="Nama Barang" 
            rules={[
              { required: true, message: 'Nama barang harus diisi' },
              { min: 2, message: 'Nama barang minimal 2 karakter' },
              { max: 100, message: 'Nama barang maksimal 100 karakter' }
            ]}
          > 
            <Input placeholder="Masukkan nama barang" /> 
          </Form.Item>
          <Form.Item 
            name="kategori" 
            label="Kategori" 
            rules={[{ required: true, message: 'Pilih kategori barang' }]}
          >
            <Select placeholder="Pilih kategori dulu" options={kategoriOptions} />
          </Form.Item>
          <Form.Item 
            label="Harga"
            name="harga"
            rules={[
              { required: true, message: 'Harga harus diisi' },
              {
                validator: (_, value) => {
                  const numValue = parseCurrency(hargaDisplay)
                  if (!hargaDisplay || numValue <= 0) {
                    return Promise.reject(new Error('Harga harus lebih dari 0'))
                  }
                  return Promise.resolve()
                }
              }
            ]}
          > 
            <Input 
              placeholder="0"
              value={hargaDisplay}
              onChange={(e) => {
                const value = e.target.value
                const formatted = formatCurrency(value)
                setHargaDisplay(formatted)
                // Update form field value untuk validation
                form.setFieldsValue({ harga: parseCurrency(formatted) })
              }}
              prefix="Rp"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
