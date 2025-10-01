"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { User, MapPin, Phone, Calendar, Mail } from "lucide-react"

interface ProfileCardProps {
  className?: string
}

export function ProfileCard({ className }: ProfileCardProps) {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      const userData = JSON.parse(currentUser)
      setUser(userData)
    }
    setIsLoading(false)
  }, [])

  const handleEditProfile = () => {
    if (user?.role === "staff") {
      router.push("/staff/profile")
    } else {
      router.push("/resident/profile")
    }
  }

  const formatMemberSince = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  const formatAddress = (address: string) => {
    // Extract the first part of the address for display
    const parts = address.split(",")
    return parts[0] || address
  }

  if (isLoading) {
    return (
      <Card className={`w-full max-w-sm mx-auto ${className}`}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
            </div>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gray-300 rounded-2xl"></div>
            </div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-300 rounded w-32 mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded w-40 mx-auto"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
            </div>
            <div className="h-10 bg-gray-300 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className={`w-full max-w-sm mx-auto ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="text-gray-500">
            <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No profile information available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={`w-full max-w-sm mx-auto shadow-lg border-0 bg-gradient-to-br from-orange-50 to-yellow-50 ${className}`}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-orange-800">Profile Information</h3>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
            <AvatarImage src={user.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-yellow-500 text-white text-xl font-bold">
              {user.name
                ?.split(" ")
                .map((n: string) => n[0])
                .join("") || "U"}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* User Info */}
        <div className="text-center mb-6">
          <h4 className="text-xl font-bold text-gray-900 mb-1">{user.name || "Unknown User"}</h4>
          <p className="text-gray-600 text-sm flex items-center justify-center">
            <Mail className="h-3 w-3 mr-1" />
            {user.email || "No email provided"}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-6">
          {/* Address */}
          <div className="flex items-start space-x-3 text-sm text-gray-700">
            <MapPin className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <span className="flex-1">
              {user.address
                ? formatAddress(user.address)
                : user.hall
                  ? `${user.hall}, Manggahan, Pasig City`
                  : "Address not provided"}
            </span>
          </div>

          {/* Phone */}
          <div className="flex items-center space-x-3 text-sm text-gray-700">
            <Phone className="h-4 w-4 text-orange-500 flex-shrink-0" />
            <span>{user.phone || "Phone not provided"}</span>
          </div>

          {/* Member Since */}
          <div className="flex items-center space-x-3 text-sm text-gray-700">
            <Calendar className="h-4 w-4 text-orange-500 flex-shrink-0" />
            <span>
              {user.role === "staff"
                ? `Staff since ${user.hireDate ? formatMemberSince(user.hireDate) : "Unknown"}`
                : `Member since ${user.registrationDate ? formatMemberSince(user.registrationDate) : "January 2023"}`}
            </span>
          </div>
        </div>

        {/* Edit Profile Button */}
        <Button
          onClick={handleEditProfile}
          className="w-full bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white font-medium py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          <User className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  )
}
