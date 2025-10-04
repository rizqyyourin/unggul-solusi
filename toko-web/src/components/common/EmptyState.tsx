import { Empty, Button } from 'antd'
import { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title?: string
  description?: string
  actionText?: string
  onAction?: () => void
  style?: React.CSSProperties
}

// Reusable empty state UI with optional action button
export function EmptyState({
  icon,
  title = 'Belum ada data',
  description,
  actionText,
  onAction,
  style
}: EmptyStateProps) {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '40px 20px',
      ...style 
    }}>
      <Empty
        image={icon || Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div>
            <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: 8 }}>
              {title}
            </div>
            {description && (
              <div style={{ color: '#666', fontSize: '14px' }}>
                {description}
              </div>
            )}
          </div>
        }
      />
      {actionText && onAction && (
        <Button type="primary" onClick={onAction} style={{ marginTop: 16 }}>
          {actionText}
        </Button>
      )}
    </div>
  )
}