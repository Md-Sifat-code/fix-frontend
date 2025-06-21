import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Layout from "@/components/Layout"

export default function PublicationsPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((publication) => (
            <Card key={publication} className="flex flex-col">
              <Image
                src={`/placeholder.svg?height=200&width=300&text=Publication+${publication}`}
                alt={`Publication ${publication}`}
                width={300}
                height={200}
                className="w-full h-40 object-cover"
              />
              <CardContent className="p-4 flex-grow flex flex-col">
                <h2 className="text-lg font-semibold mb-2">Publication {publication}</h2>
                <p className="text-sm text-gray-500 mb-4 flex-grow">Brief description of Publication {publication}</p>
                <Button variant="outline" className="w-full mt-auto">
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}
