import type { Doc } from "@/features/doc/types/document"

import { readingTimeMinutes } from "./reading-time"

/**
 * Index-page view of a post. Deliberately excludes `content`: the search and
 * tag filters are client components, and shipping every post's full MDX body to
 * the browser to filter on title alone is a large, invisible bundle cost.
 */
export type BlogPostSummary = {
  slug: string
  title: string
  description: string
  image?: string
  tags: string[]
  createdAt: string
  readingTime: number
  isNew: boolean
  pinned: boolean
}

export function toBlogPostSummary(doc: Doc): BlogPostSummary {
  const { title, description, image, tags, createdAt } = doc.metadata

  return {
    slug: doc.slug,
    title,
    description,
    image,
    tags: tags ?? [],
    createdAt,
    readingTime: readingTimeMinutes(doc.content),
    isNew: Boolean(doc.metadata.new),
    pinned: Boolean(doc.metadata.pinned),
  }
}

/** Every tag across the archive, most-used first, then alphabetical. */
export function collectTags(posts: BlogPostSummary[]): string[] {
  const counts = new Map<string, number>()

  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }

  return [...counts.entries()]
    .sort(([aTag, aCount], [bTag, bCount]) =>
      bCount === aCount ? aTag.localeCompare(bTag) : bCount - aCount
    )
    .map(([tag]) => tag)
}

/**
 * Groups posts into year buckets in the order they arrive, so the caller's sort
 * (pinned first, then newest) survives. Pinned posts are pulled out of year
 * grouping by the caller before this runs.
 */
export function groupByYear(
  posts: BlogPostSummary[]
): { year: number; posts: BlogPostSummary[] }[] {
  const groups: { year: number; posts: BlogPostSummary[] }[] = []

  for (const post of posts) {
    const year = new Date(post.createdAt).getFullYear()
    const last = groups.at(-1)

    if (last?.year === year) {
      last.posts.push(post)
    } else {
      groups.push({ year, posts: [post] })
    }
  }

  return groups
}
