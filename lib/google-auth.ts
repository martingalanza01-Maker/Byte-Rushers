interface GoogleUser {
  id: string
  email: string
  name: string
  picture: string
  given_name: string
  family_name: string
}

interface GoogleAuthResponse {
  success: boolean
  user?: GoogleUser
  error?: string
}

// Mock Google users for demo purposes
const mockGoogleUsers: GoogleUser[] = [
  {
    id: "google_001",
    email: "maria.santos@gmail.com",
    name: "Maria Santos",
    picture: "/placeholder.svg?height=40&width=40",
    given_name: "Maria",
    family_name: "Santos"
  },
  {
    id: "google_002", 
    email: "juan.delacruz@gmail.com",
    name: "Juan Dela Cruz",
    picture: "/placeholder.svg?height=40&width=40",
    given_name: "Juan",
    family_name: "Dela Cruz"
  },
  {
    id: "google_003",
    email: "ana.rodriguez@gmail.com", 
    name: "Ana Rodriguez",
    picture: "/placeholder.svg?height=40&width=40",
    given_name: "Ana",
    family_name: "Rodriguez"
  }
]

export async function signInWithGoogle(): Promise<GoogleAuthResponse> {
  try {
    // Check if we have a real Google Client ID
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    
    if (!clientId || clientId === 'your-google-client-id-here') {
      // Demo mode - simulate Google sign-in
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate loading
      
      const randomUser = mockGoogleUsers[Math.floor(Math.random() * mockGoogleUsers.length)]
      
      return {
        success: true,
        user: randomUser
      }
    }

    // Real Google OAuth implementation would go here
    // For now, return demo mode
    const randomUser = mockGoogleUsers[Math.floor(Math.random() * mockGoogleUsers.length)]
    
    return {
      success: true,
      user: randomUser
    }
    
  } catch (error) {
    console.error('Google sign-in error:', error)
    return {
      success: false,
      error: 'Failed to sign in with Google'
    }
  }
}

export function isGoogleConfigured(): boolean {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  return !!(clientId && clientId !== 'your-google-client-id-here')
}
