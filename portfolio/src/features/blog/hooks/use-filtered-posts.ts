import { useMemo } from "react"

import type { BlogPostSummary } from "../lib/post-summary"
import { useSearchQuery, useTagQuery } from "./use-search-query"

const normalize = (text: string) => text.toLowerCase().replaceAll(" ", "")

const matchesQuery = (post: BlogPostSummary, normalizedQuery: string) =>
  normalize(post.title).includes(normalizedQuery) ||
  normalize(post.description).includes(normalizedQuery) ||
  post.tags.some((tag) => normalize(tag).includes(normalizedQuery))

export function useFilteredPosts(posts: BlogPostSummary[]) {
  const { query } = useSearchQuery()
  const { tag } = useTagQuery()

  return useMemo(() => {
    const byTag = tag ? posts.filter((post) => post.tags.includes(tag)) : posts

    if (!query) return byTag

    const normalizedQuery = normalize(query)
    return byTag.filter((post) => matchesQuery(post, normalizedQuery))
  }, [posts, query, tag])
}

/** True when any filter is narrowing the archive. */
export function useIsFiltering() {
  const { query } = useSearchQuery()
  const { tag } = useTagQuery()

  return Boolean(query || tag)
}
