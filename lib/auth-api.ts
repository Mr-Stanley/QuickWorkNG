import { apiClient } from "./api"

export interface User {
  _id: string
  name: string
  email: string
  role: "provider" | "customer"
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  role: "provider" | "customer"
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials)

    if (response.success && response.data) {
      apiClient.setToken(response.data.token)
      return response.data
    }

    throw new Error(response.message || "Login failed")
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", userData)

    if (response.success && response.data) {
      apiClient.setToken(response.data.token)
      return response.data
    }

    throw new Error(response.message || "Registration failed")
  },

  logout() {
    apiClient.clearToken()
  },
}
