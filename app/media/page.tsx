"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Calendar,
  FileImage,
  FileText,
  Filter,
  PlusCircle,
  Search,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MediaPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-light mb-2">Media Center</h1>
            <p className="text-gray-600">
              Manage, publish, and analyze your firm's media content
            </p>
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
                      Plan, schedule, and organize your media content with the
                      integrated content calendar.
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
                      Track performance metrics for your media content and
                      measure audience engagement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12">
          <h2 className="text-xl font-medium mb-6">Media Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaCategories.map((category) => (
              <Link key={category.title} href={category.link} className="group">
                <Card className="overflow-hidden h-full transition-shadow duration-300 group-hover:shadow-lg">
                  <div className="relative h-48">
                    <Image
                      src={"https://picsum.photos/1280/720"}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-medium mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Component for metric cards
function MetricCard({ title, value, change, trend, icon }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            <div className="flex items-center mt-1">
              <Badge
                variant={trend === "up" ? "success" : "destructive"}
                className="mr-2"
              >
                {change}
              </Badge>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          </div>
          <div className="p-2 rounded-full bg-gray-100">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

// Component for content cards
function ContentCard({ content }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-40">
        <Image
          src={"https://picsum.photos/1280/720"}
          alt={content.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge
            variant={content.status === "Published" ? "success" : "secondary"}
          >
            {content.status}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-1">{content.title}</h3>
        <p className="text-gray-500 text-sm mb-2">
          {content.type} • {content.date}
        </p>
        <p className="text-sm text-gray-600 line-clamp-2">
          {content.description}
        </p>
      </CardContent>
    </Card>
  );
}

// Component for asset cards
function AssetCard({ asset }: { asset: any }) {
  return (
    <div className="relative group cursor-pointer rounded-lg overflow-hidden border border-gray-200">
      <div className="relative h-40 bg-gray-100">
        <Image
          src={"https://picsum.photos/1280/720"}
          alt={asset.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-2">
        <p className="text-sm font-medium truncate">{asset.name}</p>
        <p className="text-xs text-gray-500">
          {asset.format} • {asset.size}
        </p>
      </div>
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="sm" className="mr-2">
          View
        </Button>
        <Button size="sm">Use</Button>
      </div>
    </div>
  );
}

// Sample data
const mediaCategories = [
  {
    title: "News",
    description:
      "Stay updated with the latest architectural trends and company announcements.",
    image: "https://picsum.photos/1280/720",
    link: "/media/newsfeed",
  },
  {
    title: "Projects",
    description:
      "Explore our portfolio of innovative and sustainable architectural projects.",
    image: "https://picsum.photos/1280/720",
    link: "/media/projects",
  },
  {
    title: "Publications",
    description: "Read our thought leadership articles and industry insights.",
    image: "https://picsum.photos/1280/720",
    link: "/media/publications",
  },
  {
    title: "Spotlight",
    description:
      "Featured stories and in-depth looks at our most impactful work.",
    image: "https://picsum.photos/1280/720",
    link: "/media/spotlight",
  },
];

const recentContent = [
  {
    id: 1,
    title: "Smith Residence Wins Design Award",
    type: "News",
    status: "Published",
    date: "Mar 24, 2025",
    image: "https://picsum.photos/1280/720",
    description:
      "Our Smith Residence project has been recognized with a prestigious design award for innovative sustainable architecture.",
  },
  {
    id: 2,
    title: "New Urban Planning Initiative",
    type: "Article",
    status: "Draft",
    date: "Mar 27, 2025",
    image: "https://picsum.photos/1280/720",
    description:
      "Exploring the future of urban development with our new initiative focused on community-centered planning approaches.",
  },
  {
    id: 3,
    title: "Green Building Materials Guide",
    type: "Publication",
    status: "Published",
    date: "Mar 20, 2025",
    image: "https://picsum.photos/1280/720",
    description:
      "A comprehensive guide to the latest sustainable building materials and their practical applications in modern architecture.",
  },
];

const mediaAssets = [
  {
    id: 1,
    name: "Tokyo Office Exterior.jpg",
    thumbnail: "https://picsum.photos/1280/720",
    format: "JPG",
    size: "2.4 MB",
  },
  {
    id: 2,
    name: "Smith Residence Blueprint.pdf",
    thumbnail: "https://picsum.photos/1280/720",
    format: "PDF",
    size: "4.8 MB",
  },
  {
    id: 3,
    name: "Green Building Presentation.pptx",
    thumbnail: "https://picsum.photos/1280/720",
    format: "PPTX",
    size: "8.2 MB",
  },
  {
    id: 4,
    name: "Downtown Project Render.png",
    thumbnail: "https://picsum.photos/1280/720",
    format: "PNG",
    size: "3.7 MB",
  },
  {
    id: 5,
    name: "Site Analysis Video.mp4",
    thumbnail: "https://picsum.photos/1280/720",
    format: "MP4",
    size: "24.5 MB",
  },
  {
    id: 6,
    name: "Material Samples.jpg",
    thumbnail: "https://picsum.photos/1280/720",
    format: "JPG",
    size: "1.8 MB",
  },
  {
    id: 7,
    name: "Concept Sketches.ai",
    thumbnail: "https://picsum.photos/1280/720",
    format: "AI",
    size: "12.3 MB",
  },
  {
    id: 8,
    name: "Model 3D.glb",
    thumbnail: "https://picsum.photos/1280/720",
    format: "GLB",
    size: "18.9 MB",
  },
];
