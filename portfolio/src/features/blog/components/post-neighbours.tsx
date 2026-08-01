import Link from "next/link"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import type { Doc } from "@/features/doc/types/document"

/**
 * Previous/next as two full-width ruled rows rather than a pair of cards. The
 * title is the target, so it gets the size; the direction label is metadata.
 */
export function PostNeighbours({
  previous,
  next,
}: {
  previous: Doc | null
  next: Doc | null
}) {
  if (!previous && !next) return null

  return (
    <nav aria-label="More posts" className="screen-line-bottom">
      {next && (
        <NeighbourRow
          slug={next.slug}
          title={next.metadata.title}
          label="Newer post"
          direction="next"
        />
      )}
      {previous && (
        <NeighbourRow
          slug={previous.slug}
          title={previous.metadata.title}
          label="Older post"
          direction="previous"
        />
      )}
    </nav>
  )
}

function NeighbourRow({
  slug,
  title,
  label,
  direction,
}: {
  slug: string
  title: string
  label: string
  direction: "previous" | "next"
}) {
  const isNext = direction === "next"
  const Icon = isNext ? ArrowRightIcon : ArrowLeftIcon

  return (
    <Link
      href={`/blog/${slug}`}
      className={cn(
        "group/neighbour screen-line-top flex items-center gap-4 px-4 py-5 transition-colors duration-200 ease-out hover:bg-accent-muted",
        isNext && "flex-row-reverse text-right"
      )}
    >
      <Icon
        className={cn(
          "size-4 shrink-0 text-muted-foreground transition-[color,translate] duration-200 ease-out group-hover/neighbour:text-foreground",
          isNext
            ? "motion-safe:group-hover/neighbour:translate-x-0.5"
            : "motion-safe:group-hover/neighbour:-translate-x-0.5"
        )}
      />

      <span className="min-w-0 flex-1">
        <span className="block font-mono text-xs tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="mt-1 block text-base leading-snug font-medium text-pretty transition-colors group-hover/neighbour:text-link">
          {title}
        </span>
      </span>
    </Link>
  )
}
