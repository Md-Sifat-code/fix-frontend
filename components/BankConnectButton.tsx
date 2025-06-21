"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { CreditCard } from "lucide-react"

interface BankConnectButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  children?: React.ReactNode
}

export function BankConnectButton({
  className,
  variant = "default",
  size = "default",
  children,
}: BankConnectButtonProps) {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const handleClick = () => {
    setIsNavigating(true)
    console.log("Navigating to bank connection page...")

    // Navigate to the bank connection page
    router.push("/connect-bank-account")
  }

  return (
    <Button className={className} variant={variant} size={size} onClick={handleClick} disabled={isNavigating}>
      {isNavigating ? (
        "Connecting..."
      ) : (
        <>
          {children || (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Connect Bank Account
            </>
          )}
        </>
      )}
    </Button>
  )
}
