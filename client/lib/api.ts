import axios from 'axios'

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T
}

// Error Response
export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
}

// Auth Types
export interface User {
  id: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

// Vendor Types
export interface Vendor {
  id: number
  name: string
  domain: string
  logo?: string
  logoColor?: string
  rating: number
  trend: number
  trendUp: boolean
  lastAssessed: string
  status: string
  categories: string[]
  extraCategories: number
  monitored: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateVendorData {
  name: string
  domain: string
  logo?: string
  logoColor?: string
  rating: number
  trend?: number
  trendUp?: boolean
  status?: string
  categories: string[]
  extraCategories?: number
  monitored?: boolean
}

export interface UpdateVendorData extends Partial<CreateVendorData> {}

export interface VendorFilters {
  page?: number
  limit?: number
  search?: string
  status?: string
  monitored?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: Pagination
}

// =============================================================================
// AXIOS CONFIGURATION
// =============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 unauthorized errors
    if (error.response?.status === 401) {
      // Clear auth data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        
        // Only redirect if we're not already on auth pages
        if (!window.location.pathname.startsWith('/auth')) {
          window.location.href = '/auth/login'
        }
      }
    }
    
    return Promise.reject(error)
  }
)

// =============================================================================
// API SERVICE
// =============================================================================

export const apiService = {
  // =============================================================================
  // AUTHENTICATION API
  // =============================================================================
  auth: {
    async login(credentials: LoginCredentials) {
      const response = await api.post('/auth/login', credentials)
      return response.data
    },

    async register(userData: RegisterData) {
      const response = await api.post('/auth/register', userData)
      return response.data
    },

    async getCurrentUser() {
      const response = await api.get('/auth/me')
      return response.data
    },

    async logout() {
      const response = await api.post('/auth/logout')
      return response.data
    },
  },

  // =============================================================================
  // VENDORS API
  // =============================================================================
  vendors: {
    async getAll(filters?: VendorFilters) {
      const response = await api.get('/vendors', { params: filters })
      return response.data
    },

    async getById(id: string | number) {
      const response = await api.get(`/vendors/${id}`)
      return response.data
    },

    async create(vendorData: CreateVendorData) {
      const response = await api.post('/vendors', vendorData)
      return response.data
    },
  },

  // =============================================================================
  // SEARCH API
  // =============================================================================
  search: {
    async searchByTitle(title: string) {
      const response = await api.get('/search', { params: { title } })
      return response.data
    },
  },

  // =============================================================================
  // HEALTH CHECK API
  // =============================================================================
  health: {
    async check() {
      const response = await axios.get(`${API_BASE_URL}/health`)
      return response.data
    },
  },
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Extract data from API response
 */
export const extractData = <T>(response: ApiResponse<T>): T => {
  return response.data
}

/**
 * Check if API response was successful
 */
export const isSuccessResponse = <T>(response: ApiResponse<T>): boolean => {
  return response.success === true
}

/**
 * Get error message from API error
 */
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.message) {
    return error.message
  }
  return 'An unexpected error occurred'
}

export default apiService