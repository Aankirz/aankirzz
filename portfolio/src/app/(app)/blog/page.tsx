import { Suspense } from "react"
import type { Metadata } from "next"
import type { Blog, WithContext } from "schema-dts"

import { JSON_LD_ID } from "@/config/json-ld"
import { X_HANDLE } from "@/config/site"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/utils"
import {
  PageHeading,
  PageHeadingDescription,
  PageHeadingTagline,
  PageHeadingTitle,
} from "@/components/page-heading"
import { PostLedger } from "@/features/blog/components/post-ledger"
import { PostListWithSearch } from "@/features/blog/components/post-list-with-search"
import { PostSearchInput } from "@/features/blog/components/post-search-input"
import { PostTagFilter } from "@/features/blog/components/post-tag-filter"
import {
  collectTags,
  toBlogPostSummary,
} from "@/features/blog/lib/post-summary"
import { getBlogPosts } from "@/features/doc/data/documents"

const title = "Blog"
const tagline = "Notes from the systems side of AI."
const description =
  "Agent runtimes, browser internals, and backends that hold up in production."

const ogImage = `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": [{ url: "/blog/rss", title: `${title} RSS feed` }],
    },
  },
  openGraph: {
    url: "/blog",
    type: "website",
    images: {
      url: ogImage,
      width: 1200,
      height: 630,
      alt: title,
    },
  },
  twitter: {
    card: "summary_large_image",
    site: X_HANDLE,
    creator: X_HANDLE,
    images: [ogImage],
  },
}

export default function Page() {
  const posts = getBlogPosts().map(toBlogPostSummary)
  const tags = collectTags(posts)

  return (
    <>
      <JsonLdScript data={getBlogJsonLd(posts)} />

      <JsonLdScript
        data={jsonLdBreadcrumbList([
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
        ])}
      />

      <div className="mx-auto min-h-svh border-x border-line md:max-w-4xl">
        <PageHeading>
          <PageHeadingTagline>Blog</PageHeadingTagline>
          <PageHeadingTitle>{tagline}</PageHeadingTitle>
          <PageHeadingDescription className="font-reading">
            {description}
          </PageHeadingDescription>
        </PageHeading>

        <div className="screen-line-bottom p-2">
          <Suspense
            fallback={
              <div className="flex h-9 w-full rounded-lg border border-input dark:bg-input/30" />
            }
          >
            <PostSearchInput />
          </Suspense>
        </div>

        {tags.length > 0 && (
          <Suspense fallback={<div className="screen-line-bottom h-11" />}>
            <PostTagFilter tags={tags} />
          </Suspense>
        )}

        <Suspense fallback={<PostLedger posts={posts} />}>
          <PostListWithSearch posts={posts} />
        </Suspense>

        <div className="h-16" />
      </div>
    </>
  )
}

function getBlogJsonLd(
  posts: { slug: string; title: string; createdAt: string }[]
): WithContext<Blog> {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": absoluteUrl("/blog"),
    name: title,
    description,
    url: absoluteUrl("/blog"),
    isPartOf: { "@id": JSON_LD_ID.website },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      "@id": absoluteUrl(`/blog/${post.slug}`),
      headline: post.title,
      url: absoluteUrl(`/blog/${post.slug}`),
      datePublished: new Date(post.createdAt).toISOString(),
    })),
  }
}
