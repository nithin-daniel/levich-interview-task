import axios, { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Enhanced axios instance with comprehensive interceptors
const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
})

// Request interceptor for adding auth token and logging
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        headers: config.headers,
      })
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling and logging
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      })
    }
    
    return response
  },
  (error: AxiosError) => {
    const response = error.response
    const request = error.request
    
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: response?.status,
        data: response?.data,
        message: error.message,
      })
    }
    
    // Handle different types of errors
    if (response) {
      // Server responded with error status
      const status = response.status
      const message = (response.data as any)?.message || error.message
      
      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          
          if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
            window.location.href = '/auth/login'
          }
          
          toast.error('Session expired. Please log in again.')
          break
          
        case 403:
          toast.error('Access denied. You do not have permission to perform this action.')
          break
          
        case 404:
          toast.error('Resource not found.')
          break
          
        case 422:
          // Validation error
          const validationMessage = (response.data as any)?.message || 'Validation error'
          toast.error(validationMessage)
          break
          
        case 429:
          toast.error('Too many requests. Please try again later.')
          break
          
        case 500:
          toast.error('Server error. Please try again later.')
          break
          
        default:
          toast.error(message || 'An unexpected error occurred.')
      }
    } else if (request) {
      // Network error
      toast.error('Network error. Please check your internet connection.')
    } else {
      // Something else happened
      toast.error('An unexpected error occurred.')
    }
    
    return Promise.reject(error)
  }
)

export { axiosInstance as api }
export default axiosInstance