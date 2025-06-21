"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface PortalDetails {
  clientEmail: string
  tempPassword: string
  portalUrl: string
  proposalId: string
  sentDate: string
  adminAccess: boolean
}

interface ProposalSentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  portalDetails: PortalDetails
}

// Export as both named and default export
export function ProposalSentModal({ open, onOpenChange, portalDetails }: ProposalSentModalProps) {
  const { toast } = useToast()
  const [copied, setCopied] = React.useState<string | null>(null)

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)

    setTimeout(() => {
      setCopied(null)
    }, 2000)

    toast({
      title: "Copied to clipboard",
      description: `${field} has been copied to your clipboard.`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Proposal Sent Successfully!</DialogTitle>
          <DialogDescription>
            The proposal has been sent to the client. They can now access it through the client portal.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Client Email:</div>
            <div className="flex items-center gap-2">
              <span className="text-sm">{portalDetails.clientEmail}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleCopy(portalDetails.clientEmail, "Email")}
              >
                {copied === "Email" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Temporary Password:</div>
            <div className="flex items-center gap-2">
              <span className="text-sm">{portalDetails.tempPassword}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleCopy(portalDetails.tempPassword, "Password")}
              >
                {copied === "Password" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Portal URL:</div>
            <div className="flex items-center gap-2">
              <span className="text-sm">{portalDetails.portalUrl}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleCopy(portalDetails.portalUrl, "URL")}
              >
                {copied === "URL" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Proposal ID:</div>
            <div className="flex items-center gap-2">
              <span className="text-sm">{portalDetails.proposalId}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleCopy(portalDetails.proposalId, "ID")}
              >
                {copied === "ID" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Sent Date:</div>
            <div className="text-sm">{new Date(portalDetails.sentDate).toLocaleString()}</div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={() => window.open(portalDetails.portalUrl, "_blank")}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Client Portal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Default export
export default ProposalSentModal
