"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ArchitectureSimplePage() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="https://picsum.photos/1280/720"
              alt="Logo"
              width={32}
              height={32}
              className="mr-2"
            />
            <h1 className="text-xl font-bold text-gray-900">
              Architecture Simple
            </h1>
          </div>
          <nav className="hidden md:flex space-x-4">
            <Button variant="ghost" onClick={() => setActiveTab("media")}>
              Media
            </Button>
            <Button variant="ghost" onClick={() => setActiveTab("services")}>
              Services
            </Button>
            <Button variant="ghost" onClick={() => setActiveTab("about")}>
              About
            </Button>
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setActiveTab("media")}>
                Media
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setActiveTab("services")}>
                Services
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setActiveTab("about")}>
                About
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "home" && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Welcome to Architecture Simple
            </h2>
            <div className="aspect-w-16 aspect-h-9 mb-6">
              <Image
                src="https://picsum.photos/1280/720"
                alt="Featured Project"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <p className="text-lg text-gray-700 mb-8">
              We create innovative, sustainable, and aesthetically pleasing
              designs that push the boundaries of modern architecture.
            </p>
            <Button onClick={() => setActiveTab("media")}>
              View Our Projects
            </Button>
          </section>
        )}

        {activeTab === "media" && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((project) => (
                <Card key={project} className="overflow-hidden">
                  <Image
                    src={"https://picsum.photos/1280/720"}
                    alt={`Project ${project}`}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold mb-2">
                      Project {project}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Modern architectural design showcasing innovation and
                      sustainability.
                    </p>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {activeTab === "services" && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                "Residential Design",
                "Commercial Projects",
                "Urban Planning",
                "Interior Design",
                "Sustainable Architecture",
              ].map((service, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{service}</h3>
                    <p className="text-gray-600 mb-4">
                      We offer comprehensive {service.toLowerCase()} services
                      tailored to meet the unique needs of each client. Our team
                      ensures high-quality results from concept to completion.
                    </p>
                    <Button variant="outline">Learn More</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {activeTab === "about" && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About Us</h2>
            <div className="prose max-w-none">
              <p>
                Architecture Simple is a forward-thinking architectural firm
                dedicated to creating innovative, sustainable, and aesthetically
                pleasing designs. Our team of experienced architects and
                designers work collaboratively to bring our clients' visions to
                life.
              </p>
              <p>
                With a focus on modern architecture and eco-friendly solutions,
                we strive to push the boundaries of conventional design while
                maintaining functionality and practicality.
              </p>
              <h3 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h3>
              <p>
                At Architecture Simple, our mission is to transform spaces and
                enrich lives through innovative design. We believe in:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Pushing the boundaries of architectural innovation</li>
                <li>Prioritizing sustainability in every project</li>
                <li>
                  Creating spaces that inspire and improve quality of life
                </li>
                <li>
                  Collaborating closely with clients to bring their visions to
                  reality
                </li>
              </ul>
              <h3 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-gray-500" />
                  <span>info@architecturesimple.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-gray-500" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                  <span>123 Design Street, Creativity City, AR 12345</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <Image
                src="https://picsum.photos/1280/720"
                alt="Logo"
                width={32}
                height={32}
                className="inline-block mr-2"
              />
              <span className="text-xl font-bold">Architecture Simple</span>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Terms of Service
              </a>
            </div>
          </div>
          <div className="mt-4 text-center sm:text-left text-sm text-gray-500">
            © 2023 Architecture Simple. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
