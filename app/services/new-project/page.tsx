"use client"

import { useState } from "react"
import Layout from "@/components/Layout"
import ClientInfoSection from "@/components/new-project/ClientInfoSection"
import { ProjectDetailsSection } from "@/components/new-project/ProjectDetailsSection"
import { ScheduleAppointmentSection } from "@/components/new-project/ScheduleAppointmentSection"
import { ReviewConfirmSection } from "@/components/new-project/ReviewConfirmSection"
import { BeginNewProjectSection } from "@/components/new-project/BeginNewProjectSection"
import { ConfirmationPage } from "@/components/new-project/ConfirmationPage"
import { useToast } from "@/components/ui/use-toast"

const sections = [
  "1. Service Details",
  "2. Client Details",
  "3. Project Details",
  "4. Schedule Appointment",
  "5. Review & Confirm",
]

export default function NewProjectPage() {
  const [activeSection, setActiveSection] = useState(0)
  const [formData, setFormData] = useState({
    // Client Information
    firstName: "",
    middleInitial: "",
    lastName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    occupation: "",
    companyName: "",
    referralSource: "",
    previousProjects: "",
    additionalComments: "",

    // Project Details
    projectName: "",
    projectStreetAddress: "",
    projectCity: "",
    projectState: "",
    projectZipCode: "",
    projectCountry: "",
    serviceType: "",
    squareFootage: "",
    projectDescription: "",
    projectTimeline: "",
    budgetRange: "",
    architecturalStyle: "",
    siteConstraints: "",
    sustainabilityGoals: "",
    specialRequirements: "",

    // Appointment Details
    appointmentDate: null,
    appointmentTime: "",
    appointmentType: "",
    appointmentLocation: "",
    appointmentNotes: "",
    meetingLocation: "", // Added meetingLocation field

    // Documents
    propertyBoundarySurveyMap: null,
    additionalProjectPhotos: [],

    // Payment
    paymentMethod: "",
  })
  const [paymentSuccessful, setPaymentSuccessful] = useState(false)
  const { toast } = useToast()

  const updateFormData = (newData) => {
    setFormData({ ...formData, ...newData })
  }

  const goToNextSection = () => {
    if (activeSection < sections.length - 1) {
      setActiveSection(activeSection + 1)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background text-foreground">
        {/* Fixed header section */}
        <div className="fixed top-[73px] left-0 right-0 bg-background z-20 border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="overflow-x-auto">
              <div className="flex space-x-2 md:space-x-4 py-4">
                {sections.map((section, index) => (
                  <button
                    key={index}
                    className={`py-1 px-2 text-xs md:text-sm font-light whitespace-nowrap transition-colors duration-300 ease-in-out ${
                      index === activeSection
                        ? "text-primary border-b-2 border-primary"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                    onClick={() => setActiveSection(index)}
                  >
                    {section}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content area with padding for fixed header */}
        <div className="pt-[137px] pb-8">
          <div className="max-w-7xl mx-auto px-4">
            {paymentSuccessful ? (
              <ConfirmationPage
                appointmentDate={formData.appointmentDate}
                appointmentTime={formData.appointmentTime}
                appointmentType={formData.appointmentType}
                projectName={formData.projectName}
                clientName={`${formData.firstName} ${formData.lastName}`}
                clientEmail={formData.email}
              />
            ) : (
              <div className="relative">
                {/* Section content */}
                <div className="space-y-8">
                  {activeSection === 0 && (
                    <BeginNewProjectSection
                      formData={formData}
                      updateFormData={updateFormData}
                      goToNextSection={() => setActiveSection(1)}
                    />
                  )}
                  {activeSection === 1 && (
                    <ClientInfoSection
                      formData={formData}
                      updateFormData={updateFormData}
                      goToNextSection={() => setActiveSection(2)}
                    />
                  )}
                  {activeSection === 2 && (
                    <ProjectDetailsSection
                      formData={formData}
                      updateFormData={updateFormData}
                      goToNextSection={() => setActiveSection(3)}
                    />
                  )}
                  {activeSection === 3 && (
                    <ScheduleAppointmentSection
                      formData={formData}
                      updateFormData={updateFormData}
                      goToNextSection={() => setActiveSection(4)}
                    />
                  )}
                  {activeSection === 4 && (
                    <ReviewConfirmSection
                      formData={formData}
                      updateFormData={updateFormData}
                      onPaymentSuccess={() => setPaymentSuccessful(true)}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
