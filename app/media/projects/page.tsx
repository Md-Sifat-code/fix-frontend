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
import { ChevronLeft, ChevronRight, Edit, Send } from "lucide-react";
import dynamic from "next/dynamic";
import { Project } from "@/types/Project";

const MapFilter = dynamic(() => import("@/components/MapFilter"), {
  ssr: false,
});

export default function MediaProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [votes, setVotes] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const storedVotes = localStorage.getItem("projectVotes");
    if (storedVotes) {
      setVotes(JSON.parse(storedVotes));
    }
  }, []);

  const handleVote = (projectId: string) => {
    const key = `voted-${projectId}`;
    const hasVoted = localStorage.getItem(key);

    let updatedVotes = { ...votes };

    if (hasVoted) {
      // User already voted → subtract 1 vote
      updatedVotes[projectId] = Math.max((votes[projectId] || 1) - 1, 0);
      localStorage.removeItem(key); // Optional: allow re-vote
    } else {
      // First time voting → add 1 vote
      updatedVotes[projectId] = (votes[projectId] || 0) + 1;
      localStorage.setItem(key, "true");
    }

    setVotes(updatedVotes);
    localStorage.setItem("projectVotes", JSON.stringify(updatedVotes));
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
        description: "A beautiful villa designed for tropical climate.",
        images: ["https://via.placeholder.com/600x400"],
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
      },
      {
        id: "2",
        name: "Desert House",
        description: "An innovative design for desert climate.",
        images: ["https://via.placeholder.com/600x400"],
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
      },
      // Add more projects here...
    ];
    setProjects(exampleProjects);
  }, []);

  const [sortBy, setSortBy] = useState<"name" | "year" | "continent">("name");
  const [selectedClimate, setSelectedClimate] = useState<string | null>(null);
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

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  const handleEditComment = (
    projectId: string,
    index: number,
    updatedComment: string
  ) => {
    const existing = comments[projectId] || [];
    if (index < 0 || index >= existing.length) return;

    // Copy the project’s comments
    const newCommentsForProject = [...existing];

    if (updatedComment.trim().length === 0) {
      // Empty string → remove the comment
      newCommentsForProject.splice(index, 1);
    } else {
      // Otherwise update it
      newCommentsForProject[index] = updatedComment;
    }

    // If no comments left for this project, drop the key entirely
    const newComments =
      newCommentsForProject.length === 0
        ? Object.fromEntries(
            Object.entries(comments).filter(([id]) => id !== projectId)
          )
        : { ...comments, [projectId]: newCommentsForProject };

    setComments(newComments);
    localStorage.setItem("projectComments", JSON.stringify(newComments));
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
      return (
        climateMatch &&
        styleMatch &&
        buildingTypeMatch &&
        yearMatch &&
        project.approved
      );
    });
  }, [
    selectedClimate,
    selectedStyles,
    selectedBuildingTypes,
    selectedYearRange,
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
        <h1 className="text-3xl font-light mb-6">Featured Projects</h1>

        {/* 🌍 Interactive Map Filter */}
        <MapFilter projects={filteredProjects} />

        {/* Sidebar Filters and Sorting */}
        <div className="mb-8 flex justify-between items-center">
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
        </div>
        <h2 className="text-xl font-bold mb-4">
          🏆 Top 10 Projects of {new Date().getFullYear()}
        </h2>
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

        {/* Project Grid */}
        <p className="text-sm text-gray-500 mb-4">
          Showing {sortedProjects.length} of {filteredProjects.length} projects
        </p>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sortedProjects.map((project) => (
              <Card
                key={project.id}
                className="overflow-hidden cursor-pointer"
                // onClick={() => setSelectedProject(project)}
              >
                <img
                  src={"https://picsum.photos/1280/720"}
                  alt={project.name}
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover"
                />
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap justify-between items-center text-sm text-gray-500 mb-4">
                    <span>{project.location}</span>
                    <span>{project.continent}</span>
                    <span>{project.year}</span>
                    <span>{project.climate}</span>
                    <span>{project.style}</span>
                    <span>{project.buildingType}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* ✅ Voting */}
                  <div className="flex items-center justify-between mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(project.id);
                      }}
                    >
                      👍 Vote ({votes[project.id] || 0})
                    </Button>
                  </div>

                  {/* ✅ Comments Section */}
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-semibold">Comments</h4>
                    <ul className="space-y-1 text-xs">
                      {(comments[project.id] || []).map((cmt, idx) => (
                        <li
                          key={idx}
                          className="bg-secondary p-2 rounded flex justify-between items-center"
                        >
                          {editingIndex === idx ? (
                            <div className="flex items-center gap-2 w-full">
                              <input
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                className="text-xs bg-white text-black rounded p-1 w-full"
                              />
                              <button
                                onClick={() => {
                                  handleEditComment(
                                    project.id,
                                    idx,
                                    editingText
                                  );
                                  setEditingIndex(null);
                                }}
                                className="text-xs text-blue-500"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingIndex(null)}
                                className="text-xs text-red-500"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="relative w-full flex items-center">
                              <span>{cmt}</span>

                              <button
                                onClick={() => {
                                  setEditingIndex(idx);
                                  setEditingText(cmt);
                                }}
                                className="absolute right-0"
                              >
                                <Edit className="size-4" />
                              </button>
                            </div>
                          )}
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
                      <div className="relative pr-10 flex text-center">
                        <input
                          name="comment"
                          placeholder="Add a comment..."
                          className="w-full mr-4 px-2 py-1 text-sm border rounded"
                        />
                        <button
                          type="submit"
                          className="bg-primary text-white p-2 rounded-full flex text-center justify-center absolute top-0 right-0"
                        >
                          <Send className="size-6 " />
                        </button>
                      </div>
                    </form>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
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
