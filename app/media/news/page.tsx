import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Layout from "@/components/Layout";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
}

const topStories: NewsItem[] = [
  {
    id: 1,
    title: "Revolutionary Sustainable Skyscraper Unveiled in New York",
    excerpt:
      "A groundbreaking design that could reshape urban living and combat climate change.",
    image: "https://picsum.photos/1280/720",
    category: "Sustainable Design",
    date: "2023-06-15",
  },
  {
    id: 2,
    title: "Ancient Roman Aqueduct Discovered During Metro Construction",
    excerpt:
      "Archaeologists uncover a well-preserved section of a 2,000-year-old aqueduct in Rome.",
    image: "https://picsum.photos/1280/720",
    category: "Architectural History",
    date: "2023-06-14",
  },
];

const latestNews: NewsItem[] = [
  {
    id: 3,
    title: "AI-Powered Design Tools Revolutionize Architectural Planning",
    excerpt:
      "New software promises to streamline the design process and enhance creativity.",
    image: "https://picsum.photos/1280/720",
    category: "Technology",
    date: "2023-06-13",
  },
  {
    id: 4,
    title: "World's Largest 3D-Printed Building Completed in Dubai",
    excerpt:
      "The structure showcases the potential of additive manufacturing in construction.",
    image: "https://picsum.photos/1280/720",
    category: "Innovation",
    date: "2023-06-12",
  },
  {
    id: 5,
    title: "Frank Gehry's Latest Museum Opens to Critical Acclaim",
    excerpt:
      "The renowned architect's newest creation is hailed as a masterpiece of deconstructivism.",
    image: "https://picsum.photos/1280/720",
    category: "Contemporary Architecture",
    date: "2023-06-11",
  },
];

const featuredArticles: NewsItem[] = [
  {
    id: 6,
    title: "The Rise of Biophilic Design in Modern Architecture",
    excerpt:
      "How architects are incorporating nature into urban spaces for better well-being.",
    image: "https://picsum.photos/1280/720",
    category: "Design Trends",
    date: "2023-06-10",
  },
  {
    id: 7,
    title: "Preserving Brutalist Architecture: A Controversial Debate",
    excerpt:
      "Cities grapple with the cultural value of Brutalist buildings amid calls for demolition.",
    image: "https://picsum.photos/1280/720",
    category: "Architectural Preservation",
    date: "2023-06-09",
  },
];

export default function NewsPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Architecture News</h1>

        {/* Top Stories */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Top Stories</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {topStories.map((story) => (
              <Card key={story.id} className="overflow-hidden">
                <Image
                  src={"https://picsum.photos/1280/720"}
                  alt={story.title}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle className="text-xl">{story.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-600 font-semibold mb-2">
                    {story.category}
                  </p>
                  <p className="text-gray-600">{story.excerpt}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{story.date}</span>
                  <Button variant="outline">Read More</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Latest News and Featured Articles */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Latest News */}
          <section className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Latest News</h2>
            <div className="space-y-6">
              {latestNews.map((news) => (
                <Card key={news.id} className="overflow-hidden">
                  <div className="md:flex">
                    <Image
                      src={"https://picsum.photos/1280/720"}
                      alt={news.title}
                      width={300}
                      height={200}
                      className="w-full md:w-1/3 h-48 md:h-auto object-cover"
                    />
                    <div className="p-4 md:w-2/3">
                      <p className="text-sm text-blue-600 font-semibold mb-2">
                        {news.category}
                      </p>
                      <h3 className="text-lg font-bold mb-2">{news.title}</h3>
                      <p className="text-gray-600 mb-4">{news.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {news.date}
                        </span>
                        <Button variant="outline" size="sm">
                          Read More
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Featured Articles */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Featured Articles</h2>
            <div className="space-y-6">
              {featuredArticles.map((article) => (
                <Card key={article.id} className="overflow-hidden">
                  <Image
                    src={"https://picsum.photos/1280/720"}
                    alt={article.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-4">
                    <p className="text-sm text-blue-600 font-semibold mb-2">
                      {article.category}
                    </p>
                    <h3 className="text-lg font-bold mb-2">{article.title}</h3>
                    <p className="text-gray-600 mb-4">{article.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {article.date}
                      </span>
                      <Button variant="outline" size="sm">
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
