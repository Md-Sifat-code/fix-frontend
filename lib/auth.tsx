"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  profilePhoto: string
  role?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  tempLogin: () => Promise<void>
  logout: () => Promise<void>
  updateProfilePhoto: (photoUrl: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken")
      const userDataString = localStorage.getItem("userData")

      if (token) {
        if (userDataString) {
          // Use stored user data if available
          try {
            const userData = JSON.parse(userDataString)
            setUser(userData)
          } catch (e) {
            // Fallback to default user if JSON parsing fails
            setUser({
              id: "temp-user-id",
              name: "Temporary User",
              email: "temp@example.com",
              profilePhoto: "/placeholder.svg?height=32&width=32",
            })
          }
        } else {
          // Use default user if no stored data
          setUser({
            id: "temp-user-id",
            name: "Temporary User",
            email: "temp@example.com",
            profilePhoto: "/placeholder.svg?height=32&width=32",
          })
        }
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    // Implement actual login logic here
    // For now, we'll just set a dummy user
    setUser({
      id: "user-id",
      name: "John Doe",
      email,
      profilePhoto: "/placeholder.svg?height=32&width=32",
    })
    localStorage.setItem("authToken", "dummy-token")
  }

  const tempLogin = async () => {
    // Set temporary user
    setUser({
      id: "temp-user-id",
      name: "Temporary User",
      email: "temp@example.com",
      profilePhoto: "/placeholder.svg?height=32&width=32",
      role: "Owner", // Set as Owner for testing
    })
    localStorage.setItem("authToken", "temp-token")
  }

  const logout = async () => {
    setUser(null)
    localStorage.removeItem("authToken")
  }

  const updateProfilePhoto = async (photoUrl: string) => {
    if (user) {
      setUser({ ...user, profilePhoto: photoUrl })
      // In a real app, you'd also update this on the backend
      // For now, we'll just update localStorage to persist the change
      const userData = { ...user, profilePhoto: photoUrl }
      localStorage.setItem("userData", JSON.stringify(userData))
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, tempLogin, logout, updateProfilePhoto }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
