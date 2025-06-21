import { getProjectById } from "@/lib/api"
import ProjectReviewPage from "@/components/ProjectReviewPage"

export default async function ActiveProjectPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id)

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <ProjectReviewPage project={project} />
    </div>
  )
}
