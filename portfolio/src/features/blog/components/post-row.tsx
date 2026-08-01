import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"

import type { BlogPostSummary } from "../lib/post-summary"

/**
 * One ledger line. The mono rail on the left carries index and date so the
 * titles stay flush on a single optical column down the whole archive.
 */
export function PostRow({
  post,
  index,
}: {
  post: BlogPostSummary
  index: number
}) {
  return (
    <li className="group/row screen-line-bottom relative">
      <Link
        href={`/blog/${post.slug}`}
        className="grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1 px-4 py-4 transition-colors duration-200 ease-out hover:bg-accent-muted sm:grid-cols-[5.5rem_1fr_auto] sm:gap-x-6"
      >
        <dl className="col-start-1 row-start-2 flex items-center gap-2 font-mono text-xs text-muted-foreground tabular-nums sm:row-start-1 sm:flex-col sm:items-start sm:gap-0.5 sm:pt-1">
          <dt className="sr-only">Entry</dt>
          <dd className="text-muted-foreground/60">
            {String(index).padStart(2, "0")}
          </dd>
          <span className="sm:hidden" aria-hidden>
            ·
          </span>
          <dt className="sr-only">Published</dt>
          <dd>
            <time dateTime={new Date(post.createdAt).toISOString()}>
              {format(new Date(post.createdAt), "dd.MM.yy")}
            </time>
          </dd>
          <span className="sm:hidden" aria-hidden>
            ·
          </span>
          <dt className="sr-only">Reading time</dt>
          <dd className="sm:hidden">{post.readingTime} min</dd>
        </dl>

        <div className="col-start-1 row-start-1 min-w-0 sm:col-start-2">
          <h3 className="text-lg leading-snug font-medium text-pretty transition-colors group-hover/row:text-link">
            {post.title}
            {post.isNew && (
              <span className="ml-2 inline-block size-1.5 -translate-y-0.5 rounded-full bg-link align-middle">
                <span className="sr-only">New</span>
              </span>
            )}
          </h3>

          {post.description && (
            <p className="mt-1 line-clamp-2 max-w-[62ch] font-reading text-sm/relaxed text-pretty text-muted-foreground">
              {post.description}
            </p>
          )}

          {post.tags.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-x-3 font-mono text-[0.6875rem] text-muted-foreground/70">
              {post.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="col-start-2 row-start-1 flex items-start gap-4 sm:col-start-3">
          <span className="hidden pt-1.5 font-mono text-xs whitespace-nowrap text-muted-foreground tabular-nums sm:inline">
            {post.readingTime} min
          </span>

          {post.image && (
            <div className="relative hidden w-24 shrink-0 select-none md:block">
              <Image
                className="aspect-1200/630 w-full rounded-md object-cover grayscale transition-[filter] duration-400 ease-out group-hover/row:grayscale-0"
                src={post.image}
                alt=""
                width={240}
                height={126}
                loading="lazy"
                unoptimized
              />
              <div className="pointer-events-none absolute inset-0 rounded-md inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15" />
            </div>
          )}
        </div>
      </Link>
    </li>
  )
}
