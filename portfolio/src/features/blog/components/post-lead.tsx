import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"

import type { BlogPostSummary } from "../lib/post-summary"

/**
 * The one post that gets scale. Everything below it is a ledger row, so this is
 * where the index gets its hierarchy: type roughly double the row size, and the
 * cover image shown rather than thumbnailed.
 */
export function PostLead({ post }: { post: BlogPostSummary }) {
  return (
    <article className="group/lead screen-line-bottom relative">
      <Link
        href={`/blog/${post.slug}`}
        className="block px-4 pt-6 pb-8 transition-colors duration-200 ease-out hover:bg-accent-muted"
      >
        <p className="font-mono text-xs tracking-wider text-link">
          {post.pinned ? "Pinned" : "Latest"}
        </p>

        <h2 className="mt-3 max-w-[20ch] text-3xl leading-[1.1] font-medium tracking-tight text-balance sm:text-4xl md:text-5xl">
          {post.title}
        </h2>

        {post.description && (
          <p className="mt-4 max-w-[52ch] font-reading text-base/relaxed text-pretty text-muted-foreground">
            {post.description}
          </p>
        )}

        <dl className="mt-5 flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <dt className="sr-only">Published</dt>
          <dd>
            <time dateTime={new Date(post.createdAt).toISOString()}>
              {format(new Date(post.createdAt), "dd.MM.yyyy")}
            </time>
          </dd>
          <span aria-hidden>·</span>
          <dt className="sr-only">Reading time</dt>
          <dd>{post.readingTime} min read</dd>
        </dl>

        {post.image && (
          <div className="relative mt-6 select-none">
            <Image
              className="aspect-1200/630 w-full rounded-xl object-cover grayscale transition-[filter] duration-500 ease-out group-hover/lead:grayscale-0"
              src={post.image}
              alt=""
              width={1200}
              height={630}
              priority
              unoptimized
            />
            <div className="pointer-events-none absolute inset-0 rounded-xl inset-ring-1 inset-ring-black/15 dark:inset-ring-white/15" />
          </div>
        )}
      </Link>
    </article>
  )
}
