"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, CheckCircle, Clock, Mail, MapPin, Phone, User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Project } from "@/services/projects-service"
import { formatDate } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Swal from 'sweetalert2'

interface InquiryStageProps {
  project: Project
  onProjectUpdate: (updatedProject: Project) => void
  usedFallback?: boolean
}

export function InquiryStage({ project, onProjectUpdate, usedFallback = false }: InquiryStageProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isConsultationCompleted, setIsConsultationCompleted] = useState(false)

  // Initialize state from props only once on mount
  useEffect(() => {
    setIsConsultationCompleted(project.consultation_completed || false)
  }, [project.consultation_completed])

  const handleMarkConsultationComplete = () => {
    if (usedFallback) {
      // In fallback mode, just update the local state
      setIsConsultationCompleted(true)
      toast({
        title: "Demo Mode",
        description: "Consultation marked as complete (demo only)",
      })
      return
    }

    // In normal mode, update the project in the database
    const updatedProject = {
      ...project,
      consultation_completed: true,
      updated_at: new Date().toISOString(),
    }

    onProjectUpdate(updatedProject)
    setIsConsultationCompleted(true)
  }

  const handleCreateProposal = () => {
    router.push(`/projects/${project.id}/create-proposal`)
  }

  const handleProposalCreated = (proposalData: any) => {
    if (usedFallback) {
      // In fallback mode, just show a toast
      toast({
        title: "Demo Mode",
        description: "Proposal created successfully (demo only)",
      })
      return
    }

    // In normal mode, update the project stage to "proposal"
    const updatedProject = {
      ...project,
      stage: "proposal",
      proposal_data: proposalData,
      updated_at: new Date().toISOString(),
    }

    onProjectUpdate(updatedProject)
  }
 
  // hendel delete 
 const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this inquiry deletion!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      if (usedFallback) {
        // Demo mode: just show a toast
        toast({
          title: "Demo Mode",
          description: "Inquiry deleted (demo only)",
        })
        // Optionally simulate deletion by calling onProjectUpdate(null)
        onProjectUpdate(null)
        return
      }

      try {
        // TODO: Call your API or delete logic here.
        // Example: await deleteInquiryAPI(project.id)
        
        // After successful delete:
        toast({
          title: "Deleted!",
          description: "Inquiry has been deleted successfully.",
        })
        onProjectUpdate(null) // inform parent the project is deleted

        // Optionally navigate away if needed
        router.push("/projects") // or another page

      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete inquiry. Please try again.",
          variant: "destructive"
        })
      }
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
         
          <div className="flex items-center mt-2 space-x-2">
            <Badge variant="outline" className="text-blue-600 bg-blue-50 hover:bg-blue-100">
              Inquiry Stage 
            </Badge>
            {isConsultationCompleted ? (
              <Badge variant="outline" className="text-green-600 bg-green-50 hover:bg-green-100">
                Consultation Completed
              </Badge>
            ) : (
              <Badge variant="outline" className="text-amber-600 bg-amber-50 hover:bg-amber-100">
                Awaiting Consultation
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button 
           onClick={handleDelete}
           className="px-6 py-1.5 bg-red-800 text-white rounded-md">Delete Inquiry  </button>
          {!isConsultationCompleted ? (
            <Button onClick={handleMarkConsultationComplete} className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark Consultation Complete 
            </Button>
          ) : (
            <Button onClick={handleCreateProposal} className="bg-blue-600 hover:bg-blue-700 text-white">
              Create Proposal
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Information about the project inquiry</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700">Description</h3>
              <p className="mt-1 text-gray-600">{project.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-700">Project Type</h3>
                <p className="mt-1 text-gray-600 capitalize">{project.project_type}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700">Budget</h3>
                <p className="mt-1 text-gray-600">${project.budget?.toLocaleString()}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700">Square Footage</h3>
                <p className="mt-1 text-gray-600">{project.square_footage?.toLocaleString()} sq ft</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700">Timeline</h3>
                <p className="mt-1 text-gray-600">{project.timeline}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700">Location</h3>
                <div className="mt-1 flex items-start">
                  <MapPin className="h-4 w-4 text-gray-400 mr-1 mt-1" />
                  <p className="text-gray-600">{project.location}</p>
                </div>
              </div>
            </div>

            {project.notes && (
              <div>
                <h3 className="font-medium text-gray-700">Additional Notes</h3>
                <p className="mt-1 text-gray-600">{project.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-700">{project.client?.name}</span>
              </div>

              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-700">{project.contact_email}</span>
              </div>

              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-700">{project.contact_phone}</span>
              </div>
              <div className="flex items-center">
                {/* <Phone className="h-4 w-4 text-gray-400 mr-2" /> */}
                <span className="text-gray-700">State: {project.location}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consultation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-700">
                  {project.consultation_date ? formatDate(project.consultation_date) : "Not scheduled"}
                </span>
              </div>

              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-700">
                  {project.consultation_date
                    ? new Date(project.consultation_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "Not scheduled"}
                </span>
                
              </div>
                    <div>
                      <h2>appointment type: Null</h2>
                    </div>
              <div className="mt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Consultation Status</span>
                  <span className="text-sm text-gray-500">{isConsultationCompleted ? "Completed" : "Pending"}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${isConsultationCompleted ? "bg-green-600" : "bg-amber-500"}`}
                    style={{ width: isConsultationCompleted ? "100%" : "0%" }}
                  ></div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {!isConsultationCompleted && (
                <Button variant="outline" className="w-full" onClick={handleMarkConsultationComplete}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Complete
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
