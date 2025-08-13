import Dashboard from "@/components/Dashboard"
import { Suspense } from "react"

export default function StudioPage() {
  return(
    <>
   <Suspense fallback={<div>Loading...</div>}>
    <Dashboard />
    </Suspense>
  </>
)

}
