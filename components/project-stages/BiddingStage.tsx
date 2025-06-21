"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Eye, FileCheck, User, DollarSign } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Project } from "@/services/projects-service"
import { formatDate } from "@/lib/utils"

interface BiddingStageProps {
  project: Project
  onProjectUpdate: (updatedProject: Project) => void
  usedFallback?: boolean
}

export function BiddingStage({ project, onProjectUpdate, usedFallback = false }: BiddingStageProps) {
  const { toast } = useToast()
  const [isProposalAccepted, setIsProposalAccepted] = useState(false)
  const [isProposalSigned, setIsProposalSigned] = useState(false)
  const [isPaymentReceived, setIsPaymentReceived] = useState(false)

  // Initialize state from props only once on mount
  useEffect(() => {
    setIsProposalAccepted(project.proposal_accepted || false)
    setIsProposalSigned(project.proposal_signed || false)
    setIsPaymentReceived(project.payment_received || false)
  }, [project.proposal_accepted, project.proposal_signed, project.payment_received])

  const handleMarkAccepted = async () => {
    try {
      if (usedFallback) {
        // In fallback mode, just update the local state
        setIsProposalAccepted(true)
        toast({
          title: "Demo Mode",
          description: "Proposal marked as accepted (demo only)",
        })
      } else {
        // In normal mode, update the project in the database
        const updatedProject = {
          ...project,
          proposal_accepted: true,
          proposal_accepted_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        await onProjectUpdate(updatedProject)
        setIsProposalAccepted(true)
      }
    } catch (error) {
      console.error("Error marking proposal as accepted:", error)
      toast({
        title: "Error",
        description: "Failed to update proposal status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleMarkSigned = async () => {
    try {
      if (usedFallback) {
        // In fallback mode, just update the local state
        setIsProposalSigned(true)
        toast({
          title: "Demo Mode",
          description: "Proposal marked as signed (demo only)",
        })

        // Check if we should move to active stage
        if (isPaymentReceived) {
          toast({
            title: "Demo Mode",
            description: "Project moved to active stage (demo only)",
          })
        }
      } else {
        // In normal mode, update the project in the database
        const updatedProject = {
          ...project,
          proposal_signed: true,
          proposal_signed_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          // If payment is also received, move to active stage
          ...(isPaymentReceived && { stage: "active" }),
        }

        await onProjectUpdate(updatedProject)
        setIsProposalSigned(true)
      }
    } catch (error) {
      console.error("Error marking proposal as signed:", error)
      toast({
        title: "Error",
        description: "Failed to update proposal status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleMarkPaymentReceived = async () => {
    try {
      if (usedFallback) {
        // In fallback mode, just update the local state
        setIsPaymentReceived(true)
        toast({
          title: "Demo Mode",
          description: "Payment marked as received (demo only)",
        })

        // Check if we should move to active stage
        if (isProposalSigned) {
          toast({
            title: "Demo Mode",
            description: "Project moved to active stage (demo only)",
          })
        }
      } else {
        // In normal mode, update the project in the database
        const updatedProject = {
          ...project,
          payment_received: true,
          payment_received_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          // If proposal is also signed, move to active stage
          ...(isProposalSigned && { stage: "active" }),
        }

        await onProjectUpdate(updatedProject)
        setIsPaymentReceived(true)
      }
    } catch (error) {
      console.error("Error marking payment as received:", error)
      toast({
        title: "Error",
        description: "Failed to update payment status. Please try again.",
        variant: "destructive",
      })
    }
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
            <Badge variant="outline" className="text-amber-600 bg-amber-50 hover:bg-amber-100">
              Bidding Stage
            </Badge>
            {isProposalAccepted && (
              <Badge variant="outline" className="text-green-600 bg-green-50 hover:bg-green-100">
                Proposal Accepted
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={handlePreviewProposal}>
            <Eye className="mr-2 h-4 w-4" />
            Preview Proposal
          </Button>
          <Button variant="outline" onClick={handleDownloadProposal}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Proposal Status</CardTitle>
            <CardDescription>Track the status of your proposal with the client</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-4">Proposal Timeline</h3>
              <div className="space-y-4">
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="rounded-full h-8 w-8 bg-green-100 text-green-600 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div className="h-full w-0.5 bg-gray-200 my-1"></div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Proposal Sent</h4>
                    <p className="text-sm text-gray-500">
                      {project.proposal_sent_date ? formatDate(project.proposal_sent_date) : "Recently"}
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div
                      className={`rounded-full h-8 w-8 ${isProposalAccepted ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"} flex items-center justify-center`}
                    >
                      {isProposalAccepted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                      )}
                    </div>
                    <div className="h-full w-0.5 bg-gray-200 my-1"></div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Client Acceptance</h4>
                    <p className="text-sm text-gray-500">
                      {isProposalAccepted
                        ? project.proposal_accepted_date
                          ? formatDate(project.proposal_accepted_date)
                          : "Recently"
                        : "Awaiting client response"}
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div
                      className={`rounded-full h-8 w-8 ${isProposalSigned ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"} flex items-center justify-center`}
                    >
                      {isProposalSigned ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                      )}
                    </div>
                    <div className="h-full w-0.5 bg-gray-200 my-1"></div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Contract Signed</h4>
                    <p className="text-sm text-gray-500">
                      {isProposalSigned
                        ? project.proposal_signed_date
                          ? formatDate(project.proposal_signed_date)
                          : "Recently"
                        : "Awaiting signed contract"}
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div
                      className={`rounded-full h-8 w-8 ${isPaymentReceived ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"} flex items-center justify-center`}
                    >
                      {isPaymentReceived ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Payment Received</h4>
                    <p className="text-sm text-gray-500">
                      {isPaymentReceived
                        ? project.payment_received_date
                          ? formatDate(project.payment_received_date)
                          : "Recently"
                        : "Awaiting initial payment"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">Project Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-600">Project Type</h4>
                  <p className="text-gray-800 capitalize">{project.project_type}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600">Budget</h4>
                  <p className="text-gray-800">${project.budget?.toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600">Timeline</h4>
                  <p className="text-gray-800">{project.timeline}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600">Location</h4>
                  <p className="text-gray-800">{project.location}</p>
                </div>
              </div>
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

              <div className="space-y-3">
                {!isProposalAccepted && (
                  <Button variant="outline" className="w-full" onClick={handleMarkAccepted}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark Proposal as Accepted
                  </Button>
                )}

                {isProposalAccepted && !isProposalSigned && (
                  <Button variant="outline" className="w-full" onClick={handleMarkSigned}>
                    <FileCheck className="mr-2 h-4 w-4" />
                    Mark Contract as Signed
                  </Button>
                )}

                {isProposalAccepted && !isPaymentReceived && (
                  <Button variant="outline" className="w-full" onClick={handleMarkPaymentReceived}>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Mark Payment as Received
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Proposal Sent</span>
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
                    <span className="text-sm font-medium text-gray-700">Client Acceptance</span>
                    <Badge
                      variant="outline"
                      className={isProposalAccepted ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}
                    >
                      {isProposalAccepted ? "Complete" : "Pending"}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${isProposalAccepted ? "bg-green-600" : "bg-amber-500"}`}
                      style={{ width: isProposalAccepted ? "100%" : "0%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Contract Signed</span>
                    <Badge
                      variant="outline"
                      className={isProposalSigned ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}
                    >
                      {isProposalSigned ? "Complete" : "Pending"}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${isProposalSigned ? "bg-green-600" : "bg-amber-500"}`}
                      style={{ width: isProposalSigned ? "100%" : "0%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Payment Received</span>
                    <Badge
                      variant="outline"
                      className={isPaymentReceived ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}
                    >
                      {isPaymentReceived ? "Complete" : "Pending"}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${isPaymentReceived ? "bg-green-600" : "bg-amber-500"}`}
                      style={{ width: isPaymentReceived ? "100%" : "0%" }}
                    ></div>
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
