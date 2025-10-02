# Common CRUD Components Documentation

Dokumentasi ini menjelaskan komponen-komponen reusable yang telah dibuat untuk halaman CRUD. Komponen ini dirancang berdasarkan pattern dari halaman PelangganPage yang sudah optimal dan responsif.

## 📁 File Structure

```
src/
├── components/common/
│   ├── index.ts                    # Export semua komponen
│   ├── PageHeader.tsx              # Header halaman dengan icon dan deskripsi
│   ├── DataTableActions.tsx        # Tombol aksi (Tambah, Export, dll)
│   ├── SearchBar.tsx               # Bar pencarian yang responsif
│   └── ResponsivePagination.tsx    # Hook untuk pagination responsif
├── lib/
│   ├── exportCSV.ts               # Utility untuk export CSV
│   └── useSearch.ts               # Hook untuk search functionality
└── styles/
    └── common-crud.css            # Styling umum untuk halaman CRUD
```

## 🎯 Quick Start - Template untuk Halaman CRUD Baru

```tsx
import { useState } from 'react'
import { App, Card, Table } from 'antd'
import { YourIcon } from '@ant-design/icons'
import { useList } from '../../lib/hooks'
import { useSearch } from '../../lib/useSearch'
import { useExportCSV } from '../../lib/exportCSV'
import { PageHeader, DataTableActions, SearchBar, useResponsivePagination } from '../../components/common'
import type { YourDataType } from '../../types'

export default function YourPage() {
  const { data, loading, refresh } = useList<YourDataType>('/your-endpoint')
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })

  // Search functionality
  const {
    searchTerm, setSearchTerm, filteredData, isSearching,
    handleSearch, handleClearSearch, handleSearchEnter
  } = useSearch({
    data,
    searchFields: ['field1', 'field2', 'field3'] as (keyof YourDataType)[]
  })

  // Export functionality
  const { exportToCSV } = useExportCSV()

  // Responsive pagination
  const paginationConfig = useResponsivePagination({
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: pagination.total,
    showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} items`,
    onChange: (page, size) => setPagination(prev => ({ ...prev, current: page, pageSize: size || prev.pageSize })),
    onShowSizeChange: (current, size) => setPagination(prev => ({ ...prev, current: 1, pageSize: size }))
  })

  const currentData = isSearching ? filteredData : data

  const handleExportCSV = () => {
    exportToCSV({
      filename: 'your-data',
      data: currentData,
      columns: [
        { key: 'field1', title: 'Field 1' },
        { key: 'field2', title: 'Field 2' }
      ],
      searchContext: isSearching ? 'hasil-pencarian' : undefined
    })
  }

  return (
    <div>
      <PageHeader 
        icon={<YourIcon style={{ color: '#1890ff' }} />}
        title="Your Page Title"
        description="Your page description"
      />

      <Card 
        title="Your Data List"
        extra={
          <DataTableActions 
            onAdd={() => {/* handle add */}}
            onExport={handleExportCSV}
            addText="Tambah Item"
            exportDisabled={data.length === 0}
          />
        }
      >
        <SearchBar 
          placeholder="Search your data..."
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          isSearching={isSearching}
          onKeyDown={handleSearchEnter}
        />

        <Table 
          rowKey="id"
          loading={loading}
          columns={yourColumns}
          dataSource={currentData}
          pagination={paginationConfig}
        />
      </Card>
    </div>
  )
}
```

## 📋 Komponen Details

### 1. PageHeader
Header konsisten untuk semua halaman CRUD.

```tsx
<PageHeader 
  icon={<UserOutlined style={{ color: '#1890ff' }} />}
  title="Master Data Pelanggan"
  description="Kelola data pelanggan - tambah, edit, dan hapus informasi pelanggan"
/>
```

### 2. DataTableActions
Tombol aksi yang responsif untuk header card.

```tsx
<DataTableActions 
  onAdd={onAdd}
  onExport={handleExportCSV}
  addText="Tambah Pelanggan"
  exportDisabled={data.length === 0}
  customActions={[<CustomButton key="custom" />]} // optional
/>
```

**Responsif Behavior:**
- Desktop: "Export CSV" + "Tambah Pelanggan"
- Mobile: 📥 + ➕ (icon only)

### 3. SearchBar
Bar pencarian yang sudah terintegrasi dengan state management.

```tsx
<SearchBar 
  placeholder="Cari berdasarkan ID, nama, domisili..."
  value={searchTerm}
  onChange={setSearchTerm}
  onSearch={handleSearch}
  onClear={handleClearSearch}
  isSearching={isSearching}
  onKeyDown={handleSearchEnter}
/>
```

### 4. useResponsivePagination Hook
Hook yang mengatur pagination responsif otomatis.

```tsx
const paginationConfig = useResponsivePagination({
  current: pagination.current,
  pageSize: pagination.pageSize,
  total: pagination.total,
  showTotal: (total, range) => `${range[0]}-${range[1]} dari ${total} items`,
  onChange: (page, size) => { /* handle change */ },
  onShowSizeChange: (current, size) => { /* handle size change */ }
})
```

**Auto Features:**
- Mobile: Hide quick jumper, smaller size, show fewer items
- Desktop: Full pagination with all features

## 🔧 Utility Functions

### useSearch Hook
Mengelola state pencarian dengan fitur filtering otomatis.

```tsx
const { searchTerm, setSearchTerm, filteredData, isSearching, handleSearch, handleClearSearch, handleSearchEnter } = useSearch({
  data: yourData,
  searchFields: ['field1', 'field2', 'field3'] as (keyof YourType)[]
})
```

### useExportCSV Hook
Export data ke CSV dengan format yang konsisten.

```tsx
const { exportToCSV } = useExportCSV()

exportToCSV({
  filename: 'pelanggan',
  data: dataToExport,
  columns: [
    { key: 'id', title: 'ID' },
    { key: 'name', title: 'Nama', render: (value, record) => value.toUpperCase() }
  ],
  searchContext: isSearching ? 'hasil-pencarian' : undefined
})
```

## 🎨 Styling

### Import Common Styles
```css
/* Di main styles.css */
@import './styles/common-crud.css';
```

### Class Names yang Tersedia
- `.data-table-actions` - Container untuk tombol aksi
- Semua styling mobile responsif sudah otomatis apply

## ✅ Benefits

1. **Consistent UI** - Semua halaman CRUD punya look & feel yang sama
2. **Mobile Responsive** - Otomatis responsive tanpa effort tambahan  
3. **Reusable Logic** - Search, export, pagination logic bisa dipake ulang
4. **Easy Maintenance** - Update di satu tempat, apply ke semua halaman
5. **Developer Friendly** - Tinggal copy template dan ganti data type

## 🚀 Next Steps

1. **Apply ke Halaman Barang**: Gunakan template di atas
2. **Apply ke Halaman Penjualan**: Sesuaikan dengan struktur data yang lebih kompleks
3. **Extend Components**: Tambah custom actions atau features sesuai kebutuhan
4. **Theme Consistency**: Semua halaman akan punya styling yang konsisten

Dengan struktur ini, halaman PelangganPage menjadi referensi yang bisa digunakan untuk halaman lainnya dengan effort minimal!