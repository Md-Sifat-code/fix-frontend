"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink } from "lucide-react"

interface PortalPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  portalDetails: {
    clientEmail: string
    tempPassword: string
    portalUrl: string
    proposalId: string
    sentDate: string
    adminAccess: boolean
  } | null
}

// Export as both default and named export to support both import styles
export function PortalPreviewModal({ open, onOpenChange, portalDetails }: PortalPreviewModalProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const openPortalPreview = () => {
    if (!portalDetails) return

    const url = `${portalDetails.portalUrl}?preview=true&admin=true`
    window.open(url, "_blank")
  }

  if (!portalDetails) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Client Portal Access</DialogTitle>
          <DialogDescription>
            The proposal has been sent to the client. Here are the portal access details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Client Email</p>
            <div className="flex items-center space-x-2">
              <div className="bg-gray-100 p-2 rounded text-sm flex-1">{portalDetails.clientEmail}</div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(portalDetails.clientEmail, "email")}
                className="h-8 w-8"
              >
                {copied === "email" ? <span className="text-green-500 text-xs">✓</span> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Temporary Password</p>
            <div className="flex items-center space-x-2">
              <div className="bg-gray-100 p-2 rounded text-sm flex-1">{portalDetails.tempPassword}</div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(portalDetails.tempPassword, "password")}
                className="h-8 w-8"
              >
                {copied === "password" ? (
                  <span className="text-green-500 text-xs">✓</span>
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Portal URL</p>
            <div className="flex items-center space-x-2">
              <div className="bg-gray-100 p-2 rounded text-sm flex-1 truncate">{portalDetails.portalUrl}</div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(portalDetails.portalUrl, "url")}
                className="h-8 w-8"
              >
                {copied === "url" ? <span className="text-green-500 text-xs">✓</span> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Proposal ID</p>
            <div className="bg-gray-100 p-2 rounded text-sm">{portalDetails.proposalId}</div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">Sent Date</p>
            <div className="bg-gray-100 p-2 rounded text-sm">{new Date(portalDetails.sentDate).toLocaleString()}</div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={openPortalPreview} className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Preview Portal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Also export as default for default import support
export default PortalPreviewModal
