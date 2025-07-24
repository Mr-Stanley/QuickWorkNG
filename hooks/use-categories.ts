"use client"

import { useState, useEffect } from "react"
import { type Category, categoryApi } from "@/lib/category-api"

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await categoryApi.getCategories()
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch categories")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, isLoading, error }
}
