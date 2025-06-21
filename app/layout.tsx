import { Toaster } from "@/components/Toaster"
import type React from "react"
import { AuthProvider } from "@/lib/auth"
import { BackButton } from "@/components/BackButton"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <BackButton />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}


import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
