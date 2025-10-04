import { Spin } from 'antd'

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large'
  message?: string
  style?: React.CSSProperties
}

// Simple loading spinner component used while fetching data
export function LoadingSpinner({ 
  size = 'large', 
  message = 'Memuat data...', 
  style 
}: LoadingSpinnerProps) {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '100px 0',
      ...style 
    }}>
      <Spin size={size} />
      {message && (
        <div style={{ 
          marginTop: 16, 
          color: '#666',
          fontSize: size === 'large' ? '16px' : '14px'
        }}>
          {message}
        </div>
      )}
    </div>
  )
}