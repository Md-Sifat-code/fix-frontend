"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface GoogleDriveLinkUploaderProps {
  initialLink: string
  onSave: (link: string) => void
}

export function GoogleDriveLinkUploader({ initialLink, onSave }: GoogleDriveLinkUploaderProps) {
  const [link, setLink] = useState(initialLink)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value)
  }

  const handleSaveLink = () => {
    if (link) {
      onSave(link)
    } else {
      alert("Please enter a Google Drive link.")
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="text"
        value={link}
        onChange={handleInputChange}
        placeholder="Enter your Google Drive link here"
        className="flex-grow"
      />
      <Button onClick={handleSaveLink} className="shrink-0">
        Save Link
      </Button>
    </div>
  )
}
