import Layout from "@/components/Layout"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function MediaDashboardPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Media Dashboard</h1>
        <p className="mb-4">Welcome to the Media Dashboard. Here you can manage all your media content.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/media/projects">
            <Button className="w-full">Projects</Button>
          </Link>
          <Link href="/media/news">
            <Button className="w-full">News</Button>
          </Link>
          <Link href="/media/publications">
            <Button className="w-full">Publications</Button>
          </Link>
        </div>
      </div>
    </Layout>
  )
}
