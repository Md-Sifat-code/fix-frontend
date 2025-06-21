import Link from "next/link"
import Image from "next/image"
import Layout from "@/components/Layout"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

const serviceCategories = [
  {
    title: "New Project",
    description:
      "Start your architectural journey with us. We offer comprehensive services to bring your vision to life.",
    image: "/placeholder.svg?height=400&width=600&text=New+Project",
    link: "/services/new-project",
  },
  {
    title: "Portfolio",
    description: "Explore our past projects and see how we've helped clients transform their spaces.",
    image: "/placeholder.svg?height=400&width=600&text=Portfolio",
    link: "/services/portfolio",
  },
]

export default function ServicesPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-light mb-8 text-center">Our Services</h1>
        <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          We offer a range of architectural services tailored to meet your unique needs. From concept to completion,
          we're here to guide you through every step of the process.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {serviceCategories.map((category, index) => (
            <Link key={category.title} href={category.link} className="group">
              <Card className="overflow-hidden transition-shadow duration-300 group-hover:shadow-lg h-full flex flex-col">
                <div className="relative h-80">
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 group-hover:bg-opacity-30" />
                  <h2 className="absolute bottom-6 left-6 text-3xl font-semibold text-white">{category.title}</h2>
                </div>
                <CardContent className="p-6 flex-grow flex flex-col justify-between">
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex items-center text-blue-600 group-hover:text-blue-800 transition-colors duration-300">
                    <span className="mr-2">Learn More</span>
                    <ArrowRight size={20} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to start your project?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're looking to build a new home, renovate an existing space, or embark on a commercial project,
            we're here to help you bring your vision to life.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
          >
            Contact Us
            <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </div>
    </Layout>
  )
}
