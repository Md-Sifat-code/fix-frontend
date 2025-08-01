"use client"


import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Layout from "@/components/Layout"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarChart, Calendar, FileImage, FileText, Filter, PlusCircle, Search, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"




export default function MediaDashboardPage() {
    const [searchQuery, setSearchQuery] = useState("")
    interface MetricCardProps {
      title: string;
      value: string;
      change: string;
      trend: 'up' | 'down';
      icon: React.ReactNode;
    }

    function MetricCard({ title, value, change, trend, icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            <div className="flex items-center mt-1">
              <Badge variant={trend === "up" ? "success" : "destructive"} className="mr-2">
                {change}
              </Badge>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          </div>
          <div className="p-2 rounded-full bg-gray-100">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ContentItem {
  id: number;
  title: string;
  type: string;
  status: string;
  date: string;
  image: string;
  description: string;
}

function ContentCard({ content }: { content: ContentItem }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-40">
        <Image src={content.image || "/placeholder.svg"} alt={content.title} fill className="object-cover" />
        <div className="absolute top-2 right-2">
          <Badge variant={content.status === "Published" ? "success" : "secondary"}>{content.status}</Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-1">{content.title}</h3>
        <p className="text-gray-500 text-sm mb-2">
          {content.type} • {content.date}
        </p>
        <p className="text-sm text-gray-600 line-clamp-2">{content.description}</p>
      </CardContent>
    </Card>
  )
}

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
           <h1 className="text-3xl font-bold mb-6">Media Dashboard</h1>
        <p className="mb-4">
          Welcome to the Media Dashboard. Here you can manage all your media
          content.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/media/projects">
            <Button className="w-full">Projects</Button>
          </Link>
          <Link href="/media/news">
            <Button className="w-full">News</Button>
          </Link>
          <Link href="/media/publications">
            <Button className="w-full">Publications</Button>
          </Link>
        </div>
        {/* new component start here  */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 mt-14">
          <div>
            <h1 className="text-3xl font-light mb-2">Media Center</h1>
            <p className="text-gray-600">Manage, publish, and analyze your firm's media content</p>
          </div>

          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search media..."
                className="pl-8 w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="default">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Content
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content-calendar">Content Calendar</TabsTrigger>
            <TabsTrigger value="assets">Media Assets</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <MetricCard
                title="Total Content"
                value="217"
                change="+12%"
                trend="up"
                icon={<FileText className="h-8 w-8 text-blue-500" />}
              />
              <MetricCard
                title="Media Views"
                value="14.3k"
                change="+8.2%"
                trend="up"
                icon={<TrendingUp className="h-8 w-8 text-green-500" />}
              />
              <MetricCard
                title="Assets"
                value="892"
                change="+21"
                trend="up"
                icon={<FileImage className="h-8 w-8 text-purple-500" />}
              />
            </div>

            <h2 className="text-xl font-medium mb-4">Recent Content</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
              {recentContent.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button variant="outline">View All Content</Button>
            </div>
          </TabsContent>

          {/* Content Calendar Tab */}
          <TabsContent value="content-calendar">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Content Calendar</span>
                  <Button size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Schedule Content
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center h-[400px]">
                  <div className="flex flex-col items-center">
                    <Calendar className="h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">Content Calendar</p>
                    <p className="text-gray-500 text-center max-w-md mt-2">
                      Plan, schedule, and organize your media content with the integrated content calendar.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Assets Tab */}
          <TabsContent value="assets">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Media Library</span>
                  <Button size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Upload Files
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mediaAssets.map((asset) => (
                    <AssetCard key={asset.id} asset={asset} />
                  ))}
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <Button variant="outline">View All Assets</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Performance Analytics</span>
                  <div>
                    <Button variant="outline" size="sm">
                      Last 30 Days
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center h-[400px]">
                  <div className="flex flex-col items-center">
                    <BarChart className="h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">Analytics Dashboard</p>
                    <p className="text-gray-500 text-center max-w-md mt-2">
                      Track performance metrics for your media content and measure audience engagement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* new component end here  */}

     
      </div>
    </Layout>
  );
}

interface Asset {
  id: number;
  name: string;
  thumbnail?: string;
  format: string;
  size: string;
}

function AssetCard({ asset }: { asset: Asset }) {
  return (
    <div className="relative group cursor-pointer rounded-lg overflow-hidden border border-gray-200">
      <div className="relative h-40 bg-gray-100">
        <Image src={asset.thumbnail || "/placeholder.svg"} alt={asset.name} fill className="object-cover" />
      </div>
      <div className="p-2">
        <p className="text-sm font-medium truncate">{asset.name}</p>
        <p className="text-xs text-gray-500">
          {asset.format} • {asset.size}
        </p>
      </div>
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="outline" size="sm" className="mr-2">
          View
        </Button>
        <Button size="sm">Use</Button>
      </div>
    </div>
  )
}


const recentContent = [
  {
    id: 1,
    title: "Smith Residence Wins Design Award",
    type: "News",
    status: "Published",
    date: "Mar 24, 2025",
    image: "/placeholder.svg?height=300&width=600&text=Smith+Residence",
    description:
      "Our Smith Residence project has been recognized with a prestigious design award for innovative sustainable architecture.",
  },
  {
    id: 2,
    title: "New Urban Planning Initiative",
    type: "Article",
    status: "Draft",
    date: "Mar 27, 2025",
    image: "/placeholder.svg?height=300&width=600&text=Urban+Planning",
    description:
      "Exploring the future of urban development with our new initiative focused on community-centered planning approaches.",
  },
  {
    id: 3,
    title: "Green Building Materials Guide",
    type: "Publication",
    status: "Published",
    date: "Mar 20, 2025",
    image: "/placeholder.svg?height=300&width=600&text=Green+Materials",
    description:
      "A comprehensive guide to the latest sustainable building materials and their practical applications in modern architecture.",
  },
]



const mediaAssets = [
  {
    id: 1,
    name: "Tokyo Office Exterior.jpg",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Image",
    format: "JPG",
    size: "2.4 MB",
  },
  {
    id: 2,
    name: "Smith Residence Blueprint.pdf",
    thumbnail: "/placeholder.svg?height=200&width=300&text=PDF",
    format: "PDF",
    size: "4.8 MB",
  },
  {
    id: 3,
    name: "Green Building Presentation.pptx",
    thumbnail: "/placeholder.svg?height=200&width=300&text=PPTX",
    format: "PPTX",
    size: "8.2 MB",
  },
  {
    id: 4,
    name: "Downtown Project Render.png",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Render",
    format: "PNG",
    size: "3.7 MB",
  },
  {
    id: 5,
    name: "Site Analysis Video.mp4",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Video",
    format: "MP4",
    size: "24.5 MB",
  },
  {
    id: 6,
    name: "Material Samples.jpg",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Samples",
    format: "JPG",
    size: "1.8 MB",
  },
  {
    id: 7,
    name: "Concept Sketches.ai",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Sketch",
    format: "AI",
    size: "12.3 MB",
  },
  {
    id: 8,
    name: "Model 3D.glb",
    thumbnail: "/placeholder.svg?height=200&width=300&text=3D+Model",
    format: "GLB",
    size: "18.9 MB",
  },
]