"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Chrome, User, CheckCircle, AlertCircle } from "lucide-react"

export function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [demoUser, setDemoUser] = useState<any>(null)
  const [error, setError] = useState("")

  // Demo Google users for testing
  const demoUsers = [
    {
      id: "demo_001",
      name: "Maria Santos",
      email: "maria.santos@gmail.com",
      picture: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    {
      id: "demo_002",
      name: "Juan Dela Cruz",
      email: "juan.delacruz@gmail.com",
      picture: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    {
      id: "demo_003",
      name: "Ana Rodriguez",
      email: "ana.rodriguez@gmail.com",
      picture: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
  ]

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Simulate Google OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Select random demo user
      const randomUser = demoUsers[Math.floor(Math.random() * demoUsers.length)]
      setDemoUser(randomUser)

      // Simulate successful login after showing user info
      setTimeout(() => {
        window.location.href = "/resident/dashboard"
      }, 2000)
    } catch (err) {
      setError("Google sign-in failed. Please try again.")
      setIsLoading(false)
    }
  }

  if (demoUser) {
    return (
      <div className="space-y-4">
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="flex items-center space-x-3">
              <img src={demoUser.picture || "/placeholder.svg"} alt={demoUser.name} className="w-8 h-8 rounded-full" />
              <div>
                <p className="font-semibold">{demoUser.name}</p>
                <p className="text-sm">{demoUser.email}</p>
              </div>
              <Badge className="bg-green-100 text-green-800 border-0">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
        <div className="text-center text-sm text-gray-600">Redirecting to dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="button"
        variant="outline"
        className="w-full border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 bg-transparent"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <Chrome className="h-5 w-5 mr-3 text-blue-500" />
        {isLoading ? "Connecting to Google..." : "Continue with Google"}
      </Button>

      <div className="text-center">
        <Badge className="bg-gradient-to-r from-blue-100 to-yellow-100 text-blue-800 border-0 text-xs">
          <User className="h-3 w-3 mr-1" />
          Demo Mode - No Google account required
        </Badge>
      </div>
    </div>
  )
}
