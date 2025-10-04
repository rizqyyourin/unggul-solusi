import { Card, Statistic } from 'antd'
import { ReactNode } from 'react'
import type { Formatter } from 'antd/es/statistic/utils'

interface StatCardProps {
  title: string
  value: number | string
  icon: ReactNode
  color: string
  borderColor: string
  isMonetary?: boolean
  formatter?: Formatter
}

// Komponen kartu statistik kecil yang menampilkan satu metrik (jumlah atau rupiah)
// Props:
// - title: label kartu
// - value: angka atau string yang akan ditampilkan
// - icon: ReactNode ikon di sisi kanan
// - color / borderColor: styling untuk variasi visual
// - isMonetary: bila true, akan menggunakan ukuran font lebih kecil dan memberi
//   kesempatan untuk memformat angka melalui props formatter
export function StatCard({ 
  title, 
  value, 
  icon, 
  color, 
  borderColor, 
  isMonetary = false,
  formatter 
}: StatCardProps) {
  return (
    <Card
      style={{
        background: color,
        border: `2px solid ${borderColor}`,
        borderRadius: 16,
        height: '160px',
        transition: 'all 0.3s ease',
        cursor: 'default'
      }}
      className="dashboard-card"
      bodyStyle={{ padding: '24px' }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        height: '100%' 
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ 
            color: '#666', 
            fontSize: '14px', 
            marginBottom: 12, 
            fontWeight: 500 
          }}>
            {title}
          </div>
          <Statistic
            value={value}
            valueStyle={{ 
              fontSize: isMonetary ? '20px' : '28px',
              fontWeight: 'bold',
              color: '#262626',
              lineHeight: 1.2
            }}
            formatter={formatter}
          />
        </div>
        <div style={{ marginLeft: 20 }}>
          {icon}
        </div>
      </div>
    </Card>
  )
}