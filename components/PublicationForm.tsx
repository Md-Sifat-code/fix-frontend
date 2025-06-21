"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface PublicationFormProps {
  onSubmit: (data: any) => void
}

export function PublicationForm({ onSubmit }: PublicationFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Add form submission logic here
    onSubmit({
      // Add form data here
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" required />
      </div>
      <div>
        <Label htmlFor="author">Author</Label>
        <Input id="author" required />
      </div>
      <div>
        <Label htmlFor="abstract">Abstract</Label>
        <Textarea id="abstract" required />
      </div>
      <div>
        <Label htmlFor="publicationDate">Publication Date</Label>
        <Input id="publicationDate" type="date" required />
      </div>
      <Button type="submit">Submit Publication</Button>
    </form>
  )
}
