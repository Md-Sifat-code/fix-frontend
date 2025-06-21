"use client"

import type * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { useRouter } from "next/navigation"
import { useCallback, forwardRef, useState, useEffect } from "react"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-black text-white hover:bg-gray-800",
        outline: "border border-black text-black hover:bg-gray-100",
        ghost: "text-black hover:bg-gray-100",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-sm",
        xs: "h-7 rounded-md px-2 text-sm",
        xxs: "h-6 rounded-md px-1.5 text-sm",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        "icon-sm": "h-7 w-7",
        "icon-xs": "h-5 w-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  bankConnect?: boolean
  bankName?: string
  accountType?: "checking" | "savings" | "business" | "all"
  "data-employee-edit"?: string
  "data-employee-id"?: string
  "data-action"?: "edit" | "save" | "cancel"
  newProject?: boolean
  timer?: boolean
  timerStartTime?: number
  sendProposal?: boolean
  clientEmail?: string
  downloadPdf?: boolean
  proposalData?: any
  proposalAction?: "create" | "edit" | "save" | "continue" | "back" | "submit"
}

const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    asChild?: boolean
    bankConnect?: boolean
    timer?: boolean
    sendProposal?: boolean
    downloadPdf?: boolean
    proposalData?: any
    proposalAction?: "create" | "edit" | "save" | "continue" | "back" | "submit"
  }
>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      bankConnect = false,
      timer = false,
      sendProposal = false,
      downloadPdf = false,
      proposalAction = undefined,
      proposalData,
      ...props
    },
    ref,
  ) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [shouldRender, setShouldRender] = useState(false)
    const router = useRouter()

    useEffect(() => {
      setShouldRender(true)
    }, [])

    const generateClientSidePDF = useCallback(async () => {
      try {
        // Dynamically import jsPDF to avoid server-side issues
        const jsPDFModule = await import("jspdf")
        const { jsPDF } = jsPDFModule.default || jsPDFModule

        // Create a new PDF document
        const doc = new jsPDF()

        // Collect form data
        const projectName = document.querySelector('input[id="projectName"]')?.value || "Architecture Project"
        const clientFirstName = document.querySelector('input[id="clientFirstName"]')?.value || ""
        const clientLastName = document.querySelector('input[id="clientLastName"]')?.value || ""
        const clientName = `${clientFirstName} ${clientLastName}`.trim() || "Client"
        const projectAddress = document.querySelector('input[id="projectAddress"]')?.value || ""
        const projectType = document.querySelector('select[id="projectType"]')?.value || ""
        const serviceType = document.querySelector('select[id="serviceType"]')?.value || ""
        const estimatedBudget = document.querySelector('select[id="estimatedBudget"]')?.value || ""
        const expectedTimeline = document.querySelector('select[id="expectedTimeline"]')?.value || ""

        // Generate a unique ID for the proposal
        const proposalId = `ARCH-${Date.now().toString().slice(-6)}`

        // Add content to PDF
        doc.setFontSize(22)
        doc.text("Architecture Simple", 105, 20, { align: "center" })
        doc.setFontSize(16)
        doc.text("Professional Services Contract", 105, 30, { align: "center" })

        doc.setFontSize(12)
        doc.text(`Contract ID: ${proposalId}`, 200, 40, { align: "right" })
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 200, 48, { align: "right" })

        doc.setFontSize(14)
        doc.text("Project Information", 20, 60)
        doc.line(20, 62, 80, 62)

        doc.setFontSize(12)
        doc.text(`Project Name: ${projectName}`, 20, 70)
        doc.text(`Client: ${clientName}`, 20, 78)
        doc.text(`Project Address: ${projectAddress}`, 20, 86)
        doc.text(`Project Type: ${projectType}`, 20, 94)
        doc.text(`Service Type: ${serviceType}`, 20, 102)
        doc.text(`Estimated Budget: ${estimatedBudget}`, 20, 110)
        doc.text(`Expected Timeline: ${expectedTimeline}`, 20, 118)

        // Contract terms
        doc.setFontSize(14)
        doc.text("Contract Terms", 20, 130)
        doc.line(20, 132, 80, 132)

        doc.setFontSize(12)
        doc.text("This agreement is entered into as of the date of signature below, by and", 20, 140)
        doc.text("between Architecture Simple and the client named above.", 20, 148)

        doc.text("1. Scope of Services: The Architect agrees to provide professional", 20, 160)
        doc.text("   architectural services as outlined in the attached proposal.", 20, 168)

        // Signature lines
        doc.text("Client: _______________________________", 20, 200)
        doc.text("Date: _______________________________", 20, 210)
        doc.text("Architect: _______________________________", 20, 230)
        doc.text("Date: _______________________________", 20, 240)

        // Footer
        doc.setFontSize(10)
        doc.text("This document is a legally binding contract. Please read carefully before signing.", 105, 260, {
          align: "center",
        })
        doc.text(`Generated on ${new Date().toLocaleString()}`, 105, 268, { align: "center" })

        // Create a timestamp-based filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
        const filename = `${projectName.replace(/\s+/g, "-")}_Contract_${timestamp}.pdf`

        // Save the PDF
        doc.save(filename)
        return true
      } catch (error) {
        console.error("Error generating PDF:", error)
        throw error
      }
    }, [])

    const handleClick = useCallback(
      async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (props.onClick) {
          props.onClick(e)
        }

        if (bankConnect) {
          router.push("/connect-bank-account")
        }

        if (sendProposal) {
          setIsLoading(true)
          try {
            const response = await fetch("/api/send-proposal", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ proposalData }),
            })

            if (response.ok) {
              setIsSuccess(true)
              setTimeout(() => {
                setIsSuccess(false)
              }, 3000)
            } else {
              console.error("Failed to send proposal")
            }
          } catch (error) {
            console.error("Error sending proposal:", error)
          } finally {
            setIsLoading(false)
          }
        }

        if (downloadPdf) {
          setIsLoading(true)
          try {
            // Use client-side PDF generation only
            await generateClientSidePDF()
            setIsSuccess(true)
            setTimeout(() => {
              setIsSuccess(false)
            }, 3000)
          } catch (error) {
            console.error("Error in PDF download process:", error)
            alert("There was an issue generating the PDF. Please try again later.")
          } finally {
            setIsLoading(false)
          }
        }

        if (proposalAction === "create") {
          router.push("/new-proposal")
        } else if (proposalAction === "edit" || proposalAction === "continue") {
          // Handle navigation to edit or continue a proposal
          if (props["data-proposal-id"]) {
            router.push(`/proposals/${props["data-proposal-id"]}/edit`)
          }
        } else if (proposalAction === "submit") {
          setIsLoading(true)
          try {
            // Submit proposal logic
            await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
            setIsSuccess(true)
            setTimeout(() => {
              setIsSuccess(false)
              if (props["data-redirect"]) {
                router.push(props["data-redirect"] as string)
              }
            }, 1500)
          } catch (error) {
            console.error("Error submitting proposal:", error)
          } finally {
            setIsLoading(false)
          }
        }
      },
      [bankConnect, sendProposal, downloadPdf, proposalAction, router, generateClientSidePDF],
    )

    const Comp = asChild ? Slot : "button"

    return shouldRender ? (
      <Comp
        className={`${buttonVariants({ variant, size, className })} ${bankConnect ? "bank-connect-button" : ""} ${
          timer ? "relative" : ""
        } ${sendProposal ? "send-proposal-button" : ""} ${downloadPdf ? "download-pdf-button" : ""} ${
          proposalAction ? `proposal-${proposalAction}-button` : ""
        }`}
        ref={ref}
        onClick={handleClick}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && downloadPdf ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Preparing PDF...
          </span>
        ) : isSuccess && downloadPdf ? (
          <span className="flex items-center">
            <svg
              className="-ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Downloaded!
          </span>
        ) : (
          props.children
        )}
        {timer && <div className="absolute inset-0 bg-primary/20 rounded-md timer-overlay"></div>}
      </Comp>
    ) : null
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
