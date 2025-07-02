"use client";

import Dashboard from "@/components/Dashboard";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <ProjectProvider>
      <Suspense>
        <Dashboard />
      </Suspense>
    </ProjectProvider>
  );
}
