"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Layout from "@/components/Layout"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

interface NewsItem {
  id: number
  title: string
  date: string
  summary: string
  image: string
  source: string
}

interface FeaturedProject {
  id: number
  name: string
  year: number
  architect: string
  photographer: string
  location: string
  summary: string
  images: string[]
}

const featuredProject: FeaturedProject = {
  id: 1,
  name: "Floating Pavilion",
  year: 2023,
  architect: "Zaha Hadid Architects",
  photographer: "Iwan Baan",
  location: "Rotterdam, Netherlands",
  summary:
    "A stunning waterfront structure that seamlessly blends with its environment, showcasing innovative use of sustainable materials and cutting-edge design techniques. This project of the month exemplifies the future of adaptive architecture, responding to both environmental and social needs of urban spaces.",
  images: [
    "/placeholder.svg?height=400&width=600&text=Floating+Pavilion+1",
    "/placeholder.svg?height=400&width=600&text=Floating+Pavilion+2",
    "/placeholder.svg?height=400&width=600&text=Floating+Pavilion+3",
  ],
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    title: "Architecture Simple Wins Design Award",
    date: "June 15, 2023",
    summary: "Our eco-friendly office complex project receives recognition for innovative sustainable design.",
    image: "/placeholder.svg?height=100&width=100&text=Award",
    source: "Architectural Digest",
  },
  {
    id: 2,
    title: "New Urban Planning Initiative Launched",
    date: "June 10, 2023",
    summary: "We're partnering with the city to develop a new community-focused urban renewal project.",
    image: "/placeholder.svg?height=100&width=100&text=Urban+Planning",
    source: "CityLab",
  },
  {
    id: 3,
    title: "Spotlight on Our Latest Residential Project",
    date: "June 5, 2023",
    summary: "Explore our modern approach to home design in our recently completed residential project.",
    image: "/placeholder.svg?height=100&width=100&text=Residential",
    source: "Dwell Magazine",
  },
  {
    id: 4,
    title: "Architecture Simple Expands Team",
    date: "May 28, 2023",
    summary: "We're excited to welcome new talent to our growing team of architects and designers.",
    image: "/placeholder.svg?height=100&width=100&text=Team",
    source: "Architect Magazine",
  },
  {
    id: 5,
    title: "Upcoming Webinar: Future of Sustainable Architecture",
    date: "May 20, 2023",
    summary: "Join us for an insightful discussion on the future trends in sustainable architectural design.",
    image: "/placeholder.svg?height=100&width=100&text=Webinar",
    source: "ArchDaily",
  },
]

export default function NewsfeedPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-light mb-6">Project of the Month</h2>
        <Card className="mb-12">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <Carousel className="mb-4">
                  <CarouselContent>
                    {featuredProject.images.map((image, index) => (
                      <CarouselItem key={index}>
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${featuredProject.name} - Image ${index + 1}`}
                          width={400}
                          height={300}
                          className="w-full rounded-lg object-cover"
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-xl font-semibold mb-2">{featuredProject.name}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-4">
                  <span>Year: {featuredProject.year}</span>
                  <span>Architect: {featuredProject.architect}</span>
                  <span>Photo: {featuredProject.photographer}</span>
                  <span>Location: {featuredProject.location}</span>
                </div>
                <p className="text-gray-600 mb-4">{featuredProject.summary}</p>
                <Button variant="outline">View Project Details</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-light mb-6">Latest News</h2>
        <div className="space-y-8">
          {newsItems.map((news) => (
            <Card key={news.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Image
                    src={news.image || "/placeholder.svg"}
                    alt={news.title}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-semibold">{news.title}</h2>
                      <span className="text-sm text-gray-500">{news.date}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{news.summary}</p>
                    <div className="flex justify-between items-center">
                      <Button variant="outline">Read Full Article</Button>
                      <span className="text-sm text-gray-500">Source: {news.source}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}
