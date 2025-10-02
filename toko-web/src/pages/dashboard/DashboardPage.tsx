import { useEffect, useState } from 'react'
import { Col, Row, Typography, Card, Space } from 'antd'
import { UserOutlined, AppstoreOutlined, ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons'
import { useList } from '../../lib/hooks'
import { StatCard } from '../../components/dashboard'
import { LoadingSpinner } from '../../components/common'
import { formatCurrency } from '../../utils'
import type { Pelanggan, Barang, Penjualan } from '../../types'

const { Title } = Typography

export default function DashboardPage() {
  const pelanggan = useList<Pelanggan>('/pelanggan')
  const barang = useList<Barang>('/barang')
  const penjualan = useList<Penjualan>('/penjualan')
  
  const [stats, setStats] = useState({
    totalPelanggan: 0,
    totalBarang: 0,
    totalPenjualan: 0,
    totalRevenue: 0
  })

  useEffect(() => {
    // Calculate statistics from loaded data
    const totalRevenue = penjualan.data.reduce((sum, p) => sum + (p.subtotal || 0), 0)
    
    setStats({
      totalPelanggan: pelanggan.data.length,
      totalBarang: barang.data.length,
      totalPenjualan: penjualan.data.length,
      totalRevenue
    })
  }, [pelanggan.data, barang.data, penjualan.data])

  const isLoading = pelanggan.loading || barang.loading || penjualan.loading

  const cardData = [
    {
      title: 'Total Pelanggan',
      value: stats.totalPelanggan,
      icon: <UserOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
      color: '#e6f7ff',
      borderColor: '#91d5ff'
    },
    {
      title: 'Total Barang',
      value: stats.totalBarang,
      icon: <AppstoreOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
      color: '#f6ffed',
      borderColor: '#b7eb8f'
    },
    {
      title: 'Total Transaksi',
      value: stats.totalPenjualan,
      icon: <ShoppingCartOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
      color: '#f9f0ff',
      borderColor: '#d3adf7'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: <DollarOutlined style={{ fontSize: 32, color: '#fa8c16' }} />,
      color: '#fff7e6',
      borderColor: '#ffd591',
      isMonetary: true
    }
  ]

  if (isLoading) {
    return (
      <LoadingSpinner 
        size="large"
        message="Memuat data dashboard..."
      />
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <Title level={2} style={{ margin: 0, color: '#262626', fontSize: '28px' }}>
          📊 Dashboard Toko
        </Title>
        <p style={{ color: '#8c8c8c', fontSize: '16px', margin: '12px 0 0 0' }}>
          Ringkasan data bisnis Anda hari ini
        </p>
      </div>

      <Row gutter={[24, 24]} style={{ marginBottom: 40 }}>
        {cardData.map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <StatCard
              title={item.title}
              value={item.isMonetary ? stats.totalRevenue : item.value}
              icon={item.icon}
              color={item.color}
              borderColor={item.borderColor}
              isMonetary={item.isMonetary}
              formatter={item.isMonetary ? 
                (value: any) => formatCurrency(Number(value)) : 
                undefined
              }
            />
          </Col>
        ))}
      </Row>

      {/* Welcome Message */}
      <div style={{ 
        textAlign: 'center', 
        padding: '60px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 16,
        color: 'white'
      }}>
        <Title level={3} style={{ color: 'white', margin: '0 0 16px 0' }}>
          🎉 Selamat Datang di Sistem Manajemen Toko
        </Title>
        <p style={{ 
          fontSize: '16px', 
          color: 'rgba(255,255,255,0.9)', 
          margin: 0,
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: 1.6
        }}>
          Kelola data pelanggan, barang, dan transaksi penjualan dengan mudah. 
          Gunakan menu navigasi di atas untuk mengakses fitur-fitur yang tersedia.
        </p>
      </div>
    </div>
  )
}