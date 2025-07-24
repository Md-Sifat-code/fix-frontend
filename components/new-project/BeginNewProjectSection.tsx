"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ThumbprintButton } from "@/components/ThumbprintButton";

export function BeginNewProjectSection({
  formData,
  updateFormData,
  goToNextSection,
}) {
  return (
    <div className="space-y-4 pb-6">
      <p className="text-sm text-gray-600">
        Welcome to Architecture Simple. We are committed to supporting you
        throughout every phase of your project. To begin, we will review the
        comprehensive range of services we offer and outline the scope of work
        involved.
      </p>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="basic-services">
          <AccordionTrigger className="text-sm font-medium">
            Basic Services
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-xs">
              <h4 className="font-medium">1. Pre-Design (10% of Fee)</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Site Survey</li>
                <li>Site Visit (1 max.)</li>
                <li>Geotechnical Report (Client Provided)</li>
                <li>Zoning & Preliminary Building Code Analysis</li>
                <li>Program & Project Scope Verification Document</li>
                <li>Owner/Architect Agreement</li>
              </ul>
              <h4 className="font-medium">
                2. Schematic Design (SD) - 20% of Fee
              </h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Site Plan</li>
                <li>Floor Plans</li>
                <li>Exterior Elevations</li>
                <li>Building Sections</li>
                <li>Preliminary Selection of Building Systems and Materials</li>
                <li>Preliminary Cost Estimate</li>
              </ul>
              <h4 className="font-medium">
                3. Design Development (DD) - 25% of Fee
              </h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Refined Floor Plans</li>
                <li>Refined Exterior Elevations</li>
                <li>Refined Building Sections</li>
                <li>Interior Elevations</li>
                <li>Detailed Wall Sections</li>
                <li>
                  Preliminary Structural, Mechanical, Electrical, and Plumbing
                  Plans
                </li>
                <li>Material and Finish Selections</li>
                <li>Updated Cost Estimate</li>
              </ul>
              <h4 className="font-medium">
                4. Construction Documents (CD) - 35% of Fee
              </h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Detailed Construction Drawings</li>
                <li>Specifications</li>
                <li>Coordination with Engineering Consultants</li>
                <li>
                  Final Structural, Mechanical, Electrical, and Plumbing Plans
                </li>
                <li>Door and Window Schedules</li>
                <li>Interior Finish Schedules</li>
                <li>Detailed Site Plan</li>
                <li>Final Cost Estimate</li>
                <li>Permit Application Assistance</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="additional-services">
          <AccordionTrigger className="text-sm font-medium">
            Additional Services
          </AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-4 space-y-1 text-sm text-gray-600">
              <li>Programming</li>
              <li>Bidding/Procurement & Construction Administration (CA)</li>
              <li>Rendering</li>
              <li>Photography</li>
              <li>LEED Certification</li>
              <li>Furniture, Fixtures, and Equipment (FF&E) Selection</li>
              <li>Post-occupancy Evaluation</li>
              <li>Building Information Modeling (BIM)</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="additional-info">
          <AccordionTrigger className="text-sm font-medium">
            Additional Information
          </AccordionTrigger>
          <AccordionContent>
            <p>
              Architecture Simple aims to provide assistance on client provided
              items as an additional service. Our ultimate goal is to assist the
              client from concept to finished construction in hopes to build
              long lasting client + architect relationships. We value your
              feedback and encourage you to share your thoughts on the project
              intake form. Please use our "Contact Us" page link below to offer
              your thoughts in helping us improve our client relations process.
            </p>
            <div className="mt-8 mb-4">
              <a
                href="/contact"
                className="text-black px-6 py-3 border border-gray-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact Us
              </a>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-center mt-8">
        <ThumbprintButton onClick={goToNextSection} text="Let's Begin" />
      </div>
    </div>
  );
}
