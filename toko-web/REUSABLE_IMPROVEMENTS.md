## 🚀 Implementasi Reusable Components - Example Usage

### 1. TableActionButtons dengan Popconfirm
Mengganti action buttons duplikat dengan component reusable + konfirmasi delete.

```tsx
// Sebelum (di setiap page):
<Space>
  <Button size="small" type="primary" icon={<EditOutlined />} onClick={() => onEdit(record)}>
    Edit
  </Button>
  <Button danger size="small" icon={<DeleteOutlined />} onClick={() => onDelete(record)}>
    Hapus
  </Button>
</Space>

// Sesudah (1 line):
import { TableActionButtons } from '../../components/common'
<TableActionButtons record={record} onEdit={onEdit} onDelete={onDelete} />
```

### 2. useAutoId Hook
Mengganti logic generate ID duplikat dengan hook reusable.

```tsx
// Sebelum (duplikasi di setiap page):
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

// Sesudah (1 line):
import { useAutoId } from '../../hooks'
const nextId = useAutoId({ data, prefix: 'PELANGGAN', idField: 'id_pelanggan' })
```

### 3. Validation Rules Factory
Mengganti validation rules duplikat dengan factory functions.

```tsx
// Sebelum (duplikasi pattern):
{ pattern: /^PELANGGAN_\d+$/, message: 'Format ID harus PELANGGAN_XXX (contoh: PELANGGAN_1, PELANGGAN_10)' }
{ pattern: /^BRG_\d+$/, message: 'Format ID harus BRG_XXX (contoh: BRG_1, BRG_10)' }
{ pattern: /^NOTA_\d+$/, message: 'Format ID harus NOTA_XXX (contoh: NOTA_1, NOTA_10)' }

// Sesudah (reusable):
import { createIdValidation, createRequiredRule } from '../../utils'
rules={[
  createRequiredRule('ID Pelanggan'),
  createIdValidation({ prefix: 'PELANGGAN', label: 'ID Pelanggan' })
]}
```

### 4. useMediaQuery Hook
Mengganti mobile detection duplikat dengan hook centralized.

```tsx
// Sebelum (duplikasi di App.tsx dan ResponsivePagination.tsx):
const [isMobile, setIsMobile] = useState(false)
useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth < 992)
  checkMobile()
  window.addEventListener('resize', checkMobile)
  return () => window.removeEventListener('resize', checkMobile)
}, [])

// Sesudah (1 line):
import { useMediaQuery } from '../../hooks'
const { isMobile } = useMediaQuery({ breakpoint: 992 })
```

### 5. Enhanced useCrudForm Hook
Expands current hook untuk handle lebih banyak CRUD patterns.

```tsx
// Usage:
const {
  form,
  open,
  editing,
  loading,
  openCreateModal,
  openEditModal,
  closeModal,
  handleSubmit
} = useCrudForm<Pelanggan>({
  endpoint: '/pelanggan',
  onSuccess: refresh,
  successMessage: {
    create: 'Pelanggan berhasil ditambahkan',
    update: 'Pelanggan berhasil diperbarui'
  }
})
```

## 📊 Impact Summary

### Code Reduction:
- **TableActionButtons**: ~15 lines → 1 line per table
- **useAutoId**: ~20 lines → 1 line per auto-generate
- **Validation Rules**: ~5 lines → 1 line per rule
- **Media Query**: ~10 lines → 1 line per usage

### Maintainability:
- **Centralized Logic**: Update di satu tempat, apply ke semua
- **Type Safety**: Full TypeScript support
- **Consistent Behavior**: Popconfirm delete, sama styling
- **Testing**: Bisa test components secara isolated

### Developer Experience:
- **Faster Development**: Copy-paste reduced drastically
- **Better Readability**: Less boilerplate, fokus ke business logic
- **Easier Onboarding**: Pattern yang jelas dan terdokumentasi