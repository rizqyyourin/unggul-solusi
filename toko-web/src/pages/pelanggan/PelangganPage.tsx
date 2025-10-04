import { useMemo, useState, useEffect } from 'react'
import { App, Button, Card, Form, Input, Modal, Radio, Space, Table, Typography, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, SearchOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons'
import { useList } from '../../lib/hooks'
import { api } from '../../lib/api'
import { sanitizeInput, validateInput } from '../../utils/sanitize'
import { useSearch } from '../../hooks/useSearch'
import { useExportCSV } from '../../utils/exportCSV'
import { PageHeader, DataTableActions, SearchBar, useResponsivePagination } from '../../components/common'
import type { Pelanggan } from '../../types'

const { Title } = Typography

type FormValues = Omit<Pelanggan, 'id_pelanggan'> & { id_pelanggan?: string }

// Halaman untuk mengelola data pelanggan
// Fitur: daftar, cari, tambah, edit, hapus pelanggan
export default function PelangganPage() {
  const { message, modal } = App.useApp()
  const { data, loading, refresh, setData } = useList<Pelanggan>('/pelanggan')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Pelanggan | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

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
    searchFields: ['id_pelanggan', 'nama', 'domisili', 'jenis_kelamin'] as (keyof Pelanggan)[]
  })

  // Use common export hook
  const { exportToCSV } = useExportCSV()

  // Use responsive pagination
  const paginationConfig = useResponsivePagination({
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: pagination.total,
    showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} pelanggan${isSearching ? ' (hasil pencarian)' : ''}`,
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
  const [form] = Form.useForm<FormValues>()

  const columns: ColumnsType<Pelanggan> = useMemo(() => [
    { 
      title: 'ID Pelanggan', 
      dataIndex: 'id_pelanggan', 
      key: 'id',
      width: 150,
      sorter: (a: Pelanggan, b: Pelanggan) => {
        // Natural sorting for PELANGGAN_1, PELANGGAN_2, ..., PELANGGAN_10, etc.
        const getNumber = (id: string) => {
          const match = id.match(/PELANGGAN_(\d+)/)
          return match ? parseInt(match[1], 10) : 0
        }
        return getNumber(a.id_pelanggan) - getNumber(b.id_pelanggan)
      }
    },
    { 
      title: 'Nama', 
      dataIndex: 'nama',
      key: 'nama',
      sorter: (a: Pelanggan, b: Pelanggan) => a.nama.localeCompare(b.nama),
      render: (text: string) => (
        <Space>
          <UserOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      )
    },
    { 
      title: 'Domisili', 
      dataIndex: 'domisili',
      key: 'domisili',
      sorter: (a: Pelanggan, b: Pelanggan) => a.domisili.localeCompare(b.domisili)
    },
    { 
      title: 'Jenis Kelamin', 
      dataIndex: 'jenis_kelamin',
      key: 'jenis_kelamin',
      width: 130,
      sorter: (a: Pelanggan, b: Pelanggan) => a.jenis_kelamin.localeCompare(b.jenis_kelamin),
      render: (value: string) => (
        <Tag color={value === 'PRIA' ? 'blue' : 'pink'}>
          {value}
        </Tag>
      ),
      filters: [
        { text: 'PRIA', value: 'PRIA' },
        { text: 'WANITA', value: 'WANITA' }
      ],
      onFilter: (value, record) => record.jenis_kelamin === value
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 120,
      render: (_: unknown, record: Pelanggan) => (
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

  // Generate next pelanggan ID
  const generateNextPelangganId = (): string => {
    if (!data || data.length === 0) return 'PELANGGAN_1'
    
    const existingNumbers = data
      .filter(pelanggan => pelanggan.id_pelanggan.startsWith('PELANGGAN_'))
      .map(pelanggan => {
        const num = parseInt(pelanggan.id_pelanggan.replace('PELANGGAN_', ''), 10)
        return isNaN(num) ? 0 : num
      })
      .filter(num => num > 0)
    
    if (existingNumbers.length === 0) return 'PELANGGAN_1'
    
    const maxNumber = Math.max(...existingNumbers)
    return `PELANGGAN_${maxNumber + 1}`
  }

  function onAdd() {
    setEditing(null)
    form.resetFields()
    
    // Auto-generate next pelanggan ID
    const nextPelangganId = generateNextPelangganId()
    form.setFieldsValue({ 
      id_pelanggan: nextPelangganId,
      jenis_kelamin: 'PRIA' // Set default value
    })
    
    setOpen(true)
  }

  function onEdit(record: Pelanggan) {
    setEditing(record)
    form.setFieldsValue(record)
    setOpen(true)
  }

  function onDelete(record: Pelanggan) {
    modal.confirm({
      title: 'Konfirmasi Hapus',
      content: `Apakah Anda yakin ingin menghapus pelanggan "${record.nama}"? Tindakan ini tidak dapat dibatalkan.`,
      okText: 'Ya, Hapus',
      cancelText: 'Batal',
      okType: 'danger',
      onOk: async () => {
        try {
          await api.delete(`/pelanggan/${record.id_pelanggan}`)
          message.success('Pelanggan berhasil dihapus')
          setData((prev: Pelanggan[]) => prev.filter((p: Pelanggan) => p.id_pelanggan !== record.id_pelanggan))
        } catch (e: any) {
          const errorMsg = e?.response?.data?.message || 'Gagal menghapus pelanggan'
          message.error(errorMsg)
        }
      }
    })
  }

  async function onSubmit(values: FormValues) {
    // Security validation before submission
    const { id_pelanggan, nama, domisili } = values
    
    // Check for suspicious content
    if (nama && validateInput.isSuspicious(nama)) {
      message.error('Input nama mengandung karakter yang tidak diizinkan')
      return
    }
    if (domisili && validateInput.isSuspicious(domisili)) {
      message.error('Input domisili mengandung karakter yang tidak diizinkan')
      return
    }
    if (id_pelanggan && validateInput.isSuspicious(id_pelanggan)) {
      message.error('Input ID mengandung karakter yang tidak diizinkan')
      return
    }

    // Sanitize inputs
    const sanitizedValues = {
      ...values,
      ...(id_pelanggan && { id_pelanggan: sanitizeInput.id(id_pelanggan) }),
      ...(nama && { nama: sanitizeInput.name(nama) }),
      ...(domisili && { domisili: sanitizeInput.location(domisili) })
    }

    // Additional length validation after sanitization
    if (sanitizedValues.nama && sanitizedValues.nama.length < 2) {
      message.error('Nama harus minimal 2 karakter setelah pembersihan')
      return
    }

    setSubmitting(true)
    try {
      if (editing) {
        await api.put(`/pelanggan/${editing.id_pelanggan}`, sanitizedValues)
        message.success('Data pelanggan berhasil diperbarui')
        // Update local state optimistically
        setData((prev: Pelanggan[]) => 
          prev.map(p => p.id_pelanggan === editing.id_pelanggan ? { ...p, ...sanitizedValues } : p)
        )
      } else {
        const response = await api.post('/pelanggan', sanitizedValues)
        message.success('Pelanggan baru berhasil ditambahkan')
        // Add new item to local state
        if (response.data?.data) {
          setData((prev: Pelanggan[]) => [...prev, response.data.data])
        } else {
          refresh() // Fallback to refresh if response format is unexpected
        }
      }
      setOpen(false)
      form.resetFields()
      
      // Clear search if adding new item
      if (!editing && isSearching) {
        handleClearSearch()
      }
    } catch (e: any) {
      const err = e?.response?.data
      if (err?.errors) {
        // Handle validation errors
        const firstError = Object.values(err.errors)[0] as string[]
        message.error(firstError?.[0] || 'Terjadi kesalahan validasi')
      } else {
        message.error(err?.message || 'Gagal menyimpan data pelanggan')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleExportCSV = () => {
    const dataToExport = isSearching ? currentData : data
    exportToCSV({
      filename: 'pelanggan',
      data: dataToExport,
      columns: [
        { key: 'id_pelanggan', title: 'ID Pelanggan' },
        { key: 'nama', title: 'Nama' },
        { key: 'domisili', title: 'Domisili' },
        { key: 'jenis_kelamin', title: 'Jenis Kelamin' }
      ],
      searchContext: isSearching ? 'hasil-pencarian' : undefined
    })
  }

  return (
    <div>
      <PageHeader 
        icon={<UserOutlined style={{ color: '#1890ff' }} />}
        title="Master Data Pelanggan"
        description="Kelola data pelanggan - tambah, edit, dan hapus informasi pelanggan"
      />

      <Card 
        title={
          <Space size="small" wrap>
            <UserOutlined />
            <span>Daftar Pelanggan</span>
            <span style={{ color: '#666', fontWeight: 'normal', fontSize: '14px' }}>
              ({isSearching ? `${currentData.length} dari ${data.length}` : `${data.length}`} pelanggan)
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
          placeholder="Cari berdasarkan ID, nama, domisili, atau jenis kelamin..."
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
              type="link" 
              size="small" 
              onClick={handleClearSearch}
              style={{ padding: '0 8px', height: 'auto' }}
            >
              Hapus filter
            </Button>
          </div>
        )}

        <Table 
          rowKey="id_pelanggan" 
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
        title={
          <Space>
            <UserOutlined />
            {editing ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
          </Space>
        } 
        onCancel={() => {
          setOpen(false)
          form.resetFields()
        }} 
        onOk={() => form.submit()} 
        destroyOnClose
        width={500}
        confirmLoading={submitting}
        okText={editing ? 'Simpan Perubahan' : 'Tambah Pelanggan'}
        cancelText="Batal"
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={onSubmit} 
          initialValues={{ jenis_kelamin: 'PRIA' }}
          style={{ marginTop: 24 }}
        >
          {!editing ? (
            <Form.Item 
              name="id_pelanggan" 
              label="ID Pelanggan"
              rules={[
                { required: true, message: 'ID Pelanggan wajib diisi' },
                { pattern: /^PELANGGAN_\d+$/, message: 'Format ID harus PELANGGAN_XXX (contoh: PELANGGAN_1, PELANGGAN_10)' },
                {
                  validator: (_, value) => {
                    if (value && validateInput.isSuspicious(value)) {
                      return Promise.reject(new Error('ID mengandung karakter yang tidak diizinkan'))
                    }
                    return Promise.resolve()
                  }
                }
              ]}
            >
              <Input 
                placeholder="PELANGGAN_1" 
                maxLength={20}
                onChange={(e) => {
                  // Real-time sanitization for ID
                  const sanitized = sanitizeInput.id(e.target.value)
                  if (sanitized !== e.target.value) {
                    form.setFieldsValue({ id_pelanggan: sanitized })
                  }
                }}
              />
            </Form.Item>
          ) : (
            <Form.Item 
              name="id_pelanggan" 
              label="ID Pelanggan"
            >
              <Input 
                readOnly
                style={{ 
                  backgroundColor: '#f5f5f5',
                  color: '#666',
                  cursor: 'not-allowed'
                }}
              />
            </Form.Item>
          )}
          <Form.Item 
            name="nama" 
            label="Nama Lengkap" 
            rules={[
              { required: true, message: 'Nama wajib diisi' },
              { min: 2, message: 'Nama minimal 2 karakter' },
              { max: 100, message: 'Nama maksimal 100 karakter' },
              {
                validator: (_, value) => {
                  if (value && validateInput.isSuspicious(value)) {
                    return Promise.reject(new Error('Nama mengandung karakter yang tidak diizinkan'))
                  }
                  return Promise.resolve()
                }
              }
            ]}
          >
            <Input 
              placeholder="Masukkan nama lengkap (huruf, spasi, titik, apostrof)" 
              onChange={(e) => {
                // Real-time sanitization for better UX
                const sanitized = sanitizeInput.name(e.target.value)
                if (sanitized !== e.target.value) {
                  form.setFieldsValue({ nama: sanitized })
                }
              }}
            />
          </Form.Item>
          <Form.Item 
            name="domisili" 
            label="Domisili" 
            rules={[
              { required: true, message: 'Domisili wajib diisi' },
              { max: 20, message: 'Domisili maksimal 20 karakter' },
              {
                validator: (_, value) => {
                  if (value && validateInput.isSuspicious(value)) {
                    return Promise.reject(new Error('Domisili mengandung karakter yang tidak diizinkan'))
                  }
                  return Promise.resolve()
                }
              }
            ]}
          >
            <Input 
              placeholder="Contoh: Jakarta, Bandung, Surabaya" 
              onChange={(e) => {
                // Real-time sanitization for better UX
                const sanitized = sanitizeInput.location(e.target.value)
                if (sanitized !== e.target.value) {
                  form.setFieldsValue({ domisili: sanitized })
                }
              }}
            />
          </Form.Item>
          <Form.Item 
            name="jenis_kelamin" 
            label="Jenis Kelamin" 
            rules={[{ required: true, message: 'Pilih jenis kelamin' }]}
          > 
            <Radio.Group>
              <Radio value="PRIA">Pria</Radio>
              <Radio value="WANITA">Wanita</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

