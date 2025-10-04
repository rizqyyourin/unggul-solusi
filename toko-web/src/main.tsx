// Entry point aplikasi React
// Tugas file ini: mount aplikasi ke DOM, wrap App dengan provider yang diperlukan
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import 'antd/dist/reset.css'
import './styles.css'
import { App as AntdApp, ConfigProvider } from 'antd'

// Render aplikasi ke elemen dengan id 'root' di index.html
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* ConfigProvider dan Antd App menyediakan context Ant Design untuk komponen UI */}
    <ConfigProvider>
      <AntdApp>
        {/* BrowserRouter mengaktifkan routing berbasis URL untuk App */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  </React.StrictMode>
)
