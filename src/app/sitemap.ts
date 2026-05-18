import type { MetadataRoute } from 'next'
import { lessons } from '@/lib/data/lessons'

export default function sitemap(): MetadataRoute.Sitemap {
  const lessonPages = lessons.map((lesson) => ({
    url: `https://sqlcraker.com/lessons/${lesson.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: 'https://sqlcraker.com', lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: 'https://sqlcraker.com/lessons', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://sqlcraker.com/playground', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ...lessonPages,
  ]
}
