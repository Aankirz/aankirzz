import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/base/ui/button"
import { PostRow } from "@/features/blog/components/post-row"
import { toBlogPostSummary } from "@/features/blog/lib/post-summary"
import { getBlogPosts } from "@/features/doc/data/documents"
import {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
} from "@/features/portfolio/components/panel"
import { PanelTitleCopy } from "@/features/portfolio/components/panel-title-copy"

const ID = "blog"
const PREVIEW_COUNT = 4

/** The portfolio's window onto the blog. Same ledger rows as /blog, truncated. */
export function Blog() {
  const allPosts = getBlogPosts()

  if (allPosts.length === 0) return null

  const preview = allPosts.slice(0, PREVIEW_COUNT).map(toBlogPostSummary)

  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Blog</a>
          <PanelTitleSup>({allPosts.length})</PanelTitleSup>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <ul>
        {preview.map((post, index) => (
          <PostRow
            key={post.slug}
            post={post}
            index={allPosts.length - index}
          />
        ))}
      </ul>

      <div className="flex justify-center py-2">
        <Button
          className="gap-2 pr-2.5 pl-3"
          variant="secondary"
          size="sm"
          nativeButton={false}
          render={<Link href="/blog" />}
        >
          All posts
          <ArrowRightIcon />
        </Button>
      </div>
    </Panel>
  )
}
