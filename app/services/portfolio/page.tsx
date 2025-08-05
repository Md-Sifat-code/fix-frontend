"use client";

import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  year: number;
  description?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Modern Residence",
    category: "Residential",
    description: "Historic Building ",
    image: "/placeholder.svg?height=300&width=400&text=Modern+Residence",
    year: 2023,
  },
  {
    id: 2,
    title: "City Center Plaza",
    description: "Historic Building Renovation",
    category: "Urban Planning",
    image: "/placeholder.svg?height=300&width=400&text=City+Center+Plaza",
    year: 2022,
  },
  {
    id: 3,
    title: "Eco-Friendly Office Complex",
    description: "Historic Building Renovation",
    category: "Commercial",
    image: "/placeholder.svg?height=300&width=400&text=Eco-Friendly+Office",
    year: 2021,
  },
  {
    id: 4,
    title: "Historic Building Renovation",
    description: "Historic Building Renovation",
    category: "Restoration",
    image: "/placeholder.svg?height=300&width=400&text=Historic+Renovation",
    year: 2020,
  },
  {
    id: 5,
    title: "Sustainable Community Center",
    description: "Historic Building Renovation",
    category: "Public",
    image: "/placeholder.svg?height=300&width=400&text=Community+Center",
    year: 2022,
  },
  {
    id: 6,
    title: "Luxury Hotel Design",
    description: "Historic Building Renovation",
    category: "Hospitality",
    image: "/placeholder.svg?height=300&width=400&text=Luxury+Hotel",
    year: 2023,
  },
];

export default function PortfolioPage() {
  const [sortBy, setSortBy] = useState<"title" | "year">("title");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = useMemo(() => {
    return Array.from(new Set(projects.map((project) => project.category)));
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredAndSortedProjects = useMemo(() => {
    return projects
      .filter(
        (project) =>
          selectedCategories.length === 0 ||
          selectedCategories.includes(project.category)
      )
      .sort((a, b) => {
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        } else {
          return b.year - a.year;
        }
      });
  }, [selectedCategories, sortBy]);

  const [openFilters, setOpenFilters] = useState(false);
  const [selectedBuildingTypes, setSelectedBuildingTypes] = useState<string[]>(
    []
  );
  const [selectedClimates, setSelectedClimates] = useState<string[]>([]);

  const buildingTypes = [
    "Residential",
    "Commercial",
    "Medical",
    "Hospitality",
    "Additional",
    "Remodel",
    "Educational",
  ];

  const climates = ["Hot", "Cold", "Tropical", "Dry"];

  const toggleBuildingType = (type: string) => {
    setSelectedBuildingTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleClimate = (climate: string) => {
    setSelectedClimates((prev) =>
      prev.includes(climate)
        ? prev.filter((c) => c !== climate)
        : [...prev, climate]
    );
  };

  //  const [sortBy, setSortBy] = useState("title");
  const [filterBy, setFilterBy] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filterOptions = [
    "Residential",
    "Commercial",
    "Medical",
    "Hospitality",
    "Additional",
    "Remodel",
    "Educational",
  ];

  const toggleFilter = (option: string) => {
    setSelectedFilters((prev) =>
      prev.includes(option)
        ? prev.filter((f) => f !== option)
        : [...prev, option]
    );
  };
  const [expanded, setExpanded] = useState(false);
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-light mb-6">Our Portfolio</h1>

        {/* search filter, sort option  */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex px-4 py-3 rounded-md border-2 border-red-700 overflow-hidden w-1/2 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 192.904 192.904"
              width="16px"
              className="fill-gray-700 mr-3 rotate-90"
            >
              <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
            </svg>
            <input
              type="email"
              placeholder="Search Something....."
              className="w-full outline-none bg-transparent text-gray-600 text-sm"
            />
          </div>
          {/* sort by  year */}
          <div className="flex px-4 py-3 rounded-md gap-6  overflow-hidden ">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "title" | "year")}
              className="w-full outline-none bg-transparent border cursor-pointer py-3 px-6 rounded text-gray-600 text-sm"
            >
              <option value="title">Sort by Title</option>
              <option value="year">Sort by Year </option>
            </select>
            {/* ---------------  */}

            <div className="flex gap-4 w-full">
              {/* Filter Dropdown */}
              <div className="relative w-full">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="w-full bg-black appearance-none outline-none text-white border cursor-pointer py-3 px-6 pr-10 rounded text-sm"
                >
                  <option value="">Filter</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="medical">Medical</option>
                  <option value="hospitality">Hospitality</option>
                  <option value="additional">Additional</option>
                  <option value="remodel">Remodel</option>
                  <option value="educational">Educational</option>
                </select>

                {/* Filter Icon */}
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-white w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
          {/* filter by category */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-scroll ">
          {filteredAndSortedProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              {/* <Image
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              /> */}
              <Carousel className="mb-4">
                <CarouselContent>
                  <CarouselItem>
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={`image`}
                      width={400}
                      height={300}
                      className="w-full rounded-lg object-cover"
                    />
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-40 -translate-y-1/2 z-10" />
                <CarouselNext className="absolute right-4 top-40 -translate-y-1/2 z-10" />
              </Carousel>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                <p
                  className={`text-gray-600 mb-1 ${
                    expanded ? "" : "line-clamp-2"
                  }`}
                >
                  <strong></strong> {project.description}
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-blue-500 text-sm ml-2 hover:underline"
                  >
                    {expanded ? "Read less" : "Read more"}
                  </button>
                </p>

                <p className="text-sm text-gray-500 mb-2">{project.category}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Year: {project.year}
                </p>
                <div className="flex flex-col md:flex-row gap-3">
                  <Button variant="outline" className="w-full">
                    View Project
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Comments
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
