"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { MapPin, ArrowLeft, Star, Phone, MessageCircle, Mail, Shield, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useProvider } from "@/hooks/use-provider"

export default function ProviderProfilePage() {
  const params = useParams()
  const providerId = params.id as string
  const { provider, isLoading, error } = useProvider(providerId)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const formatWhatsAppUrl = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "")
    const internationalPhone = cleanPhone.startsWith("0") ? "234" + cleanPhone.substring(1) : cleanPhone
    return `https://wa.me/${internationalPhone}?text=Hi, I found your profile on QuickWork.ng and I'm interested in your services.`
  }

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <Skeleton className="h-8 w-1/4 mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-64 rounded-lg" />
                <Skeleton className="h-32 rounded-lg" />
                <Skeleton className="h-48 rounded-lg" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-96 rounded-lg" />
                <Skeleton className="h-32 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <Link href="/search" className="inline-flex items-center text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">Provider Not Found</h2>
              <p className="text-gray-600 mb-4">
                {error || "The service provider you are looking for does not exist or has been removed."}
              </p>
              <Button asChild>
                <Link href="/search">Back to Search</Link>
              </Button>
            </CardContent>
          </Card>
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
            <Link href="/search" className="inline-flex items-center text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Link>
            <Link href="/" className="text-2xl font-bold text-blue-600">
              quickwork.ng
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Provider Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={provider.portfolio[0]?.imageUrl || "/placeholder.svg?height=200&width=200"}
                      alt={provider.userId.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h1 className="text-3xl font-bold text-gray-900">{provider.userId.name}</h1>
                          {provider.isVerified && (
                            <Badge className="bg-green-100 text-green-800">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline" className="mb-3">
                          {provider.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-lg">{provider.rating.average}</span>
                        <span className="text-gray-500">({provider.rating.count} reviews)</span>
                      </div>
                      <Separator orientation="vertical" className="h-6" />
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>
                          {provider.location.city}, {provider.location.state}, {provider.location.lga}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Joined {formatJoinDate(provider.userId.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About {provider.userId.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{provider.bio}</p>
              </CardContent>
            </Card>

            {/* Portfolio */}
            {provider.portfolio && provider.portfolio.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio</CardTitle>
                  <CardDescription>Recent work and projects by {provider.userId.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {provider.portfolio.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <button
                              className="relative aspect-video w-full overflow-hidden rounded-md border bg-gray-100"
                              onClick={() => setSelectedImage(item.imageUrl)}
                            >
                              <img
                                src={item.imageUrl || "/placeholder.svg?height=200&width=300"}
                                alt={item.description || `Portfolio item ${index + 1}`}
                                className="h-full w-full object-cover transition-transform hover:scale-105"
                              />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <div className="aspect-auto">
                              <img
                                src={selectedImage || "/placeholder.svg?height=600&width=800"}
                                alt="Portfolio item"
                                className="h-full w-full rounded-md object-contain"
                              />
                            </div>
                            {item.description && <p className="mt-2 text-center text-gray-600">{item.description}</p>}
                          </DialogContent>
                        </Dialog>
                        {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Contact {provider.userId.name}</CardTitle>
                <CardDescription>Get in touch to discuss your project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => window.open(formatWhatsAppUrl(provider.contact.whatsapp), "_blank")}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => window.open(`tel:${provider.contact.phone}`, "_self")}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call {provider.contact.phone}
                </Button>

                {provider.contact.email && (
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => window.open(`mailto:${provider.contact.email}`, "_self")}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                )}

                <Separator />

                <div className="text-center text-sm text-gray-600">
                  <p>Response time: Usually within 2 hours</p>
                </div>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card>
              <CardHeader>
                <CardTitle>Service Area</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">State:</span>
                    <span className="font-medium">{provider.location.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">City:</span>
                    <span className="font-medium">{provider.location.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">LGA:</span>
                    <span className="font-medium">{provider.location.lga}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
