import Layout from '@/components/Layout'
import React from 'react'

// Temporary placeholder data (replace with API fetch later)
const dummyArticles = [
  {
    id: 1,
    title: 'Reimagining Public Space in Urban Africa',
    date: '2025-05-12',
    source: 'ArchDaily',
    url: 'https://www.archdaily.com/reimagining-public-space',
    tags: ['Urban', 'Africa', 'Public Space'],
  },
  {
    id: 2,
    title: 'Sustainable Materials in Modern Architecture',
    date: '2025-04-22',
    source: 'Dezeen',
    url: 'https://www.dezeen.com/sustainable-materials-2025',
    tags: ['Sustainability', 'Materials', 'Innovation'],
  },
]

export default function NewsPage() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Architecture News & Publications</h1>

        <div className="space-y-6">
          {dummyArticles.map((article) => (
            <div key={article.id} className="border-b pb-4">
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                  {article.title}
                </h2>
              </a>
              <p className="text-sm text-gray-500">
                Published on {new Date(article.date).toLocaleDateString()} via {article.source}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {article.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-gray-200 text-sm px-2 py-1 rounded-full text-gray-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
