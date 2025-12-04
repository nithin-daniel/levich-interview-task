import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { api } from './axios'

// Helper functions for different HTTP methods with enhanced error handling
export const apiService = {
  get: <T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return api.get(endpoint, config)
  },
  
  post: <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return api.post(endpoint, data, config)
  },
  
  put: <T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return api.put(endpoint, data, config)
  },
  
  delete: <T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return api.delete(endpoint, config)
  },

  // Auth specific methods
  auth: {
    login: (credentials: { email: string; password: string }) => {
      return api.post('/auth/login', credentials)
    },
    
    register: (userData: { email: string; password: string }) => {
      return api.post('/auth/register', userData)
    },
    
    getCurrentUser: () => {
      return api.get('/auth/me')
    },
  },
  
  // Vendor specific methods
  vendors: {
    getAll: (params?: any) => {
      return api.get('/vendors', { params })
    },
    
    getById: (id: string) => {
      return api.get(`/vendors/${id}`)
    },
    
    create: (vendorData: any) => {
      return api.post('/vendors', vendorData)
    },
    
    update: (id: string, vendorData: any) => {
      return api.put(`/vendors/${id}`, vendorData)
    },
    
    delete: (id: string) => {
      return api.delete(`/vendors/${id}`)
    },
  },
  
  // Vendor movements methods
  vendorMovements: {
    getAll: (params?: any) => {
      return api.get('/vendor-movements', { params })
    },
    
    getById: (id: string) => {
      return api.get(`/vendor-movements/${id}`)
    },
  },
}