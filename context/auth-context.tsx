"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, authApi, type AuthResponse } from "@/lib/auth-api"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: "provider" | "customer") => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem("auth_token")
    const userData = localStorage.getItem("user_data")

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user_data")
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response: AuthResponse = await authApi.login({ email, password })
      setUser(response.user)
      localStorage.setItem("user_data", JSON.stringify(response.user))
    } catch (error) {
      throw error
    }
  }

  const register = async (name: string, email: string, password: string, role: "provider" | "customer") => {
    try {
      const response: AuthResponse = await authApi.register({ name, email, password, role })
      setUser(response.user)
      localStorage.setItem("user_data", JSON.stringify(response.user))
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    authApi.logout()
    setUser(null)
    localStorage.removeItem("user_data")
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
