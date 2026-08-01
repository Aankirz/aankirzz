import type { MetadataRoute } from "next"

import { SITE_INFO } from "@/config/site"
import { getBlogPosts } from "@/features/doc/data/documents"

export const revalidate = false
export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_INFO.url,
      lastModified: new Date().toISOString(),
      priority: 1,
    },
    {
      url: `${SITE_INFO.url}/blog`,
      lastModified: new Date().toISOString(),
      priority: 0.8,
    },
    ...getBlogPosts().map((post) => ({
      url: `${SITE_INFO.url}/blog/${post.slug}`,
      lastModified: new Date(
        post.metadata.updatedAt || post.metadata.createdAt
      ).toISOString(),
      priority: 0.6,
    })),
  ]
}
