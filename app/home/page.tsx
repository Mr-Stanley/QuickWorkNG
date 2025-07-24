"use client"

import { useEffect, useState } from "react"

export default function HomePage() {
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/providers")
      .then(res => res.json())
      .then(data => {
        setProviders(data.data.providers)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Listed Businesses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {providers.map((provider: any) => (
          <div key={provider._id} className="border p-4 rounded shadow">
            <h2 className="font-semibold">{provider.userId?.name}</h2>
            <p>{provider.category}</p>
            <p>{provider.bio}</p>
          </div>
        ))}
      </div>
    </div>
  )
}