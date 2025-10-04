import { useState } from 'react'
import { Form, App } from 'antd'
import { api } from '../lib/api'

// Hook reusable untuk pola CRUD sederhana yang sering muncul di halaman-halaman
// Pada proyek ini banyak halaman memakai pola modal/form untuk create & edit.
// useCrudForm mengenkapsulasi:
// - state modal (open)
// - form instance (Ant Design Form)
// - editing record (ketika melakukan edit)
// - loading saat menyimpan
// - helper functions: openCreateModal, openEditModal, closeModal, handleSubmit
//
// Kontrak singkat:
// - Input: endpoint (string, contohnya '/pelanggan') dan callback onSuccess
// - Output: objek yang berisi form, open, editing, loading, dan helper functions
//
// Catatan implementasi:
// - Pada update, hook mencoba menebak primary key dari record (id, kode, id_nota)
// - Menangani pesan sukses/galat menggunakan Ant Design message
interface UseCrudFormOptions<T> {
  endpoint: string
  onSuccess?: () => void
  successMessage?: {
    create: string
    update: string
  }
}

export function useCrudForm<T>({ 
  endpoint, 
  onSuccess,
  successMessage = {
    create: 'Berhasil ditambahkan',
    update: 'Berhasil diperbarui'
  }
}: UseCrudFormOptions<T>) {
  const { message } = App.useApp()
  const [form] = Form.useForm<T>()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)

  // Buka modal untuk membuat data baru
  const openCreateModal = () => {
    setEditing(null)
    form.resetFields()
    setOpen(true)
  }

  // Buka modal untuk mengedit data yang ada
  const openEditModal = (record: T) => {
    setEditing(record)
    form.setFieldsValue(record as any)
    setOpen(true)
  }

  const closeModal = () => {
    setOpen(false)
    setEditing(null)
    form.resetFields()
  }

  // Handle submit untuk create/update
  const handleSubmit = async (values: T) => {
    setLoading(true)
    try {
      if (editing) {
        // @ts-ignore - dynamic endpoint construction based on common key names
        await api.put(`${endpoint}/${editing.id || (editing as any).kode || (editing as any).id_nota}`, values)
        message.success(successMessage.update)
      } else {
        await api.post(endpoint, values)
        message.success(successMessage.create)
      }
      closeModal()
      onSuccess?.()
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    open,
    editing,
    loading,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit
  }
}