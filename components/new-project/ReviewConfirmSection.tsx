"use client"

import type React from "react"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import type { PaymentDetails, PaymentError } from "@/lib/payment"
import {
  validatePaymentDetails,
  formatCardNumber,
  formatExpiryDate,
  formatPhoneNumber,
  processPayment,
} from "@/lib/payment"
import { Loader2 } from "lucide-react"

export function ReviewConfirmSection({ formData, updateFormData, onPaymentSuccess }) {
  console.log("formData in ReviewConfirmSection:", formData)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    paymentMethod: "",
    amount: 250, // Consultation fee
  })
  const [errors, setErrors] = useState<PaymentError[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value)
    setPaymentDetails((prev) => ({ ...prev, paymentMethod: value }))
    setErrors([])
    updateFormData({ paymentMethod: value })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    // Format input based on field type
    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value)
    } else if (name === "expiryDate") {
      formattedValue = formatExpiryDate(value)
    } else if (name === "zellePhone") {
      formattedValue = formatPhoneNumber(value)
    }

    setPaymentDetails((prev) => ({
      ...prev,
      [name]: formattedValue,
    }))

    // Clear error for this field
    setErrors((prev) => prev.filter((error) => error.field !== name))
  }

  const handleSubmitPayment = async () => {
    const validationErrors = validatePaymentDetails(paymentDetails)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please check your payment details and try again.",
      })
      return false
    }

    setIsProcessing(true)
    try {
      const result = await processPayment(paymentDetails)
      toast({
        title: "Payment Successful",
        description: result.message,
      })
      setIsProcessing(false)
      return true
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: error.message,
      })
      setIsProcessing(false)
      return false
    }
  }

  const handleThumbprintClick = async () => {
    setIsProcessing(true)
    try {
      const success = await handleSubmitPayment()
      if (success) {
        // Send confirmation email
        await sendConfirmationEmail(formData.email, {
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.appointmentTime,
          appointmentType: formData.appointmentType,
          projectName: formData.projectName,
        })
        onPaymentSuccess()
      } else {
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: "There was an error processing your payment. Please try again.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const sendConfirmationEmail = async (email, appointmentDetails) => {
    // In a real application, you would call your backend API to send the email
    // For this example, we'll just simulate the email sending
    console.log(`Sending confirmation email to ${email}`, appointmentDetails)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const getErrorMessage = (field: string) => {
    const error = errors.find((e) => e.field === field)
    return error ? error.message : ""
  }

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-base font-medium mb-6">Client Information</h2>
        <div className="space-y-4">
          <p className="text-sm">
            <span className="font-medium">Name:</span> {formData.firstName || 'Client name'} {formData.middleInitial } {formData.lastName}
          </p>
          <p className="text-sm">
            <span className="font-medium">Email:</span> {formData.email || 'Client@email.com'}
          </p>
          <p className="text-sm">
            <span className="font-medium">Phone:</span> {formData.phone || '(555) 123-4567'}
          </p>
          <p className="text-sm">
            <span className="font-medium">Alternate Phone:</span> {formData.alternatePhone || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium">Address:</span> {formData.streetAddress || 'Client address'}, {formData.city || 'Client city'}, {formData.state || 'Client state'}{" "}
            {formData.zipCode || 'Client zip code'}, {formData.country || 'Client country'}
          </p>
          <p className="text-sm">
            <span className="font-medium">Occupation:</span> {formData.occupation || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium">Company:</span> {formData.companyName || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium">Referral Source:</span> {formData.referralSource || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium">Previous Projects with Architect:</span>{" "}
            {formData.previousProjects === "yes" ? "Yes" : "No"}
          </p>
          <p className="text-sm">
            <span className="font-medium">Additional Comments:</span> {formData.additionalComments || "N/A"}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-base font-medium mb-6">Project Details</h2>
        <div className="space-y-4">
          <p className="text-sm">
            <span className="font-medium">Project Name:</span> {formData.projectName || 'Project name'}
          </p>
          <p className="text-sm">
            <span className="font-medium">Service Type:</span> {formData.serviceType || 'Service type'}
          </p>
          <p className="text-sm">
            <span className="font-medium">Square Footage:</span> {formData.squareFootage || 'Square footage'} sq ft
          </p>
          <p className="text-sm">
            <span className="font-medium">Project Address:</span> {formData.projectStreetAddress || 'Project street address'}, {formData.projectCity || 'Project city'}, {formData.projectState || 'Project state'} {formData.projectZipCode || 'Project zip code'}, {formData.projectCountry || 'Project country'}
          </p>
          <p className="text-sm">
            <span className="font-medium">Project Timeline:</span> {formData.projectTimeline || 'Project timeline'}
          </p>
          <p className="text-sm">
            <span className="font-medium">Budget Range:</span> {formData.budgetRange || 'Budget range'}
          </p>
          <p className="text-sm">
            <span className="font-medium">Architectural Style:</span> {formData.architecturalStyle || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium">Site Constraints:</span> {formData.siteConstraints || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium">Sustainability Goals:</span> {formData.sustainabilityGoals || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium">Special Requirements:</span> {formData.specialRequirements || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium">Project Description:</span> {formData.projectDescription}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-base font-medium mb-6">Appointment Details</h2>
        <div className="space-y-4">
          <p className="text-sm">
            <span className="font-medium">Date:</span>{" "}
            {formData.appointmentDate ? new Date(formData.appointmentDate).toDateString() : "Not set"}
          </p>
          <p className="text-sm">
            <span className="font-medium">Time:</span> {formData.appointmentTime}
          </p>
          <p className="text-sm">
            <span className="font-medium">Appointment Type:</span> {formData.appointmentType}
          </p>
          <p className="text-sm">
            <span className="font-medium">Location:</span> {formData.meetingLocation || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium">Additional Notes:</span> {formData.appointmentNotes || "N/A"}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-base font-medium mb-6">Payment</h2>
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium">Consultation Fee</span>
            <span className="text-lg font-semibold">${paymentDetails.amount.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-600">
            This fee will be applied to your project if you decide to move forward with our services.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="paymentMethod" className="text-xs">
              Payment Method
            </Label>
            <Select value={paymentMethod} onValueChange={handlePaymentMethodChange}>
              <SelectTrigger
                id="paymentMethod"
                className={`mt-2 w-full border rounded-md ${
                  getErrorMessage("paymentMethod") ? "border-red-500" : "border-gray-200"
                }`}
              >
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit">Credit Card</SelectItem>
                <SelectItem value="debit">Debit Card</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="zelle">Zelle</SelectItem>
                <SelectItem value="bitcoin">Bitcoin</SelectItem>
              </SelectContent>
            </Select>
            {getErrorMessage("paymentMethod") && (
              <p className="text-xs text-red-500 mt-1">{getErrorMessage("paymentMethod")}</p>
            )}
          </div>

          {(paymentMethod === "credit" || paymentMethod === "debit") && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="cardNumber" className="text-xs">
                  Card Number
                </Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className={`mt-2 w-full border rounded-md ${
                    getErrorMessage("cardNumber") ? "border-red-500" : "border-gray-200"
                  }`}
                  value={paymentDetails.cardNumber || ""}
                  onChange={handleInputChange}
                  maxLength={19}
                />
                {getErrorMessage("cardNumber") && (
                  <p className="text-xs text-red-500 mt-1">{getErrorMessage("cardNumber")}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="expiryDate" className="text-xs">
                    Expiry Date
                  </Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/YY"
                    className={`mt-2 w-full border rounded-md ${
                      getErrorMessage("expiryDate") ? "border-red-500" : "border-gray-200"
                    }`}
                    value={paymentDetails.expiryDate || ""}
                    onChange={handleInputChange}
                    maxLength={5}
                  />
                  {getErrorMessage("expiryDate") && (
                    <p className="text-xs text-red-500 mt-1">{getErrorMessage("expiryDate")}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="cvv" className="text-xs">
                    CVV
                  </Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    type="password"
                    maxLength={4}
                    className={`mt-2 w-full border rounded-md ${
                      getErrorMessage("cvv") ? "border-red-500" : "border-gray-200"
                    }`}
                    value={paymentDetails.cvv || ""}
                    onChange={handleInputChange}
                  />
                  {getErrorMessage("cvv") && <p className="text-xs text-red-500 mt-1">{getErrorMessage("cvv")}</p>}
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "paypal" && (
            <div>
              <Label htmlFor="paypalEmail" className="text-xs">
                PayPal Email
              </Label>
              <Input
                id="paypalEmail"
                name="paypalEmail"
                type="email"
                placeholder="name@example.com"
                className={`mt-2 w-full border rounded-md ${
                  getErrorMessage("paypalEmail") ? "border-red-500" : "border-gray-200"
                }`}
                value={paymentDetails.paypalEmail || ""}
                onChange={handleInputChange}
              />
              {getErrorMessage("paypalEmail") && (
                <p className="text-xs text-red-500 mt-1">{getErrorMessage("paypalEmail")}</p>
              )}
            </div>
          )}

          {paymentMethod === "zelle" && (
            <div>
              <Label htmlFor="zellePhone" className="text-xs">
                Phone Number
              </Label>
              <Input
                id="zellePhone"
                name="zellePhone"
                placeholder="(555) 123-4567"
                className={`mt-2 w-full border rounded-md ${
                  getErrorMessage("zellePhone") ? "border-red-500" : "border-gray-200"
                }`}
                value={paymentDetails.zellePhone || ""}
                onChange={handleInputChange}
              />
              {getErrorMessage("zellePhone") && (
                <p className="text-xs text-red-500 mt-1">{getErrorMessage("zellePhone")}</p>
              )}
            </div>
          )}

          {paymentMethod === "bitcoin" && (
            <div>
              <Label htmlFor="bitcoinAddress" className="text-xs">
                Bitcoin Address
              </Label>
              <Input
                id="bitcoinAddress"
                name="bitcoinAddress"
                placeholder="Enter Bitcoin wallet address"
                className={`mt-2 w-full border rounded-md ${
                  getErrorMessage("bitcoinAddress") ? "border-red-500" : "border-gray-200"
                }`}
                value={paymentDetails.bitcoinAddress || ""}
                onChange={handleInputChange}
              />
              {getErrorMessage("bitcoinAddress") && (
                <p className="text-xs text-red-500 mt-1">{getErrorMessage("bitcoinAddress")}</p>
              )}
            </div>
          )}

          {/* Removed Submit Project Button */}
        </div>
      </div>
      <div className="flex justify-center items-center mt-8">
        <button
          onClick={handleThumbprintClick}
          disabled={isProcessing}
          className="w-20 h-28 sm:w-24 sm:h-32 bg-black rounded-full shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 ease-in-out hover:scale-105 relative overflow-hidden"
        >
          <div className="relative z-10">
            <svg viewBox="0 0 100 140" className="w-20 h-28 sm:w-24 sm:h-32 fill-none" strokeWidth="1.5">
              <text
                x="50"
                y="60"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white text-[12px] sm:text-[14px] font-light tracking-[0.2em]"
              >
                SUBMIT
              </text>
              <text
                x="50"
                y="80"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white text-[12px] sm:text-[14px] font-light tracking-[0.2em]"
              >
                PROJECT
              </text>
            </svg>
          </div>
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </button>
      </div>
    </div>
  )
}
