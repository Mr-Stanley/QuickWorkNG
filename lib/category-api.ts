import { apiClient } from "./api"

export interface Category {
  _id: string
  name: string
  description?: string
  icon?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const categoryApi = {
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>("/categories")

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Failed to fetch categories")
  },
}
