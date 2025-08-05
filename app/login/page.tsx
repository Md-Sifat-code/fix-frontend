"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Layout from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth"
import { LoadingAnimation } from "@/components/LoadingAnimation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const router = useRouter()
  const { user, loading, login, tempLogin } = useAuth()

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    try {
      await login(email, password)
      // We'll let the useEffect handle the redirection
    } catch (error) {
      console.error("Login failed:", error)
      setIsLoggingIn(false)
      // Handle login error (e.g., show error message to user)
    }
  }

  const handleTempLogin = async () => {
    setIsLoggingIn(true)
    try {
      await tempLogin()
      // We'll let the useEffect handle the redirection
    } catch (error) {
      console.error("Temporary login failed:", error)
      setIsLoggingIn(false)
      // Handle temp login error
    }
  }

  if (loading || isLoggingIn) {
    return <LoadingAnimation />
  }

  if (user) {
    return null // This will prevent a flash of the login page before redirecting
  }

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <p className="cursor-pointer">Forgat password</p>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
            <div className="mt-4">
              <Button type="button" variant="outline" className="w-full border-none" onClick={handleTempLogin}>
                Quick Access (Temporary)
              </Button>
            </div>
            <div className="mt-4 text-center">
              <p className="text-lg text-gray-600">
                new client?{" "}
                <Button variant="outline"  className="p-0 border-none" onClick={() => console.log("Sign up clicked")}>
                  Sign up
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
