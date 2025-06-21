import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function LetsBeginSection({ formData, updateFormData }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-medium mb-4">Basic Scope</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="design-plans">
            <AccordionTrigger>Design Plans</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Pre-Design (10% of Fee)</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 mt-2">
                    <li>Site Survey (Showing topographic information, existing structures, utilities, etc.)</li>
                    <li>Geotechnical Report (Client Provided)</li>
                    <li>Zoning & Preliminary Building Code Analysis</li>
                    <li>Program & Project Scope Verification Document</li>
                    <li>Owner/Architect Agreement (AIA B101 or similar)</li>
                  </ul>
                </div>
                {/* Add other design plan sections here */}
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* Add other accordion items for additional services, etc. */}
        </Accordion>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-4">Additional Services</h2>
        <Accordion type="single" collapsible className="w-full">
          {/* Add accordion items for additional services */}
        </Accordion>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-4">Additional Information</h2>
        <Accordion type="single" collapsible className="w-full">
          {/* Add accordion items for additional information */}
        </Accordion>
      </div>
    </div>
  )
}
