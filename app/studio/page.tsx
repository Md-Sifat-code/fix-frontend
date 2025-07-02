"use client";

import Dashboard from "@/components/Dashboard";
import { Suspense } from "react";

export default function StudioPage() {
  return (
    <Suspense>
      <Dashboard />
    </Suspense>
  );
}
