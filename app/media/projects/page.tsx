"use client";

import React, { useState, useMemo, useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Layout from "@/components/Layout";
import { SidebarFilter } from "@/components/SidebarFilter";
import { Badge } from "@/components/ui/badge";
import { ProjectDetails } from "@/components/ProjectDetails";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import dynamic from "next/dynamic";
import { Project } from "@/types/Project";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const MapFilter = dynamic(() => import("@/components/MapFilter"), {
  ssr: false,
});

export default function MediaProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [votes, setVotes] = useState<{ [key: string]: number }>({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedVotes = localStorage.getItem("projectVotes");
    if (storedVotes) {
      setVotes(JSON.parse(storedVotes));
    }
  }, []);

  const handleVote = (projectId: string) => {
    const key = `voted-${projectId}`;
    if (localStorage.getItem(key)) return; // already voted

    const newVotes = { ...votes, [projectId]: (votes[projectId] || 0) + 1 };
    setVotes(newVotes);
    localStorage.setItem("projectVotes", JSON.stringify(newVotes));
    localStorage.setItem(key, "true");
  };
  const [comments, setComments] = useState<{ [key: string]: string[] }>({});

  const handleAddComment = (projectId: string, comment: string) => {
    const existing = comments[projectId] || [];
    const updated = [...existing, comment];
    setComments({ ...comments, [projectId]: updated });

    localStorage.setItem(
      "projectComments",
      JSON.stringify({ ...comments, [projectId]: updated })
    );
  };

  useEffect(() => {
    const stored = localStorage.getItem("projectComments");
    if (stored) {
      setComments(JSON.parse(stored));
    }
  }, []);

  // Example dummy projects - replace with your actual data or fetch
  useEffect(() => {
    const exampleProjects: Project[] = [
      {
        id: "1",
        name: "Tropical Villa",
        description: "A beautiful villa designed for tropical climate. ",
        images: [
          "https://res.cloudinary.com/dy0b6hvog/image/upload/v1755015665/istockphoto-2179523209-2048x2048_a6ytef.jpg",
        ],
        location: "Phuket",
        continent: "Asia",
        year: 2022,
        climate: "Tropical",
        style: "Modern",
        buildingType: "Villa",
        tags: ["luxury", "eco-friendly"],
        approved: true,
        title: "Tropical Villa Project",
        country: "Thailand",
        type: "Residential",
        stage: "completed",
        lat: 7.8804,
        lng: 98.3923,
        Photographer: "jonas tom",
      },
      {
        id: "2",
        name: "Desert House",
        description: "An innovative design for desert climate. ",
        images: [
          "https://res.cloudinary.com/dy0b6hvog/image/upload/v1755015665/istockphoto-2179523209-2048x2048_a6ytef.jpg",
        ],
        location: "Phoenix",
        continent: "North America",
        year: 2019,
        climate: "Desert",
        style: "Minimalist",
        buildingType: "House",
        tags: ["solar-powered"],
        approved: true,
        title: "Desert House",
        country: "USA",
        type: "Residential",
        stage: "completed",
        lat: 33.4484,
        lng: -112.074,
        Photographer: "cupper tom",
      },
      // Add more projects here...
    ];
    setProjects(exampleProjects);
  }, []);

  const [sortBy, setSortBy] = useState<"name" | "year" | "continent">("name");
  const [selectedClimate, setSelectedClimate] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedBuildingTypes, setSelectedBuildingTypes] = useState<string[]>(
    []
  );
  const [selectedYearRange, setSelectedYearRange] = useState<[number, number]>([
    1900,
    new Date().getFullYear(),
  ]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  const climates = useMemo(
    () => Array.from(new Set(projects.map((p) => p.climate))),
    [projects]
  );
  const allStyles = useMemo(
    () => Array.from(new Set(projects.map((p) => p.style))),
    [projects]
  );

  const handleClimateChange = (climate: string | null) => {
    setSelectedClimate(selectedClimate === climate ? null : climate);
  };

  const handleStyleChange = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handleBuildingTypeChange = (type: string) => {
    setSelectedBuildingTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleYearRangeChange = (range: [number, number]) => {
    setSelectedYearRange(range);
  };

const filteredProjects = useMemo(() => {
  return projects.filter((project) => {
    const climateMatch =
      !selectedClimate || project.climate === selectedClimate;
    const styleMatch =
      selectedStyles.length === 0 || selectedStyles.includes(project.style);
    const buildingTypeMatch =
      selectedBuildingTypes.length === 0 ||
      selectedBuildingTypes.includes(project.buildingType);
    const yearMatch =
      project.year >= selectedYearRange[0] &&
      project.year <= selectedYearRange[1];

    const searchMatch =
      searchQuery.trim() === "" ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      climateMatch &&
      styleMatch &&
      buildingTypeMatch &&
      yearMatch &&
      searchMatch && // <-- include this
      project.approved
    );
  });
}, [
  selectedClimate,
  selectedStyles,
  selectedBuildingTypes,
  selectedYearRange,
  searchQuery, // <-- dependency added
  projects,
]);


  const sortedProjects = useMemo(() => {
    const sorted = [...filteredProjects].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "year") return b.year - a.year;
      return a.continent.localeCompare(b.continent);
    });
    const startIndex = (currentPage - 1) * projectsPerPage;
    return sorted.slice(startIndex, startIndex + projectsPerPage);
  }, [filteredProjects, sortBy, currentPage]);

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const currentYear = new Date().getFullYear();

  const topProjects = useMemo(() => {
    const thisYearProjects = projects.filter((p) => p.year === currentYear);
    return thisYearProjects
      .sort((a, b) => (votes[b.id] || 0) - (votes[a.id] || 0))
      .slice(0, 10);
  }, [projects, votes]);
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex  flex-coll flex-row justify-between mb-4 ">
          <h1 className="text-3xl font-light ">Featured Projects</h1>
          <div className="flex px-4 py-3 rounded-md border-2 border-[#CC3F3A] overflow-hidden w-1/3">
            <Search className="text-[#CC3F3A] mr-3 rotate-90" size={16} />
            <input
              type="text"
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full outline-none bg-transparent text-[#CC3F3A] placeholder-[#CC3F3A] text-lg"
            />
          </div>
        </div>

        {/* 🌍 Interactive Map Filter */}
        <MapFilter projects={filteredProjects} />

        {/* Sidebar Filters and Sorting */}
        <div className="mb-8  flex justify-end items-start gap-4  ">
          <div className="mb-4">
            <Select
              value={sortBy}
              onValueChange={(value: "name" | "year" | "continent") =>
                setSortBy(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="year">Sort by Year</SelectItem>
                <SelectItem value="continent">Sort by Continent</SelectItem>
              </SelectContent>
            </Select>
            <div className=" mt-4 flex justify-end">
              <SidebarFilter
                climates={climates}
                selectedClimate={selectedClimate}
                handleClimateChange={handleClimateChange}
                selectedStyles={selectedStyles}
                handleStyleChange={handleStyleChange}
                allStyles={allStyles}
                buildingTypes={Array.from(
                  new Set(projects.map((p) => p.buildingType))
                )}
                selectedBuildingTypes={selectedBuildingTypes}
                handleBuildingTypeChange={handleBuildingTypeChange}
                yearRange={[
                  Math.min(...projects.map((p) => p.year)),
                  Math.max(...projects.map((p) => p.year)),
                ]}
                selectedYearRange={selectedYearRange}
                handleYearRangeChange={handleYearRangeChange}
                projects={projects}
              />
            </div>
          </div>
        </div>
        {/* <h2 className="text-xl font-bold mb-4">
          🏆 Top 10 Projects of {new Date().getFullYear()}
        </h2> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {topProjects.map((project) => (
            <div key={project.id} className="border rounded p-4">
              <h3 className="text-md font-semibold">{project.name}</h3>
              <p className="text-sm text-muted">
                Votes: {votes[project.id] || 0}
              </p>
            </div>
          ))}
        </div>
        <div className="mb-6 ">
          <button className="px-6 py-3  bg-white border-2 mr-4 text-black text-xl font-bold border-black hover:bg-black hover:text-white rounded-lg">
            Top 10
          </button>
          <button className="px-6 py-3  bg-white border-2 text-black text-xl font-bold border-black hover:bg-black hover:text-white rounded-lg">
            All Projects
          </button>
        </div>
        {/* Project Grid */}
        <p className="text-sm text-gray-500 mb-4">
          Showing {sortedProjects.length} of {filteredProjects.length} projects
        </p>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
            {sortedProjects.map((project) => (
              <Card
                key={project.id}
                className="overflow-hidden cursor-pointer "
                onClick={() => setSelectedProject(project)}
              >
                {/* <img
                  src={project.images[0] || "/placeholder.svg"}
                  alt={project.name}
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover"
                /> */}
                <div className="w-full bg-pink-700">
                  <Carousel className="mb-4 w-full">
                    <CarouselContent>
                      {project.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`image`}
                            width={400}
                            height={300}
                            className="w-full h-full rounded-lg object-cover"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-4 top-40 -translate-y-1/2 z-10" />
                    <CarouselNext className="absolute -right-72 top-40 -translate-y-1/2 z-10" />
                  </Carousel>
                </div>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2">
                    {project.name} kk
                  </h2>
                  <p
                    className={`text-gray-600 mb-1 ${
                      expanded ? "" : "truncate"
                    }`}
                  >
                    <strong>Architect:</strong> {project.description}{" "}
                    <span>
                      {" "}
                      <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-blue-500 text-sm mb-2 hover:underline"
                      >
                        {expanded ? "Read less" : "Read more"}
                      </button>
                    </span>
                  </p>

                  <div className=" text-sm text-gray-500 mb-4">
                    <h2>Photographer :{project.Photographer}</h2>
                    <div>
                      {/* <h2>{project.location}</h2>
                    <h2>{project.continent}</h2>
                    <h2>{project.year}</h2>
                    <h2>{project.climate}</h2>
                    <h2>{project.style}</h2>
                    <h2>{project.buildingType}</h2> */}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                    <button className="px-6 bg-[#E6E8EB] rounded-full text-semibold">
                      See All Tags
                    </button>
                  </div>

                  {/* ✅ Voting */}
                  <div className="  mt-2">
                    <Button
                      variant="outline"
                      className="mr-4"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(project.id);
                      }}
                    >
                      👍 Vote ({votes[project.id] || 0})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(project.id);
                      }}
                    >
                      👍 View Comments ({votes[project.id] || 0})
                    </Button>
                  </div>

                  {/* ✅ Comments Section */}
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-semibold">Comments</h4>
                    <ul className="space-y-1 text-xs">
                      {(comments[project.id] || []).map((cmt, idx) => (
                        <li key={idx} className="bg-secondary p-2 rounded">
                          {cmt}
                        </li>
                      ))}
                    </ul>

                    <form
                      onClick={(e) => e.stopPropagation()}
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const input = form.elements.namedItem(
                          "comment"
                        ) as HTMLInputElement;
                        const value = input.value.trim();
                        if (value) {
                          handleAddComment(project.id, value);
                          input.value = "";
                        }
                      }}
                    >
                      <input
                        name="comment"
                        placeholder="Add a comment..."
                        className="w-full px-2 py-1 text-sm border rounded"
                      />
                    </form>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2 ">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetails
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </Layout>
  );
}
