"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiService } from './api'

interface User {
  id: string
  email: string
  createdAt: string
  updatedAt: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored authentication on mount
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setToken(storedToken)
          setUser(parsedUser)
          
          // Verify token is still valid by fetching current user
          try {
            const response = await apiService.auth.getCurrentUser()
            if (response.data?.success) {
              setUser(response.data.data.user)
              localStorage.setItem('user', JSON.stringify(response.data.data.user))
            }
          } catch (error) {
            // Token is invalid, clear auth data
            logout()
          }
        } catch (error) {
          // Clear invalid stored data
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = (newToken: string, newUser: User) => {
    setToken(newToken)
    setUser(newUser)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    
    // Also set cookie for middleware
    document.cookie = `auth-token=${newToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Clear cookie
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    
    // Only redirect if we're not already on auth pages
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
      router.push('/auth/login')
    }
  }

  const refreshUser = async () => {
    if (!token) return
    
    try {
      const response = await apiService.auth.getCurrentUser()
      if (response.data?.success) {
        const updatedUser = response.data.data.user
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
      logout()
    }
  }

  const isAuthenticated = !!token && !!user

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}