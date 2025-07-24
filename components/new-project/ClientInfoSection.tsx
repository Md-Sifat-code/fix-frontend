"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { countries, usStates } from "@/data/countries-states"
import { ThumbprintButton } from "../ThumbprintButton"

interface ClientInfoSectionProps {
  clientData: any
  onNext: () => void
  onPrevious: () => void
  setClientData: (data: any) => void
  onSave?: () => void
  goToNextSection: () => void
}

export default function ClientInfoSection({
  clientData,
  onNext,
  onPrevious,
  setClientData,
  onSave,
 goToNextSection
}: ClientInfoSectionProps) {
  const [formData, setFormData] = useState({
    firstName: clientData?.firstName || "",
    middleName: clientData?.middleName || "",
    lastName: clientData?.lastName || "",
    companyName: clientData?.companyName || "",
    email: clientData?.email || "",
    phone: clientData?.phone || "",
    address: clientData?.address || "",
    city: clientData?.city || "",
    state: clientData?.state || "",
    zipCode: clientData?.zipCode || "",
    country: clientData?.country || "United States",
    projectDescription: clientData?.projectDescription || "",
  })

  const [selectedCountry, setSelectedCountry] = useState(formData.country || "United States")
  const [showStateSelect, setShowStateSelect] = useState(selectedCountry === "United States")

  useEffect(() => {
    // Show state selection only for United States
    setShowStateSelect(selectedCountry === "United States")

    // Reset state if country is not United States
    if (selectedCountry !== "United States") {
      setFormData((prev) => ({ ...prev, state: "" }))
    }
  }, [selectedCountry])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "country") {
      setSelectedCountry(value)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setClientData(formData)
    onNext()
  }

  const handleSave = () => {
    setClientData(formData)
    onSave?.()
  }

  // Get the selected country code for flag
  const selectedCountryCode = countries.find((c) => c.name === selectedCountry)?.code || ""

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-6">Client Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="middleName">Middle Name</Label>
          <Input id="middleName" name="middleName" value={formData.middleName} onChange={handleInputChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
        <Label htmlFor="companyName">Company Name (optional)</Label>
        <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} />
      </div>

      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Client Contact Address</Label>
        <div className="flex items-center gap-2">
          {selectedCountryCode && (
            <div className="flex-shrink-0 w-8 h-6 overflow-hidden rounded shadow">
              <img
                src={`https://flagcdn.com/w80/${selectedCountryCode.toLowerCase()}.png`}
                alt={`${selectedCountry} flag`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          <Select value={formData.country} onValueChange={(value) => handleSelectChange("country", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectGroup>
                <SelectLabel>Countries</SelectLabel>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.name}>
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-5 h-4 overflow-hidden rounded shadow">
                        <img
                          src={`https://flagcdn.com/w80/${country.code.toLowerCase()}.png`}
                          alt={`${country.name} flag`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <span>{country.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Street Address</Label>
        <Input id="address" name="address" value={formData.address} onChange={handleInputChange} required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
        </div>

        {showStateSelect ? (
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select value={formData.state} onValueChange={(value) => handleSelectChange("state", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>States</SelectLabel>
                  {usStates.map((state) => (
                    <SelectItem key={state.code} value={state.name}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            <Input id="state" name="state" value={formData.state} onChange={handleInputChange} />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip/Postal Code</Label>
          <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectDescription">Additional Information (Optional)</Label>
        <Textarea
          id="projectDescription"
          name="projectDescription"
          value={formData.projectDescription}
          onChange={handleInputChange}
          rows={4}
        />
      </div>

      <div className="flex justify-between mt-8">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>

        <div className="space-x-2">
          {onSave && (
            <Button type="button" variant="outline" onClick={handleSave}>
              Save
            </Button>
          )}
          {/* <Button type="submit">Continue</Button> */}
        </div>
      </div>
     <div className="w-full mt-10 flex justify-center items-center ">
         <div className="flex justify-center mt-8">
                 <ThumbprintButton onClick={goToNextSection} text="Next Step" />
               </div>
     </div>
    </form>
  )
}
