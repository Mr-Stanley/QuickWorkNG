"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCategories } from "@/hooks/use-categories"
import { useLocations } from "@/hooks/use-locations"
import { providerApi } from "@/lib/provider-api"
import { useToast } from "@/hooks/use-toast"

export default function ProfileSetupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const { categories, isLoading: categoriesLoading } = useCategories()
  const { states, lgas, isLoading: locationsLoading } = useLocations()

  const [formData, setFormData] = useState({
    category: "",
    bio: "",
    location: {
      state: "",
      city: "",
      lga: "",
    },
    contact: {
      phone: "",
      whatsapp: "",
      email: "",
    },
  })

  const [filteredLgas, setFilteredLgas] = useState<string[]>([])

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }))

      // Update filtered LGAs when state changes
      if (field === "location.state") {
        const newLgas = lgas[value] || []
        setFilteredLgas(newLgas)
        // Reset LGA when state changes
        setFormData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            lga: "",
          },
        }))
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.category && formData.bio.length >= 10
      case 2:
        return formData.location.state && formData.location.city && formData.location.lga
      case 3:
        return formData.contact.phone && formData.contact.whatsapp
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
      setError("")
    } else {
      setError("Please fill in all required fields")
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    setError("")
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      setError("Please fill in all required fields")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await providerApi.createProfile(formData)

      toast({
        title: "Profile created successfully",
        description: "Welcome to QuickWork! Your profile is now live.",
      })

      router.push("/provider/dashboard")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create profile. Please try again."
      setError(errorMessage)

      toast({
        variant: "destructive",
        title: "Profile creation failed",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your service</h2>
              <p className="text-gray-600">Help customers understand what you do and why they should choose you</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Service Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                  disabled={categoriesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your service category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading categories...
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
                <Label htmlFor="bio">Professional Bio *</Label>
                <Textarea
                  id="bio"
                  placeholder="Describe your experience, skills, and what makes you unique. This will be shown to potential customers."
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={5}
                  maxLength={1000}
                />
                <p className="text-sm text-gray-500">{formData.bio.length}/1000 characters (minimum 10 required)</p>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Where do you provide services?</h2>
              <p className="text-gray-600">This helps customers find you when searching in their area</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Select
                  value={formData.location.state}
                  onValueChange={(value) => handleInputChange("location.state", value)}
                  disabled={locationsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationsLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading states...
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
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="Enter your city"
                  value={formData.location.city}
                  onChange={(e) => handleInputChange("location.city", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lga">Local Government Area (LGA) *</Label>
                <Select
                  value={formData.location.lga}
                  onValueChange={(value) => handleInputChange("location.lga", value)}
                  disabled={!formData.location.state || filteredLgas.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your LGA" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredLgas.map((lga) => (
                      <SelectItem key={lga} value={lga}>
                        {lga}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">How can customers reach you?</h2>
              <p className="text-gray-600">Provide your contact information so customers can get in touch</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g., 08012345678"
                  value={formData.contact.phone}
                  onChange={(e) => handleInputChange("contact.phone", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="e.g., 08012345678"
                  value={formData.contact.whatsapp}
                  onChange={(e) => handleInputChange("contact.whatsapp", e.target.value)}
                />
                <p className="text-sm text-gray-500">Customers will be able to contact you directly via WhatsApp</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.contact.email}
                  onChange={(e) => handleInputChange("contact.email", e.target.value)}
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
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
            <div className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Profile Setup Progress</span>
              <span className="text-sm font-medium text-gray-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card>
            <CardContent className="p-8">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button onClick={handleNext}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? (
                      "Creating Profile..."
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Setup
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
