import { useState } from 'react'
import { Form, App } from 'antd'
import { api } from '../lib/api'

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

  const openCreateModal = () => {
    setEditing(null)
    form.resetFields()
    setOpen(true)
  }

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

  const handleSubmit = async (values: T) => {
    setLoading(true)
    try {
      if (editing) {
        // @ts-ignore - dynamic endpoint construction
        await api.put(`${endpoint}/${editing.id || editing.kode || editing.id_nota}`, values)
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