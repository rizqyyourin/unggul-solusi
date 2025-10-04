import { Layout, Menu, theme, Button, Drawer } from 'antd'
import { Link, Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { UserOutlined, ShoppingCartOutlined, ShoppingOutlined, MenuOutlined, DashboardOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import DashboardPage from './pages/dashboard/DashboardPage'
import PelangganPage from './pages/pelanggan/PelangganPage'
import BarangPage from './pages/barang/BarangPage'
import PenjualanPage from './pages/penjualan/PenjualanPage'

const { Header, Content, Footer } = Layout

// Komponen utama aplikasi web, mengatur layout, navigasi, dan halaman
export default function App() {
  // Ambil lokasi URL saat ini untuk menentukan menu yang aktif
  const location = useLocation()
  // Ambil bagian pertama dari path untuk menu
  const selectedKey = location.pathname.split('/')[1] || 'dashboard'
  // State untuk buka/tutup menu mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // State untuk deteksi tampilan mobile
  const [isMobile, setIsMobile] = useState(false)
  
  const {
    token: { colorBgContainer }
  } = theme.useToken()

  // Deteksi apakah tampilan mobile, update saat window di-resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 992) // breakpoint mobile
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Daftar menu navigasi utama aplikasi
  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: <Link to="/dashboard">Dashboard</Link> },
    { key: 'pelanggan', icon: <UserOutlined />, label: <Link to="/pelanggan">Pelanggan</Link> },
    { key: 'barang', icon: <ShoppingOutlined />, label: <Link to="/barang">Barang</Link> },
    { key: 'penjualan', icon: <ShoppingCartOutlined />, label: <Link to="/penjualan">Penjualan</Link> }
  ]

  // Render layout utama aplikasi: header, menu, halaman, dan footer
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header: berisi judul dan menu navigasi */}
      <Header style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 10, 
        width: '100%',
        padding: '0 16px',
        background: '#001529',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <div style={{ 
          maxWidth: 1200, 
          margin: '0 auto',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          height: '100%'
        }}>
          {/* Judul aplikasi, klik untuk ke dashboard */}
          <div style={{ 
            color: '#fff', 
            fontWeight: 700, 
            fontSize: '20px',
            letterSpacing: '0.5px',
            cursor: 'pointer'
          }}>
            <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>
              🏪 Toko Web
            </Link>
          </div>
          
          {/* Menu navigasi desktop, atau tombol menu mobile */}
          {!isMobile ? (
            <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={[selectedKey]}
              style={{ 
                background: 'transparent',
                border: 'none',
                flex: 1,
                justifyContent: 'flex-end',
                maxWidth: '500px',
                minWidth: '400px'
              }}
              items={menuItems}
              disabledOverflow={true}
            />
          ) : (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuOpen(true)}
              style={{ color: '#fff', fontSize: '18px' }}
            />
          )}
        </div>
      </Header>
      
  {/* Menu navigasi mobile (drawer) */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
      >
        <Menu
          mode="vertical"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={() => setMobileMenuOpen(false)}
          style={{ border: 'none' }}
        />
      </Drawer>

  {/* Konten utama aplikasi, berisi halaman yang sedang dibuka */}
  <Content style={{ background: '#f0f2f5' }}>
        <div style={{ 
          maxWidth: 1200, 
          margin: '0 auto', 
          padding: '24px 16px',
          minHeight: 'calc(100vh - 134px)'
        }}>
          <div style={{ 
            background: colorBgContainer, 
            padding: 24, 
            borderRadius: 8,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            {/* Routing: menentukan halaman yang ditampilkan sesuai URL */}
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/pelanggan" element={<PelangganPage />} />
              <Route path="/barang" element={<BarangPage />} />
              <Route path="/penjualan" element={<PenjualanPage />} />
            </Routes>
          </div>
        </div>
      </Content>
      {/* Footer aplikasi */}
      <Footer style={{ 
        textAlign: 'center',
        background: '#f0f2f5',
        color: '#666',
        fontSize: '14px'
      }}>
        Toko Web ©2025 - Sistem Manajemen Toko
      </Footer>
    </Layout>
  )
}
