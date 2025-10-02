import { useEffect, useMemo, useState } from 'react'
import { App, Button, Card, DatePicker, Form, Input, InputNumber, Modal, Select, Space, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
import { PlusOutlined, ShoppingCartOutlined, SearchOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons'
import { useList } from '../../lib/hooks'
import { api } from '../../lib/api'
import { useSearch } from '../../hooks/useSearch'
import { useExportCSV } from '../../utils/exportCSV'
import { PageHeader, DataTableActions, SearchBar, useResponsivePagination } from '../../components/common'
import type { Barang, ItemPenjualan, Pelanggan, Penjualan } from '../../types'

type PenjualanForm = {
  id_nota?: string
  tgl: dayjs.Dayjs
  kode_pelanggan: string
  items: Array<{ kode_barang: string; qty: number }>
}

export default function PenjualanPage() {
  // Set dayjs locale to Indonesian for month names
  dayjs.locale('id')
  
  const { message, modal } = App.useApp()
  const { data, loading, refresh } = useList<Penjualan>('/penjualan')
  const pel = useList<Pelanggan>('/pelanggan')
  const brg = useList<Barang>('/barang')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Penjualan | null>(null)
  const [form] = Form.useForm<PenjualanForm>()
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
    searchFields: ['id_nota', 'kode_pelanggan'] as (keyof Penjualan)[]
  })

  // Use common export hook
  const { exportToCSV } = useExportCSV()

  // Use responsive pagination
  const paginationConfig = useResponsivePagination({
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: pagination.total,
    showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} transaksi${isSearching ? ' (hasil pencarian)' : ''}`,
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

  // Debug data received from API
  useEffect(() => {
    console.log('=== API DATA DEBUG ===')
    console.log('Raw data from API:', data)
    if (data.length > 0) {
      console.log('First record:', JSON.stringify(data[0], null, 2))
      console.log('item_penjualan in first record:', data[0].item_penjualan)
    }
  }, [data])

  // Generate next nota ID
  const generateNextNota = (): string => {
    if (!data || data.length === 0) return 'NOTA_1'
    
    const existingNumbers = data
      .filter(penjualan => penjualan.id_nota.startsWith('NOTA_'))
      .map(penjualan => {
        const num = parseInt(penjualan.id_nota.replace('NOTA_', ''), 10)
        return isNaN(num) ? 0 : num
      })
      .filter(num => num > 0)
    
    if (existingNumbers.length === 0) return 'NOTA_1'
    
    const maxNumber = Math.max(...existingNumbers)
    return `NOTA_${maxNumber + 1}`
  }

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
      filename: 'penjualan',
      data: dataToExport,
      columns: [
        { key: 'id_nota', title: 'ID Nota' },
        { 
          key: 'tgl', 
          title: 'Tanggal',
          render: (value) => dayjs(value).format('YYYY-MM-DD')
        },
        { 
          key: 'kode_pelanggan', 
          title: 'Kode Pelanggan'
        },
        { 
          key: 'pelanggan', 
          title: 'Nama Pelanggan',
          render: (value, record) => record.pelanggan?.nama || ''
        },
        { 
          key: 'subtotal', 
          title: 'Subtotal',
          render: (value) => value.toString()
        }
      ],
      searchContext: isSearching ? 'hasil-pencarian' : undefined
    })
  }

  const columns: ColumnsType<Penjualan> = useMemo(() => [
    { 
      title: 'ID Nota', 
      dataIndex: 'id_nota',
      key: 'id_nota',
      sorter: (a: Penjualan, b: Penjualan) => {
        const numA = parseInt(a.id_nota.replace('NOTA_', ''), 10)
        const numB = parseInt(b.id_nota.replace('NOTA_', ''), 10)
        return numA - numB
      }
    },
    { 
      title: 'Tanggal', 
      dataIndex: 'tgl',
      key: 'tgl',
      sorter: (a: Penjualan, b: Penjualan) => dayjs(a.tgl).valueOf() - dayjs(b.tgl).valueOf(),
      render: (tgl: string) => dayjs(tgl).format('DD MMMM YYYY')
    },
    { 
      title: 'Pelanggan', 
      dataIndex: ['pelanggan', 'nama'],
      key: 'pelanggan',
      sorter: (a: Penjualan, b: Penjualan) => (a.pelanggan?.nama || '').localeCompare(b.pelanggan?.nama || ''),
      render: (nama: string) => (
        <Space>
          <UserOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: 500 }}>{nama}</span>
        </Space>
      )
    },
    { 
      title: 'Subtotal', 
      dataIndex: 'subtotal',
      key: 'subtotal',
      sorter: (a: Penjualan, b: Penjualan) => a.subtotal - b.subtotal,
      render: (subtotal: number) => new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR' 
      }).format(subtotal)
    },
    {
      title: 'Aksi',
      key: 'action',
      width: 140,
      render: (_: unknown, record: Penjualan) => (
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
    
    // Auto-generate next nota ID dan set tanggal hari ini
    const nextNota = generateNextNota()
    form.setFieldsValue({ 
      id_nota: nextNota,
      tgl: dayjs(),
      items: [] // Mulai dengan items kosong
    })
    
    setOpen(true)
  }

  function onEdit(record: Penjualan) {
    setEditing(record)
    console.log('=== EDIT DEBUG ===')
    console.log('Full record:', JSON.stringify(record, null, 2))
    console.log('record.item_penjualan:', record.item_penjualan)
    console.log('Type of item_penjualan:', typeof record.item_penjualan)
    console.log('Is array?', Array.isArray(record.item_penjualan))
    
    const items = (record.item_penjualan || []).map(i => ({ 
      kode_barang: i.kode_barang, 
      qty: i.qty 
    }))
    
    console.log('Mapped items:', items)
    console.log('Items length:', items.length)
    
    const formData = {
      id_nota: record.id_nota,
      tgl: dayjs(record.tgl),
      kode_pelanggan: record.kode_pelanggan,
      items: items
    }
    
    console.log('Form data to set:', formData)
    
    form.setFieldsValue(formData)
    setOpen(true)
  }

  function onDelete(record: Penjualan) {
    modal.confirm({
      title: `Hapus penjualan ${record.id_nota}?`,
      onOk: async () => {
        try {
          await api.delete(`/penjualan/${record.id_nota}`)
          message.success('Berhasil dihapus')
          refresh()
        } catch (e: any) {
          message.error(e?.response?.data?.message || 'Gagal menghapus')
        }
      }
    })
  }

  async function onSubmit(values: PenjualanForm) {
    try {
      // Validasi items
      if (!values.items || values.items.length === 0) {
        message.error('Harus menambahkan minimal 1 item barang')
        return
      }

      // Validasi setiap item
      for (let i = 0; i < values.items.length; i++) {
        const item = values.items[i]
        if (!item.kode_barang) {
          message.error(`Item ${i + 1}: Barang harus dipilih`)
          return
        }
        if (!item.qty || item.qty <= 0) {
          message.error(`Item ${i + 1}: Qty harus lebih dari 0`)
          return
        }
      }

      const payload = {
        ...values,
        tgl: values.tgl.format('YYYY-MM-DD'),
        id_nota: editing ? editing.id_nota : values.id_nota
      }
      
      if (editing) {
        const updatePayload = { ...payload }
        delete updatePayload.id_nota // Hapus id_nota dari payload karena ada di URL
        await api.put(`/penjualan/${editing.id_nota}`, updatePayload)
        message.success('Berhasil diperbarui')
      } else {
        await api.post('/penjualan', payload)
        message.success('Berhasil ditambahkan')
      }
      setOpen(false)
      refresh()
      
      // Clear search if adding new item
      if (!editing && isSearching) {
        handleClearSearch()
      }
    } catch (e: any) {
      console.error('Error submitting penjualan:', e)
      const errorMessage = e?.response?.data?.message || 
                          e?.response?.data?.error ||
                          e?.message ||
                          'Gagal menyimpan data'
      message.error(`Error: ${errorMessage}`)
    }
  }

  const itemColumns = [
    {
      title: 'Barang',
      dataIndex: 'kode_barang',
      render: (_: unknown, __: unknown, index: number) => (
        <Form.Item style={{ marginBottom: 0 }} name={[index, 'kode_barang']} rules={[{ required: true }]}>
          <Select options={brg.data.map(b => ({ value: b.kode, label: `${b.kode} - ${b.nama}` }))} style={{ minWidth: 240 }} />
        </Form.Item>
      )
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      render: (_: unknown, __: unknown, index: number) => (
        <Form.Item style={{ marginBottom: 0 }} name={[index, 'qty']} rules={[{ required: true, type: 'number', min: 1 }]}> 
          <InputNumber min={1} />
        </Form.Item>
      )
    },
    {
      title: 'Harga',
      render: (_: unknown, __: unknown, index: number) => {
        const item = form.getFieldValue(['items', index]) as { kode_barang?: string; qty?: number }
        const barang = brg.data.find(b => b.kode === item?.kode_barang)
        const total = (barang?.harga || 0) * (item?.qty || 0)
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(total)
      }
    }
  ]

  // Recompute subtotal when form values change
  const [subtotal, setSubtotal] = useState(0)
  const watchedItems = Form.useWatch('items', form) as Array<{ kode_barang?: string; qty?: number }> | undefined
  useEffect(() => {
    const items = watchedItems || []
    const sub = items.reduce((acc: number, it) => {
      const barang = brg.data.find(b => b.kode === it?.kode_barang)
      return acc + (barang?.harga || 0) * (it?.qty || 0)
    }, 0)
    setSubtotal(sub)
  }, [watchedItems, brg.data])

  return (
    <>
      <PageHeader 
        icon={<ShoppingCartOutlined style={{ color: '#1890ff' }} />}
        title="Transaksi Penjualan"
        description="Kelola transaksi penjualan - tambah, edit, dan hapus data penjualan"
      />

      <Card 
        title={
          <Space size="small" wrap>
            <ShoppingCartOutlined />
            <span>Transaksi Penjualan</span>
            <span style={{ color: '#666', fontWeight: 'normal', fontSize: '14px' }}>
              ({isSearching ? `${currentData.length} dari ${data.length}` : `${data.length}`} transaksi)
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
          placeholder="Cari berdasarkan ID nota atau kode pelanggan..."
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
          rowKey="id_nota" 
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
        width="90%" 
        style={{ maxWidth: '800px' }}
        title={editing ? 'Edit Penjualan' : 'Tambah Penjualan'} 
        onCancel={() => setOpen(false)} 
        onOk={() => form.submit()} 
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onSubmit} onValuesChange={() => {
          const items: Array<{ kode_barang?: string; qty?: number }> = form.getFieldValue('items') || []
          const sub = items.reduce((acc: number, it) => {
            const barang = brg.data.find(b => b.kode === it?.kode_barang)
            return acc + (barang?.harga || 0) * (it?.qty || 0)
          }, 0)
          setSubtotal(sub)
        }}>
          {editing ? (
            <Form.Item label="ID Nota">
              <Input value={editing.id_nota} disabled style={{ background: '#f5f5f5' }} />
            </Form.Item>
          ) : (
            <Form.Item 
              name="id_nota" 
              label="ID Nota" 
              rules={[
                { required: true, message: 'ID Nota harus diisi' },
                { 
                  pattern: /^NOTA_\d+$/, 
                  message: 'Format ID harus NOTA_XXX (contoh: NOTA_1, NOTA_10)' 
                },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve()
                    
                    const existingNota = data.find(penjualan => 
                      penjualan.id_nota.toLowerCase() === value.toLowerCase()
                    )
                    
                    if (existingNota) {
                      return Promise.reject(new Error(`ID Nota "${value}" sudah ada! Gunakan ID yang berbeda.`))
                    }
                    
                    return Promise.resolve()
                  }
                }
              ]}
            > 
              <Input 
                placeholder="NOTA_1"
                onChange={(e) => {
                  const value = e.target.value.toUpperCase()
                  form.setFieldsValue({ id_nota: value })
                }}
              /> 
            </Form.Item>
          )}
          <Form.Item 
            name="tgl" 
            label="Tanggal" 
            rules={[{ required: true, message: 'Tanggal harus dipilih' }]}
          > 
            <DatePicker 
              style={{ width: '100%' }} 
              placeholder="Pilih tanggal"
              format="DD/MM/YYYY"
            /> 
          </Form.Item>
          <Form.Item 
            name="kode_pelanggan" 
            label="Pelanggan" 
            rules={[{ required: true, message: 'Pilih pelanggan' }]}
          > 
            <Select 
              placeholder="Pilih pelanggan dulu"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={pel.data.map(p => ({ 
                value: p.id_pelanggan, 
                label: `${p.id_pelanggan} - ${p.nama}` 
              }))} 
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <Typography.Title level={5} style={{ margin: 0 }}>Items Barang</Typography.Title>
          </div>
          
          <Form.List name="items">
            {(fields: any[], ops: any) => (
              <>
                {fields.length === 0 ? (
                  <div 
                    className="penjualan-empty-state"
                    style={{ 
                      textAlign: 'center', 
                      padding: '40px 20px',
                      border: '2px dashed #d9d9d9',
                      borderRadius: '8px',
                      background: '#fafafa',
                      marginTop: '16px'
                    }}
                  >
                    <ShoppingCartOutlined style={{ fontSize: '32px', color: '#bfbfbf', marginBottom: '16px' }} />
                    <div style={{ color: '#666', marginBottom: '16px' }}>
                      Belum ada item barang ditambahkan
                    </div>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      onClick={() => ops.add({ kode_barang: brg.data[0]?.kode || '', qty: 1 })}
                      disabled={brg.data.length === 0}
                    >
                      Tambah Item Pertama
                    </Button>
                  </div>
                ) : (
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                      <Button 
                        className="tambah-item-button"
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => ops.add({ kode_barang: brg.data[0]?.kode || '', qty: 1 })}
                        disabled={brg.data.length === 0}
                      >
                        Tambah Item
                      </Button>
                    </div>
                    <Table
                      pagination={false}
                      rowKey="key"
                      columns={[
                        ...itemColumns,
                        {
                          title: 'Aksi',
                          width: 80,
                          render: (_: unknown, __: unknown, index: number) => (
                            <Button 
                              danger 
                              size="small" 
                              icon={<DeleteOutlined />}
                              onClick={() => ops.remove(index)}
                              style={{ background: '#ff4d4f', borderColor: '#ff4d4f', color: 'white' }}
                            >
                              Hapus
                            </Button>
                          )
                        }
                      ]}
                      dataSource={fields}
                    />
                  </div>
                )}
              </>
            )}
          </Form.List>

          <div 
            className="penjualan-subtotal"
            style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}
          >
            <Typography.Text strong>
              Subtotal: {new Intl.NumberFormat('id-ID', { 
                style: 'currency', 
                currency: 'IDR' 
              }).format(subtotal)}
            </Typography.Text>
          </div>
        </Form>
      </Modal>
    </>
  )
}
