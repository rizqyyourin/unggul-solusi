import { Modal, Form, FormInstance } from 'antd'
import { ReactNode } from 'react'

interface FormModalProps {
  title: string
  open: boolean
  onCancel: () => void
  onOk: () => void
  children: ReactNode
  form?: FormInstance
  confirmLoading?: boolean
  okText?: string
  cancelText?: string
  width?: number
  destroyOnClose?: boolean
}

export function FormModal({
  title,
  open,
  onCancel,
  onOk,
  children,
  form,
  confirmLoading = false,
  okText = 'Simpan',
  cancelText = 'Batal',
  width = 600,
  destroyOnClose = true
}: FormModalProps) {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      confirmLoading={confirmLoading}
      okText={okText}
      cancelText={cancelText}
      width={width}
      destroyOnClose={destroyOnClose}
      styles={{
        body: { maxHeight: '70vh', overflowY: 'auto' }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        style={{ marginTop: 20 }}
      >
        {children}
      </Form>
    </Modal>
  )
}