"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Star, Phone, MessageCircle, Filter } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useProviders } from "@/hooks/use-providers"
import { useCategories } from "@/hooks/use-categories"
import { useLocations } from "@/hooks/use-locations"
import { Skeleton } from "@/components/ui/skeleton"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [searchFilters, setSearchFilters] = useState({
    category: searchParams.get("category") || "all",
    state: searchParams.get("state") || "all",
    lga: searchParams.get("lga") || "all",
    keyword: searchParams.get("keyword") || "",
  })

  const { categories, isLoading: categoriesLoading } = useCategories()
  const { states, lgas, isLoading: locationsLoading } = useLocations()
  const {
    providers,
    isLoading: providersLoading,
    error,
    pagination,
  } = useProviders({
    category: searchFilters.category === "all" ? undefined : searchFilters.category,
    state: searchFilters.state === "all" ? undefined : searchFilters.state,
    lga: searchFilters.lga === "all" ? undefined : searchFilters.lga,
  })

  const [filteredLgas, setFilteredLgas] = useState<string[]>([])

  useEffect(() => {
    if (searchFilters.state && lgas[searchFilters.state]) {
      setFilteredLgas(lgas[searchFilters.state])
    } else {
      setFilteredLgas([])
    }
  }, [searchFilters.state, lgas])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchFilters.category !== "all") params.set("category", searchFilters.category)
    if (searchFilters.state !== "all") params.set("state", searchFilters.state)
    if (searchFilters.lga !== "all") params.set("lga", searchFilters.lga)
    if (searchFilters.keyword) params.set("keyword", searchFilters.keyword)

    router.push(`/search?${params.toString()}`)
  }

  const handleFilterChange = (key: string, value: string) => {
    setSearchFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const formatWhatsAppUrl = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "")
    const internationalPhone = cleanPhone.startsWith("0") ? "234" + cleanPhone.substring(1) : cleanPhone
    return `https://wa.me/${internationalPhone}?text=Hi, I found your profile on QuickWork.ng and I'm interested in your services.`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              quickwork.ng
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Join</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Search Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keyword">Search</Label>
                  <Input
                    id="keyword"
                    placeholder="Search by name or service..."
                    value={searchFilters.keyword}
                    onChange={(e) => handleFilterChange("keyword", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Service Category</Label>
                  <Select
                    value={searchFilters.category}
                    onValueChange={(value) => handleFilterChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categoriesLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : (
                        categories.map((category) => (
                          <SelectItem key={category._id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select
                    value={searchFilters.state}
                    onValueChange={(value) => {
                      handleFilterChange("state", value)
                      handleFilterChange("lga", "all") // Reset LGA when state changes
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {locationsLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : (
                        states.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lga">LGA</Label>
                  <Select
                    value={searchFilters.lga}
                    onValueChange={(value) => handleFilterChange("lga", value)}
                    disabled={!searchFilters.state || filteredLgas.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select LGA" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All LGAs</SelectItem>
                      {filteredLgas.map((lga) => (
                        <SelectItem key={lga} value={lga}>
                          {lga}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSearch} className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Service Providers</h1>
              <p className="text-gray-600">
                {providersLoading
                  ? "Searching..."
                  : `Found ${pagination.total} provider${pagination.total !== 1 ? "s" : ""} matching your search`}
              </p>
            </div>

            {providersLoading ? (
              <div className="grid gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex space-x-4">
                        <Skeleton className="w-24 h-24 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-3 w-1/2" />
                          <Skeleton className="h-3 w-3/4" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-red-600 mb-4">
                    <p className="font-medium">Error loading providers</p>
                    <p className="text-sm">{error}</p>
                  </div>
                  <Button onClick={() => window.location.reload()}>Try Again</Button>
                </CardContent>
              </Card>
            ) : providers.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No providers found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search filters or search terms</p>
                  <Button
                    onClick={() => {
                      setSearchFilters({ category: "all", state: "all", lga: "all", keyword: "" })
                      router.push("/search")
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {providers.map((provider) => (
                  <Card key={provider._id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-32 md:h-32 w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={provider.portfolio[0]?.imageUrl || "/placeholder.svg?height=200&width=300"}
                            alt={`${provider.userId.name}'s work`}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-semibold text-gray-900">{provider.userId.name}</h3>
                                {provider.isVerified && (
                                  <Badge variant="secondary" className="text-xs">
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <Badge variant="outline" className="mb-2">
                                {provider.category}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{provider.rating.average}</span>
                              <span className="text-gray-500 text-sm">({provider.rating.count} reviews)</span>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-3 line-clamp-2">{provider.bio}</p>

                          <div className="flex items-center text-gray-500 mb-4">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">
                              {provider.location.city}, {provider.location.state}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <Link href={`/providers/${provider._id}`}>
                              <Button variant="outline" size="sm">
                                View Profile
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`tel:${provider.contact.phone}`, "_self")}
                            >
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </Button>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => window.open(formatWhatsAppUrl(provider.contact.whatsapp), "_blank")}
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                              WhatsApp
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.current === 1}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString())
                      params.set("page", (pagination.current - 1).toString())
                      router.push(`/search?${params.toString()}`)
                    }}
                  >
                    Previous
                  </Button>

                  <span className="text-sm text-gray-600">
                    Page {pagination.current} of {pagination.pages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.current === pagination.pages}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString())
                      params.set("page", (pagination.current + 1).toString())
                      router.push(`/search?${params.toString()}`)
                    }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
