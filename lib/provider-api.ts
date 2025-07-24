import { apiClient } from "./api"

export interface ProviderProfile {
  _id: string
  userId: {
    _id: string
    name: string
    email: string
    createdAt: string
  }
  category: string
  bio: string
  location: {
    state: string
    city: string
    lga: string
  }
  contact: {
    phone: string
    whatsapp: string
    email?: string
  }
  portfolio: Array<{
    imageUrl: string
    description?: string
    uploadedAt: string
  }>
  rating: {
    average: number
    count: number
  }
  isVerified: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  whatsappUrl?: string
}

export interface ProviderSearchParams {
  category?: string
  state?: string
  lga?: string
  page?: number
  limit?: number
}

export interface ProviderSearchResponse {
  providers: ProviderProfile[]
  pagination: {
    current: number
    pages: number
    total: number
  }
  searchParams?: ProviderSearchParams
}

export interface CreateProviderProfileData {
  category: string
  bio: string
  location: {
    state: string
    city: string
    lga: string
  }
  contact: {
    phone: string
    whatsapp: string
    email?: string
  }
}

export interface UpdateProviderProfileData extends CreateProviderProfileData {}

export interface AddPortfolioItemData {
  imageUrl: string
  description?: string
}

export const providerApi = {
  async getAllProviders(params?: ProviderSearchParams): Promise<ProviderSearchResponse> {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.set("page", params.page.toString())
    if (params?.limit) queryParams.set("limit", params.limit.toString())

    const endpoint = `/providers${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    const response = await apiClient.get<ProviderSearchResponse>(endpoint)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Failed to fetch providers")
  },

  async searchProviders(params: ProviderSearchParams): Promise<ProviderSearchResponse> {
    const queryParams = new URLSearchParams()

    if (params.category) queryParams.set("category", params.category)
    if (params.state) queryParams.set("state", params.state)
    if (params.lga) queryParams.set("lga", params.lga)
    if (params.page) queryParams.set("page", params.page.toString())
    if (params.limit) queryParams.set("limit", params.limit.toString())

    const response = await apiClient.get<ProviderSearchResponse>(`/providers/search?${queryParams.toString()}`)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Failed to search providers")
  },

  async getProviderById(id: string): Promise<ProviderProfile> {
    const response = await apiClient.get<ProviderProfile>(`/providers/${id}`)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Failed to fetch provider")
  },

  async createProfile(data: CreateProviderProfileData): Promise<ProviderProfile> {
    const response = await apiClient.post<ProviderProfile>("/providers/profile", data)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Failed to create profile")
  },

  async updateProfile(id: string, data: UpdateProviderProfileData): Promise<ProviderProfile> {
    const response = await apiClient.put<ProviderProfile>(`/providers/${id}/profile`, data)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Failed to update profile")
  },

  async addPortfolioItem(id: string, data: AddPortfolioItemData): Promise<any> {
    const response = await apiClient.post(`/providers/${id}/portfolio`, data)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Failed to add portfolio item")
  },
}
