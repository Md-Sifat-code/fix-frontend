"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ThumbprintButton } from "@/components/ThumbprintButton";
import Image from "next/image";

// Array of all U.S. states
const usStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

// Array of all countries (this is a simplified list, you might want to use a more comprehensive one)
const countries = [
  { name: "Select Country", code: "" },
  { name: "Afghanistan", code: "AF" },
  { name: "Albania", code: "AL" },
  { name: "Algeria", code: "DZ" },
  { name: "Andorra", code: "AD" },
  { name: "Angola", code: "AO" },
  { name: "Antigua and Barbuda", code: "AG" },
  { name: "Argentina", code: "AR" },
  { name: "Armenia", code: "AM" },
  { name: "Australia", code: "AU" },
  { name: "Austria", code: "AT" },
  { name: "Azerbaijan", code: "AZ" },
  { name: "Bahamas", code: "BS" },
  { name: "Bahrain", code: "BH" },
  { name: "Bangladesh", code: "BD" },
  { name: "Barbados", code: "BB" },
  { name: "Belarus", code: "BY" },
  { name: "Belgium", code: "BE" },
  { name: "Belize", code: "BZ" },
  { name: "Benin", code: "BJ" },
  { name: "Bhutan", code: "BT" },
  { name: "Bolivia", code: "BO" },
  { name: "Bosnia and Herzegovina", code: "BA" },
  { name: "Botswana", code: "BW" },
  { name: "Brazil", code: "BR" },
  { name: "Brunei", code: "BN" },
  { name: "Bulgaria", code: "BG" },
  { name: "Burkina Faso", code: "BF" },
  { name: "Burundi", code: "BI" },
  { name: "Cambodia", code: "KH" },
  { name: "Cameroon", code: "CM" },
  { name: "Canada", code: "CA" },
  { name: "Cape Verde", code: "CV" },
  { name: "Central African Republic", code: "CF" },
  { name: "Chad", code: "TD" },
  { name: "Chile", code: "CL" },
  { name: "China", code: "CN" },
  { name: "Colombia", code: "CO" },
  { name: "Comoros", code: "KM" },
  { name: "Congo", code: "CG" },
  { name: "Costa Rica", code: "CR" },
  { name: "Croatia", code: "HR" },
  { name: "Cuba", code: "CU" },
  { name: "Cyprus", code: "CY" },
  { name: "Czech Republic", code: "CZ" },
  { name: "Democratic Republic of the Congo", code: "CD" },
  { name: "Denmark", code: "DK" },
  { name: "Djibouti", code: "DJ" },
  { name: "Dominica", code: "DM" },
  { name: "Dominican Republic", code: "DO" },
  { name: "East Timor", code: "TL" },
  { name: "Ecuador", code: "EC" },
  { name: "Egypt", code: "EG" },
  { name: "El Salvador", code: "SV" },
  { name: "Equatorial Guinea", code: "GQ" },
  { name: "Eritrea", code: "ER" },
  { name: "Estonia", code: "EE" },
  { name: "Ethiopia", code: "ET" },
  { name: "Fiji", code: "FJ" },
  { name: "Finland", code: "FI" },
  { name: "France", code: "FR" },
  { name: "Gabon", code: "GA" },
  { name: "Gambia", code: "GM" },
  { name: "Georgia", code: "GE" },
  { name: "Germany", code: "DE" },
  { name: "Ghana", code: "GH" },
  { name: "Greece", code: "GR" },
  { name: "Grenada", code: "GD" },
  { name: "Guatemala", code: "GT" },
  { name: "Guinea", code: "GN" },
  { name: "Guinea-Bissau", code: "GW" },
  { name: "Guyana", code: "GY" },
  { name: "Haiti", code: "HT" },
  { name: "Honduras", code: "HN" },
  { name: "Hungary", code: "HU" },
  { name: "Iceland", code: "IS" },
  { name: "India", code: "IN" },
  { name: "Indonesia", code: "ID" },
  { name: "Iran", code: "IR" },
  { name: "Iraq", code: "IQ" },
  { name: "Ireland", code: "IE" },
  { name: "Israel", code: "IL" },
  { name: "Italy", code: "IT" },
  { name: "Ivory Coast", code: "CI" },
  { name: "Jamaica", code: "JM" },
  { name: "Japan", code: "JP" },
  { name: "Jordan", code: "JO" },
  { name: "Kazakhstan", code: "KZ" },
  { name: "Kenya", code: "KE" },
  { name: "Kiribati", code: "KI" },
  { name: "Kuwait", code: "KW" },
  { name: "Kyrgyzstan", code: "KG" },
  { name: "Laos", code: "LA" },
  { name: "Latvia", code: "LV" },
  { name: "Lebanon", code: "LB" },
  { name: "Lesotho", code: "LS" },
  { name: "Liberia", code: "LR" },
  { name: "Libya", code: "LY" },
  { name: "Liechtenstein", code: "LI" },
  { name: "Lithuania", code: "LT" },
  { name: "Luxembourg", code: "LU" },
  { name: "Madagascar", code: "MG" },
  { name: "Malawi", code: "MW" },
  { name: "Malaysia", code: "MY" },
  { name: "Maldives", code: "MV" },
  { name: "Mali", code: "ML" },
  { name: "Malta", code: "MT" },
  { name: "Marshall Islands", code: "MH" },
  { name: "Mauritania", code: "MR" },
  { name: "Mauritius", code: "MU" },
  { name: "Mexico", code: "MX" },
  { name: "Micronesia", code: "FM" },
  { name: "Moldova", code: "MD" },
  { name: "Monaco", code: "MC" },
  { name: "Mongolia", code: "MN" },
  { name: "Montenegro", code: "ME" },
  { name: "Morocco", code: "MA" },
  { name: "Mozambique", code: "MZ" },
  { name: "Myanmar", code: "MM" },
  { name: "Namibia", code: "NA" },
  { name: "Nauru", code: "NR" },
  { name: "Nepal", code: "NP" },
  { name: "Netherlands", code: "NL" },
  { name: "New Zealand", code: "NZ" },
  { name: "Nicaragua", code: "NI" },
  { name: "Niger", code: "NE" },
  { name: "Nigeria", code: "NG" },
  { name: "North Korea", code: "KP" },
  { name: "North Macedonia", code: "MK" },
  { name: "Norway", code: "NO" },
  { name: "Oman", code: "OM" },
  { name: "Pakistan", code: "PK" },
  { name: "Palau", code: "PW" },
  { name: "Palestine", code: "PS" },
  { name: "Panama", code: "PA" },
  { name: "Papua New Guinea", code: "PG" },
  { name: "Paraguay", code: "PY" },
  { name: "Peru", code: "PE" },
  { name: "Philippines", code: "PH" },
  { name: "Poland", code: "PL" },
  { name: "Portugal", code: "PT" },
  { name: "Qatar", code: "QA" },
  { name: "Romania", code: "RO" },
  { name: "Russia", code: "RU" },
  { name: "Rwanda", code: "RW" },
  { name: "Saint Kitts and Nevis", code: "KN" },
  { name: "Saint Lucia", code: "LC" },
  { name: "Saint Vincent and the Grenadines", code: "VC" },
  { name: "Samoa", code: "WS" },
  { name: "San Marino", code: "SM" },
  { name: "Sao Tome and Principe", code: "ST" },
  { name: "Saudi Arabia", code: "SA" },
  { name: "Senegal", code: "SN" },
  { name: "Serbia", code: "RS" },
  { name: "Seychelles", code: "SC" },
  { name: "Sierra Leone", code: "SL" },
  { name: "Singapore", code: "SG" },
  { name: "Slovakia", code: "SK" },
  { name: "Slovenia", code: "SI" },
  { name: "Solomon Islands", code: "SB" },
  { name: "Somalia", code: "SO" },
  { name: "South Africa", code: "ZA" },
  { name: "South Korea", code: "KR" },
  { name: "South Sudan", code: "SS" },
  { name: "Spain", code: "ES" },
  { name: "Sri Lanka", code: "LK" },
  { name: "Sudan", code: "SD" },
  { name: "Suriname", code: "SR" },
  { name: "Sweden", code: "SE" },
  { name: "Switzerland", code: "CH" },
  { name: "Syria", code: "SY" },
  { name: "Taiwan", code: "TW" },
  { name: "Tajikistan", code: "TJ" },
  { name: "Tanzania", code: "TZ" },
  { name: "Thailand", code: "TH" },
  { name: "Togo", code: "TG" },
  { name: "Tonga", code: "TO" },
  { name: "Trinidad and Tobago", code: "TT" },
  { name: "Tunisia", code: "TN" },
  { name: "Turkey", code: "TR" },
  { name: "Turkmenistan", code: "TM" },
  { name: "Tuvalu", code: "TV" },
  { name: "Uganda", code: "UG" },
  { name: "Ukraine", code: "UA" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "United Kingdom", code: "GB" },
  { name: "United States", code: "US" },
  { name: "Uruguay", code: "UY" },
  { name: "Uzbekistan", code: "UZ" },
  { name: "Vanuatu", code: "VU" },
  { name: "Vatican City", code: "VA" },
  { name: "Venezuela", code: "VE" },
  { name: "Vietnam", code: "VN" },
  { name: "Yemen", code: "YE" },
  { name: "Zambia", code: "ZM" },
  { name: "Zimbabwe", code: "ZW" },
];

export function ProjectDetailsSection({
  formData,
  updateFormData,
  goToNextSection,
}) {
  const [sameAsMailingAddress, setSameAsMailingAddress] = React.useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (!sameAsMailingAddress || !name.startsWith("project")) {
      updateFormData({ [name]: value });
    }
  };

  const handleSelectChange = (name, value) => {
    if (name === "projectCountry") {
      if (value === "Select Country") {
        updateFormData({ [name]: "", projectState: "" });
      } else if (
        value !== "United States" &&
        formData.projectState !== "Outside of U.S. Jurisdiction"
      ) {
        updateFormData({
          [name]: value,
          projectState: "Outside of U.S. Jurisdiction",
        });
      } else {
        updateFormData({ [name]: value });
      }
    } else {
      updateFormData({ [name]: value });
    }
  };

  const handleSameAsMailingAddressChange = (checked: boolean) => {
    setSameAsMailingAddress(checked);
    if (checked) {
      updateFormData({
        projectStreetAddress: formData.streetAddress,
        projectCity: formData.city,
        projectState: formData.state,
        projectZipCode: formData.zipCode,
        projectCountry: formData.country,
      });
    }
  };

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h2 className="text-base font-medium mb-4">Project Name</h2>
        <div>
          <Label htmlFor="projectName" className="text-xs font-normal">
            Name
          </Label>
          <Input
            id="projectName"
            name="projectName"
            value={formData.projectName}
            onChange={handleInputChange}
            className="mt-1"
            required
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium">Project Location</h2>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sameAsMailingAddress"
              checked={sameAsMailingAddress}
              onCheckedChange={(checked) =>
                handleSameAsMailingAddressChange(checked as boolean)
              }
            />
            <Label htmlFor="sameAsMailingAddress" className="text-sm">
              Same as mailing address
            </Label>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="projectStreetAddress"
              className="text-xs font-normal"
            >
              Street Address
            </Label>
            <Input
              id="projectStreetAddress"
              name="projectStreetAddress"
              value={formData.projectStreetAddress}
              onChange={handleInputChange}
              className="mt-1"
              required
              disabled={sameAsMailingAddress}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projectCity" className="text-xs font-normal">
                City
              </Label>
              <Input
                id="projectCity"
                name="projectCity"
                value={formData.projectCity}
                onChange={handleInputChange}
                className="mt-1"
                required
                disabled={sameAsMailingAddress}
              />
            </div>
            <div>
              <Label htmlFor="projectState" className="text-xs font-normal">
                State
              </Label>
              <Select
                name="projectState"
                value={formData.projectState}
                onValueChange={(value) =>
                  handleSelectChange("projectState", value)
                }
                disabled={sameAsMailingAddress}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {usStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                  <SelectItem value="Outside of U.S. Jurisdiction">
                    Outside of U.S. Jurisdiction
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projectZipCode" className="text-xs font-normal">
                Zip Code
              </Label>
              <Input
                id="projectZipCode"
                name="projectZipCode"
                value={formData.projectZipCode}
                onChange={handleInputChange}
                className="mt-1"
                required
                disabled={sameAsMailingAddress}
              />
            </div>
            <div>
              <Label htmlFor="projectCountry" className="text-xs font-normal">
                Country
              </Label>
              <Select
                name="projectCountry"
                value={formData.projectCountry}
                onValueChange={(value) =>
                  handleSelectChange("projectCountry", value)
                }
                disabled={sameAsMailingAddress}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.name}>
                      <div className="flex items-center">
                        {country.code && (
                          <Image
                            src={"https://picsum.photos/1280/720"}
                            width={20}
                            height={15}
                            alt={`${country.name} flag`}
                            className="mr-2"
                          />
                        )}
                        {country.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-base font-medium mb-4">Project Specifications</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="serviceType" className="text-xs font-normal">
              Service Type
            </Label>
            <Select
              name="serviceType"
              value={formData.serviceType || "new-construction"}
              onValueChange={(value) =>
                handleSelectChange("serviceType", value)
              }
            >
              <SelectTrigger id="serviceType" className="mt-1">
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new-construction">
                  New Construction
                </SelectItem>
                <SelectItem value="renovation">Renovation</SelectItem>
                <SelectItem value="addition">Addition</SelectItem>
                <SelectItem value="interior-design">Interior Design</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="squareFootage" className="text-xs font-normal">
              Square Footage
            </Label>
            <Input
              id="squareFootage"
              name="squareFootage"
              type="number"
              value={formData.squareFootage}
              onChange={handleInputChange}
              className="mt-1"
              required
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-base font-medium mb-4">
          Project Timeline and Budget
        </h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="projectTimeline" className="text-xs font-normal">
              Expected Project Timeline
            </Label>
            <Select
              name="projectTimeline"
              value={formData.projectTimeline}
              onValueChange={(value) =>
                handleSelectChange("projectTimeline", value)
              }
            >
              <SelectTrigger id="projectTimeline" className="mt-1">
                <SelectValue placeholder="Select expected timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-6-months">0-6 months</SelectItem>
                <SelectItem value="6-12-months">6-12 months</SelectItem>
                <SelectItem value="1-2-years">1-2 years</SelectItem>
                <SelectItem value="2-plus-years">2+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="budgetRange" className="text-xs font-normal">
              Budget Range
            </Label>
            <Select
              name="budgetRange"
              value={formData.budgetRange}
              onValueChange={(value) =>
                handleSelectChange("budgetRange", value)
              }
            >
              <SelectTrigger id="budgetRange" className="mt-1">
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-100k">Under $100,000</SelectItem>
                <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
                <SelectItem value="500k-1m">$500,000 - $1 million</SelectItem>
                <SelectItem value="over-1m">Over $1 million</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-base font-medium mb-4">
          Architectural Preferences
        </h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="architecturalStyle" className="text-xs font-normal">
              Preferred Architectural Style
            </Label>
            <Textarea
              id="architecturalStyle"
              name="architecturalStyle"
              value={formData.architecturalStyle}
              onChange={handleInputChange}
              className="mt-1"
              placeholder="e.g., Modern, Traditional, Mediterranean, etc."
            />
          </div>
          <div>
            <Label htmlFor="siteConstraints" className="text-xs font-normal">
              Site Constraints or Challenges
            </Label>
            <Textarea
              id="siteConstraints"
              name="siteConstraints"
              value={formData.siteConstraints}
              onChange={handleInputChange}
              className="mt-1"
              placeholder="e.g., Sloped terrain, flood zone, etc."
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-base font-medium mb-4">
          Sustainability and Special Requirements
        </h2>
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="sustainabilityGoals"
              className="text-xs font-normal"
            >
              Sustainability Goals
            </Label>
            <Textarea
              id="sustainabilityGoals"
              name="sustainabilityGoals"
              value={formData.sustainabilityGoals}
              onChange={handleInputChange}
              className="mt-1"
              placeholder="e.g., LEED certification, energy efficiency, etc."
            />
          </div>
          <div>
            <Label
              htmlFor="specialRequirements"
              className="text-xs font-normal"
            >
              Special Requirements or Accessibility Needs
            </Label>
            <Textarea
              id="specialRequirements"
              name="specialRequirements"
              value={formData.specialRequirements}
              onChange={handleInputChange}
              className="mt-1"
              placeholder="e.g., ADA compliance, home office, etc."
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-base font-medium mb-4">Required Documents</h2>
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="propertyBoundarySurveyMap"
              className="text-xs font-normal"
            >
              Property Boundary/Survey Map
            </Label>
            <Input
              id="propertyBoundarySurveyMap"
              name="propertyBoundarySurveyMap"
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  updateFormData({
                    propertyBoundarySurveyMap: e.target.files[0],
                  });
                }
              }}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label
              htmlFor="additionalProjectPhotos"
              className="text-xs font-normal"
            >
              Additional Project Photos (Optional)
            </Label>
            <Input
              id="additionalProjectPhotos"
              name="additionalProjectPhotos"
              type="file"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  updateFormData({
                    additionalProjectPhotos: Array.from(e.target.files),
                  });
                }
              }}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <ThumbprintButton onClick={goToNextSection} text="Next Step" />
      </div>
    </div>
  );
}
