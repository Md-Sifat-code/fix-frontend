import Layout from "@/components/Layout"
import Link from "next/link"
import { Facebook, Instagram, Linkedin } from "lucide-react"

export default function AboutPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-24">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="space-y-6 text-gray-600">
              <p>
                Welcome to Architecture Simple! Established in 2023, we are a premier architectural firm based in
                Oakland, CA. With a passion for innovative design and a commitment to excellence, we strive to create
                spaces that inspire and transform. Our team of talented architects brings a wealth of experience and
                expertise to every project, ensuring exceptional results that exceed expectations.
              </p>
              <p>
                At Architecture Simple, we believe that architecture has the power to shape the world around us. Our
                mission is to design spaces that not only meet the functional needs of our clients but also reflect
                their unique vision and personality. Whether it's residential, commercial, or public projects, we
                approach each one with meticulous attention to detail and a focus on creating harmonious, sustainable
                environments.
              </p>
              <p>
                With a portfolio that spans a wide range of architectural styles and scales, we have the versatility to
                tackle any design challenge. From contemporary urban dwellings to timeless historic renovations, our
                projects showcase our ability to blend creativity, functionality, and aesthetics seamlessly. We are
                dedicated to delivering exceptional architectural solutions that stand the test of time and leave a
                lasting impact on the communities we serve.
              </p>
              <p>
                Experience the difference of working with Architecture Simple. Let us bring your architectural dreams to
                life with our expertise, passion, and commitment to excellence. Contact us today to discuss your project
                and embark on a journey of architectural transformation together.
              </p>
              <p className="italic">- CEO Eric Rivera</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-12 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-light mb-8">OFFICE LOCATION</h2>
              <div className="space-y-12">
                <div>
                  <h3 className="font-medium mb-2">Miami, FL</h3>
                  <p className="text-gray-600">5 NW St. Suite 400,</p>
                  <p className="text-gray-600">Miami, Florida 35521, US</p>
                  <Link href="tel:(925) 822-4374" className="text-blue-600 hover:text-blue-800">
                    (925) 822-4374
                  </Link>
                </div>

                <div>
                  <h3 className="font-medium mb-2">San Francisco, CA</h3>
                  <p className="text-gray-600">5 NW St. Suite 400,</p>
                  <p className="text-gray-600">Miami, Florida 35521, US</p>
                  <Link href="tel:(925) 822-4374" className="text-blue-600 hover:text-blue-800">
                    (925) 822-4374
                  </Link>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Austin, TX</h3>
                  <p className="text-gray-600">5 NW St. Suite 400,</p>
                  <p className="text-gray-600">Miami, Florida 35521, US</p>
                  <Link href="tel:(925) 822-4374" className="text-blue-600 hover:text-blue-800">
                    (925) 822-4374
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <Link href="/contact" className="block">
                <button className="w-full py-4 px-8 text-black text-lg font-light tracking-wider uppercase transition-all duration-300 ease-in-out hover:bg-black hover:text-white rounded-md border-2 border-black relative focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50">
                  <span className="relative z-10">Contact Us</span>
                  <span className="absolute inset-2 border border-black rounded-md pointer-events-none"></span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer section */}
        <div className="space-y-8 text-center mt-auto">
          <div className="space-y-4">
            <h2 className="text-sm">LICENSED TO PRACTICE IN THE FOLLOWING STATES</h2>
            <div className="flex justify-center items-center gap-4 text-sm">
              <span>CALIFORNIA</span>
              <span className="text-gray-300">.</span>
              <span>FLORIDA</span>
              <span className="text-gray-300">.</span>
              <span>TEXAS</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center gap-6">
              <Link href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Linkedin className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Facebook className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Instagram className="w-6 h-6" />
              </Link>
            </div>
            <p className="text-sm text-gray-500">Keep it Simple.</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
