import { getProjectById } from "@/lib/api";
import ProjectReviewPage, { Project } from "@/components/ProjectReviewPage";

export default async function ActiveProjectPage() {
  const project = await getProjectById();

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <ProjectReviewPage project={project} />
    </div>
  );
}
