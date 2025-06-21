"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Edit, Eye, Send, User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Project } from "@/services/projects-service"

interface ProposalStageProps {
  project: Project
  onProjectUpdate: (updatedProject: Project) => void
  usedFallback?: boolean
}

export function ProposalStage({ project, onProjectUpdate, usedFallback = false }: ProposalStageProps) {
  const { toast } = useToast()
  const [isSending, setIsSending] = useState(false)

  const handleSendProposal = async () => {
    setIsSending(true)

    try {
      if (usedFallback) {
        // In fallback mode, just show a toast
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay
        toast({
          title: "Demo Mode",
          description: "Proposal sent successfully (demo only)",
        })
      } else {
        // In normal mode, update the project stage to "bidding"
        const updatedProject = {
          ...project,
          stage: "bidding",
          proposal_sent_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        await onProjectUpdate(updatedProject)
        toast({
          title: "Success",
          description: "Proposal sent to client successfully",
        })
      }
    } catch (error) {
      console.error("Error sending proposal:", error)
      toast({
        title: "Error",
        description: "Failed to send proposal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleEditProposal = () => {
    toast({
      title: "Edit Proposal",
      description: "Opening proposal editor...",
    })
    // Implement proposal editing functionality
  }

  const handlePreviewProposal = () => {
    toast({
      title: "Preview Proposal",
      description: "Opening proposal preview...",
    })
    // Implement proposal preview functionality
  }

  const handleDownloadProposal = () => {
    toast({
      title: "Download Proposal",
      description: "Downloading proposal PDF...",
    })
    // Implement proposal download functionality
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <div className="flex items-center mt-2 space-x-2">
            <Badge variant="outline" className="text-purple-600 bg-purple-50 hover:bg-purple-100">
              Proposal Stage
            </Badge>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleSendProposal}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isSending}
          >
            <Send className="mr-2 h-4 w-4" />
            {isSending ? "Sending..." : "Send Proposal"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Proposal Details</CardTitle>
            <CardDescription>Review and manage the project proposal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3 mb-6">
              <Button variant="outline" onClick={handleEditProposal}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" onClick={handlePreviewProposal}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button variant="outline" onClick={handleDownloadProposal}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>

            <div>
              <h3 className="font-medium text-gray-700">Project Scope</h3>
              <p className="mt-1 text-gray-600">
                {project.proposal_data?.scope ||
                  "Detailed architectural services for the design and construction documentation of the project."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700">Estimated Fee</h3>
                <p className="mt-1 text-gray-600">
                  ${project.proposal_data?.fee?.toLocaleString() || project.budget?.toLocaleString()}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700">Timeline</h3>
                <p className="mt-1 text-gray-600">{project.proposal_data?.timeline || project.timeline}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700">Services Included</h3>
              <ul className="mt-1 list-disc list-inside text-gray-600">
                {(
                  project.proposal_data?.services || [
                    "Schematic Design",
                    "Design Development",
                    "Construction Documents",
                    "Bidding Assistance",
                    "Construction Administration",
                  ]
                ).map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-700">Payment Schedule</h3>
              <ul className="mt-1 list-disc list-inside text-gray-600">
                {(
                  project.proposal_data?.paymentSchedule || [
                    "25% upon signing the contract",
                    "25% upon completion of Design Development",
                    "25% upon completion of Construction Documents",
                    "25% upon completion of Construction Administration",
                  ]
                ).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <User className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-700">{project.client?.name}</span>
              </div>

              <Button variant="outline" className="w-full" onClick={handleSendProposal} disabled={isSending}>
                <Send className="mr-2 h-4 w-4" />
                {isSending ? "Sending..." : "Send Proposal to Client"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Proposal Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Created</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Complete
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="h-2.5 rounded-full bg-green-600 w-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Reviewed</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Complete
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="h-2.5 rounded-full bg-green-600 w-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Sent to Client</span>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700">
                      Pending
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="h-2.5 rounded-full bg-amber-500 w-0"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
