// This is a mock function. In a real application, you would fetch this data from your backend.
export async function getProjectById(id: string) {
  // Mock data
  return {
    id,
    name: "Active Project 1",
    clientName: "Acme Corporation",
    projectType: "Commercial",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    description:
      "This is a sample active project for Acme Corporation. It involves designing and constructing a new office building.",
    googleDriveLink: "https://drive.google.com/drive/folders/example",
    objectives: [
      {
        id: "obj1",
        name: "Design Phase",
        tasks: [
          { id: "task1", name: "Create initial sketches" },
          { id: "task2", name: "Develop 3D models" },
        ],
      },
      {
        id: "obj2",
        name: "Construction Phase",
        tasks: [
          { id: "task3", name: "Prepare construction site" },
          { id: "task4", name: "Begin foundation work" },
        ],
      },
    ],
    teamMembers: [
      { id: "mem1", name: "John Doe" },
      { id: "mem2", name: "Jane Smith" },
      { id: "mem3", name: "Bob Johnson" },
    ],
  }
}
