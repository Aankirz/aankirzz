import Image from "next/image"
import { format } from "date-fns"

import { USER } from "@/features/portfolio/data/user"

/**
 * Byline strip between the title and the body. One ruled line carrying author,
 * date, and reading time, so a reader can decide whether to commit before
 * scrolling.
 */
export function PostMetaBar({
  createdAt,
  updatedAt,
  readingTime,
}: {
  createdAt: string
  updatedAt: string
  readingTime: number
}) {
  const published = new Date(createdAt)
  const updated = new Date(updatedAt)
  const wasUpdated = updated.getTime() > published.getTime()

  return (
    <div className="screen-line-bottom flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3">
      <Image
        className="size-6 shrink-0 rounded-full object-cover"
        src={USER.avatar}
        alt=""
        width={48}
        height={48}
      />

      <span className="text-sm font-medium">{USER.displayName}</span>

      <dl className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground">
        <span aria-hidden>·</span>

        <dt className="sr-only">Published</dt>
        <dd>
          <time dateTime={published.toISOString()}>
            {format(published, "d MMM yyyy")}
          </time>
        </dd>

        <span aria-hidden>·</span>

        <dt className="sr-only">Reading time</dt>
        <dd>{readingTime} min read</dd>

        {wasUpdated && (
          <>
            <span aria-hidden>·</span>
            <dt className="sr-only">Last updated</dt>
            <dd>
              Updated{" "}
              <time dateTime={updated.toISOString()}>
                {format(updated, "d MMM yyyy")}
              </time>
            </dd>
          </>
        )}
      </dl>
    </div>
  )
}
