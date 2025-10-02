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
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('auth_token')
      // You can add redirect logic here if needed
    }
    
    if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden')
    }
    
    if (error.response?.status >= 500) {
      // Server error
      console.error('Server error:', error.response.data)
    }
    
    return Promise.reject(error)
  }
)

export default api
