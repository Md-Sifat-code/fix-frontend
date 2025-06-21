"use client"

import { useEffect, useState } from "react"
import Logo from "./Logo"
import { Progress } from "@/components/ui/progress"

export function LoadingAnimation() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer)
          return 100
        }
        return prevProgress + 25
      })
    }, 100)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <div className="mb-8">
        <Logo className="w-16 h-16" />
      </div>
      <div className="w-64">
        <Progress value={progress} className="w-full h-1" />
      </div>
    </div>
  )
}
