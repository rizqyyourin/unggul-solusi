// Small helper module that centralizes API calls (axios instance)
// - Defines types for common response shapes
// - Creates a configured axios instance with baseURL, timeout, headers
// - Adds request/response interceptors for auth token and common error handling
import axios from 'axios'

// API Response Types
export interface ApiListResponse<T> {
  data: T
  message?: string
  status?: string
}

export interface ApiItemResponse<T> {
  data: T
  message?: string
  status?: string
}

// Create axios instance with base configuration
export const api = axios.create({
  // Base URL pointing to toko-api (Laravel) yang berjalan di localhost:8000
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor: menambahkan auth token jika ada sebelum request dikirim
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor: tangani error umum di satu tempat
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Unauthorized - hapus token dan (opsional) redirect ke login
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      // redirect logic bisa ditambahkan jika aplikasi punya halaman login
    }

    if (error.response?.status === 403) {
      // Forbidden - user tidak punya hak akses
      console.error('Access forbidden')
    }

    if (error.response?.status >= 500) {
      // Server error - log untuk debugging
      console.error('Server error:', error.response.data)
    }

    return Promise.reject(error)
  }
)

export default api
