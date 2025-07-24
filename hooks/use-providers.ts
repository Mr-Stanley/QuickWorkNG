"use client"

import { useState, useEffect } from "react"
import { type ProviderProfile, type ProviderSearchParams, providerApi } from "@/lib/provider-api"

export function useProviders(searchParams?: ProviderSearchParams) {
  const [providers, setProviders] = useState<ProviderProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
  })

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setIsLoading(true)
        setError(null)

        let data
        if (searchParams && (searchParams.category || searchParams.state || searchParams.lga)) {
          data = await providerApi.searchProviders(searchParams)
        } else {
          data = await providerApi.getAllProviders(searchParams)
        }

        setProviders(data.providers)
        setPagination(data.pagination)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch providers")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProviders()
  }, [searchParams])

  return { providers, isLoading, error, pagination }
}
