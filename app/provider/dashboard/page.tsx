"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Eye, MessageCircle, Plus, Edit, Camera, BarChart3, Settings } from "lucide-react"
import Link from "next/link"

// Mock data - replace with API calls
const mockProviderData = {
  profile: {
    id: "1",
    name: "John Adebayo",
    category: "Carpenter",
    bio: "Experienced carpenter with 10+ years in furniture making and home repairs",
    location: { state: "Lagos", city: "Ikeja", lga: "Ikeja" },
    contact: { phone: "08012345678", whatsapp: "08012345678", email: "john@email.com" },
    rating: { average: 4.8, count: 24 },
    isVerified: true,
    profileViews: 156,
    completedJobs: 47,
  },
  portfolio: [
    {
      id: "1",
      imageUrl: "/placeholder.svg?height=200&width=300",
      description: "Custom dining table",
      uploadedAt: "2024-01-15",
    },
    {
      id: "2",
      imageUrl: "/placeholder.svg?height=200&width=300",
      description: "Kitchen cabinet installation",
      uploadedAt: "2024-01-10",
    },
  ],
  stats: {
    totalViews: 156,
    totalContacts: 23,
    responseRate: 95,
    avgRating: 4.8,
  },
}

export default function ProviderDashboard() {
  const [providerData, setProviderData] = useState(mockProviderData)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        // TODO: Replace with actual API calls
        console.log("Fetching provider dashboard data...")

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setProviderData(mockProviderData)
      } catch (error) {
        console.error("Error fetching provider data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProviderData()
  }, [])

  const handleAddPortfolioItem = () => {
    // TODO: Implement portfolio upload
    console.log("Add portfolio item")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
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
              <Link href={`/providers/${providerData.profile.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Public Profile
                </Button>
              </Link>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {providerData.profile.name}!</h1>
          <p className="text-gray-600">Manage your profile, portfolio, and track your performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profile Views</p>
                  <p className="text-2xl font-bold text-gray-900">{providerData.stats.totalViews}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contacts</p>
                  <p className="text-2xl font-bold text-gray-900">{providerData.stats.totalContacts}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Response Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{providerData.stats.responseRate}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{providerData.stats.avgRating}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Manage your professional profile details</CardDescription>
                  </div>
                  <Link href="/provider/profile/edit">
                    <Button>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Basic Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Name</label>
                        <p className="text-gray-900">{providerData.profile.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Category</label>
                        <div className="mt-1">
                          <Badge variant="outline">{providerData.profile.category}</Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Bio</label>
                        <p className="text-gray-900">{providerData.profile.bio}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Contact & Location</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Phone</label>
                        <p className="text-gray-900">{providerData.profile.contact.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">WhatsApp</label>
                        <p className="text-gray-900">{providerData.profile.contact.whatsapp}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Location</label>
                        <p className="text-gray-900">
                          {providerData.profile.location.city}, {providerData.profile.location.state}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Portfolio</CardTitle>
                    <CardDescription>Showcase your best work to attract more customers</CardDescription>
                  </div>
                  <Button onClick={handleAddPortfolioItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Work
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {providerData.portfolio.map((item) => (
                    <div key={item.id} className="group relative">
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.description}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="mt-2">
                        <p className="font-medium text-gray-900">{item.description}</p>
                        <p className="text-sm text-gray-600">Added {new Date(item.uploadedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="secondary">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Add New Item Card */}
                  <div
                    className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    onClick={handleAddPortfolioItem}
                  >
                    <div className="text-center">
                      <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Add new work</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Performance</CardTitle>
                  <CardDescription>Track how your profile is performing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Profile Views</span>
                      <span className="text-2xl font-bold">{providerData.stats.totalViews}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Contact Requests</span>
                      <span className="text-2xl font-bold">{providerData.stats.totalContacts}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Response Rate</span>
                      <span className="text-2xl font-bold">{providerData.stats.responseRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest profile activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Profile viewed by customer</p>
                        <p className="text-xs text-gray-600">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New portfolio item added</p>
                        <p className="text-xs text-gray-600">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">WhatsApp contact received</p>
                        <p className="text-xs text-gray-600">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
