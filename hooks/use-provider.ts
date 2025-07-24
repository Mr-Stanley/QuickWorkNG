"use client"

import { useState, useEffect } from "react"
import { type ProviderProfile, providerApi } from "@/lib/provider-api"

export function useProvider(id: string) {
  const [provider, setProvider] = useState<ProviderProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProvider = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        setError(null)
        const data = await providerApi.getProviderById(id)
        setProvider(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch provider")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProvider()
  }, [id])

  return { provider, isLoading, error }
}
