"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Video } from "lucide-react"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Inquiry {
  id: number
  name: string
  number: string
  stage: "inquiry"
  phase: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientAddress: string
  clientCity: string
  clientState: string
  clientZipCode: string
  clientCountry: string
  projectName: string
  projectAddress: string
  projectCity: string
  projectState: string
  projectZipCode: string
  projectCountry: string
  serviceType: string
  squareFootage: string
  projectDescription: string
  desiredTimeline: string
  specificRequirements: string
  estimatedBudget: string
  appointmentTime: string
  appointmentDate: string
  currentTask: string
  nextTask: string
  location: string
  notes: string | null
  videoChatLink: string
  propertyBoundarySurveyMap: string
  additionalProjectPhotos?: string[]
}

interface InquiryReviewPageProps {
  inquiry: Inquiry
  onClose: () => void
}

export function InquiryReviewPage({ inquiry, onClose }: InquiryReviewPageProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("client-info")

  const handleCreateProposal = () => {
    // Here you would typically initiate the proposal creation process
    console.log("Creating proposal for inquiry:", inquiry.id)
    // For now, we'll just close the review page
    onClose()
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Button variant="ghost" onClick={onClose} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Inquiry Review: {inquiry.projectName}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="client-info">Client Info</TabsTrigger>
              <TabsTrigger value="project-details">Project Details</TabsTrigger>
              <TabsTrigger value="appointment">Appointment</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="client-info">
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Client Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName">Client Name</Label>
                      <Input id="clientName" value={inquiry.clientName} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="clientEmail">Email</Label>
                      <Input id="clientEmail" value={inquiry.clientEmail} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="clientPhone">Phone</Label>
                      <Input id="clientPhone" value={inquiry.clientPhone} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="clientAddress">Address</Label>
                      <Input id="clientAddress" value={inquiry.clientAddress} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="clientCity">City</Label>
                      <Input id="clientCity" value={inquiry.clientCity} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="clientState">State</Label>
                      <Input id="clientState" value={inquiry.clientState} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="clientZipCode">ZIP Code</Label>
                      <Input id="clientZipCode" value={inquiry.clientZipCode} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="clientCountry">Country</Label>
                      <Input id="clientCountry" value={inquiry.clientCountry} readOnly />
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="project-details">
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Project Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="projectName">Project Name</Label>
                      <Input id="projectName" value={inquiry.projectName} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="projectNumber">Project Number</Label>
                      <Input id="projectNumber" value={inquiry.number} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="serviceType">Service Type</Label>
                      <Input id="serviceType" value={inquiry.serviceType} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="squareFootage">Square Footage</Label>
                      <Input id="squareFootage" value={inquiry.squareFootage} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="estimatedBudget">Estimated Budget</Label>
                      <Input id="estimatedBudget" value={inquiry.estimatedBudget} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="desiredTimeline">Desired Timeline</Label>
                      <Input id="desiredTimeline" value={inquiry.desiredTimeline} readOnly />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="projectAddress">Project Address</Label>
                      <Input
                        id="projectAddress"
                        value={`${inquiry.projectAddress}, ${inquiry.projectCity}, ${inquiry.projectState} ${inquiry.projectZipCode}, ${inquiry.projectCountry}`}
                        readOnly
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="projectDescription">Project Description</Label>
                      <Textarea id="projectDescription" value={inquiry.projectDescription} readOnly />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="specificRequirements">Specific Requirements</Label>
                      <Textarea id="specificRequirements" value={inquiry.specificRequirements} readOnly />
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="appointment">
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Appointment Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="appointmentDate">Date</Label>
                      <Input id="appointmentDate" value={inquiry.appointmentDate} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="appointmentTime">Time</Label>
                      <Input id="appointmentTime" value={inquiry.appointmentTime} readOnly />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="videoChatLink">Video Chat Link</Label>
                      <div className="flex items-center gap-2">
                        <Input id="videoChatLink" value={inquiry.videoChatLink} readOnly />
                        <Button
                          onClick={() => window.open(inquiry.videoChatLink, "_blank")}
                          className="flex items-center space-x-2"
                        >
                          <Video className="w-4 h-4" />
                          <span>Join</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Current Status</h4>
                    <p>
                      <strong>Phase:</strong> {inquiry.phase}
                    </p>
                    <p>
                      <strong>Current Task:</strong> {inquiry.currentTask}
                    </p>
                    <p>
                      <strong>Next Task:</strong> {inquiry.nextTask}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" value={inquiry.notes || ""} readOnly />
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="documents">
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Uploaded Documents</h3>
                  <div>
                    <Label htmlFor="propertyBoundarySurveyMap">Property Boundary/Survey Map</Label>
                    <div className="flex items-center gap-2">
                      <Input id="propertyBoundarySurveyMap" value={inquiry.propertyBoundarySurveyMap} readOnly />
                      <Button onClick={() => window.open(inquiry.propertyBoundarySurveyMap, "_blank")}>View</Button>
                    </div>
                  </div>
                  <div>
                    <Label>Additional Project Photos</Label>
                    {inquiry.additionalProjectPhotos && inquiry.additionalProjectPhotos.length > 0 ? (
                      <ul className="list-disc list-inside space-y-2">
                        {inquiry.additionalProjectPhotos.map((photo, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span>{photo}</span>
                            <Button size="sm" onClick={() => window.open(photo, "_blank")}>
                              View
                            </Button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No additional project photos uploaded.</p>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleCreateProposal}>Create Proposal</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
