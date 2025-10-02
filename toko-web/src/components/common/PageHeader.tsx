import { Typography, Space } from 'antd'
import { ReactNode } from 'react'

const { Title } = Typography

interface PageHeaderProps {
  icon: ReactNode
  title: string
  description: string
}

export default function PageHeader({ icon, title, description }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon}
        {title}
      </Title>
      <p style={{ color: '#666', margin: '8px 0 0 32px' }}>
        {description}
      </p>
    </div>
  )
}