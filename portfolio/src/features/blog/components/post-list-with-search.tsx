"use client"

import { useFilteredPosts, useIsFiltering } from "../hooks/use-filtered-posts"
import type { BlogPostSummary } from "../lib/post-summary"
import { PostLedger } from "./post-ledger"

export function PostListWithSearch({ posts }: { posts: BlogPostSummary[] }) {
  const filteredPosts = useFilteredPosts(posts)
  const isFiltering = useIsFiltering()

  return <PostLedger posts={filteredPosts} showLead={!isFiltering} />
}
