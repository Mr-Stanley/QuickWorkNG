"use client"

import { useState, useEffect } from "react"

// Mock location data - in a real app, this would come from an API
const mockLocationData = {
  states: ["Lagos", "Abuja", "Kano", "Rivers", "Oyo", "Delta", "Kaduna", "Ogun"],
  lgas: {
    Lagos: ["Ikeja", "Lagos Island", "Victoria Island", "Surulere", "Alimosho", "Oshodi-Isolo"],
    Abuja: ["Wuse", "Garki", "Asokoro", "Maitama", "Gwarinpa", "Kubwa"],
    Kano: ["Kano Municipal", "Fagge", "Dala", "Gwale", "Tarauni", "Nasarawa"],
    Rivers: ["Port Harcourt", "Obio-Akpor", "Eleme", "Ikwerre", "Oyigbo"],
    Oyo: ["Ibadan North", "Ibadan South-West", "Egbeda", "Akinyele", "Lagelu"],
    Delta: ["Warri South", "Uvwie", "Sapele", "Okpe", "Ughelli North"],
    Kaduna: ["Kaduna North", "Kaduna South", "Chikun", "Igabi", "Zaria"],
    Ogun: ["Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Sagamu", "Ijebu Ode"],
  },
}

export function useLocations() {
  const [states, setStates] = useState<string[]>([])
  const [lgas, setLgas] = useState<Record<string, string[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        setStates(mockLocationData.states)
        setLgas(mockLocationData.lgas)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch locations")
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocations()
  }, [])

  return { states, lgas, isLoading, error }
}
