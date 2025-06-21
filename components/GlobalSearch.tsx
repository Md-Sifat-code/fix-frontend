"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search } from "lucide-react"

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = () => {
    // Implement the search logic here
    console.log("Searching for:", searchQuery)
    setIsOpen(false)
  }

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)} className="w-full mb-4">
        <Search className="w-4 h-4 mr-2" />
        Search...
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Global Search</DialogTitle>
          </DialogHeader>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Search projects, tasks, or notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
