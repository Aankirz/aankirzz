import type { Metadata, Route } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getTableOfContents } from "fumadocs-core/content/toc"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import type { BlogPosting as PageSchema, WithContext } from "schema-dts"

import { JSON_LD_ID } from "@/config/json-ld"
import { X_HANDLE } from "@/config/site"
import { jsonLdBreadcrumbList, JsonLdScript } from "@/lib/json-ld"
import { absoluteUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Prose } from "@/components/ui/typography"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import { MDX } from "@/components/mdx"
import { TOCInline } from "@/components/toc-inline"
import { TOCMinimap } from "@/components/toc-minimap"
import { PostAuthorCard } from "@/features/blog/components/post-author-card"
import { PostEngagementBar } from "@/features/blog/components/post-engagement-bar"
import { PostMetaBar } from "@/features/blog/components/post-meta-bar"
import { PostNeighbours } from "@/features/blog/components/post-neighbours"
import { ReadingProgress } from "@/features/blog/components/reading-progress"
import { readingTimeMinutes } from "@/features/blog/lib/reading-time"
import { DocKeyboardShortcuts } from "@/features/doc/components/doc-keyboard-shortcuts"
import {
  DocContainer,
  DocContentCol,
  DocGrid,
  DocLeftCol,
  DocRightCol,
} from "@/features/doc/components/doc-layout"
import { DocPageRoot } from "@/features/doc/components/doc-page-root"
import { DocShareMenu } from "@/features/doc/components/doc-share-menu"
import {
  findNeighbour,
  getBlogPosts,
  getDocBySlug,
} from "@/features/doc/data/documents"
import type { Doc } from "@/features/doc/types/document"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return getBlogPosts().map((doc) => ({ slug: doc.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const slug = (await params).slug
  const doc = getDocBySlug(slug)

  if (!doc || doc.metadata.category !== "blog") {
    return notFound()
  }

  const { title, description, image, createdAt, updatedAt } = doc.metadata

  const postUrl = `/blog/${doc.slug}`
  const ogImage =
    image ||
    `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

  return {
    title,
    description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      url: postUrl,
      type: "article",
      publishedTime: new Date(createdAt).toISOString(),
      modifiedTime: new Date(updatedAt).toISOString(),
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
}

export default async function Page({ params }: PageProps<"/blog/[slug]">) {
  const slug = (await params).slug
  const doc = getDocBySlug(slug)

  if (!doc || doc.metadata.category !== "blog") {
    notFound()
  }

  const toc = getTableOfContents(doc.content)
  const readingTime = readingTimeMinutes(doc.content)

  const allPosts = getBlogPosts()
  const { previous, next } = findNeighbour(allPosts, slug)

  return (
    <>
      <JsonLdScript data={getPageJsonLd(doc, readingTime)} />

      <JsonLdScript
        data={jsonLdBreadcrumbList([
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: doc.metadata.title, href: `/blog/${slug}` },
        ])}
      />

      <DocKeyboardShortcuts
        previous={previous ? (`/blog/${previous.slug}` as Route) : null}
        next={next ? (`/blog/${next.slug}` as Route) : null}
      />

      <ReadingProgress />

      <DocPageRoot>
        <DocContainer>
          <div className="screen-line-bottom h-px" />

          <div className="flex items-center justify-between p-2 pl-4">
            <Button
              className="h-7 gap-2 border-none px-0 tracking-wider text-muted-foreground hover:text-foreground hover:no-underline"
              variant="link"
              size="sm"
              asChild
            >
              <Link href="/blog">
                <ArrowLeftIcon />
                Blog
              </Link>
            </Button>

            <div className="flex items-center gap-2">
              <DocShareMenu
                title={doc.metadata.title}
                url={`/blog/${doc.slug}`}
              />

              {previous && (
                <NeighbourButton
                  href={`/blog/${previous.slug}`}
                  label="Previous post"
                  icon={<ArrowLeftIcon />}
                />
              )}

              {next && (
                <NeighbourButton
                  href={`/blog/${next.slug}`}
                  label="Next post"
                  icon={<ArrowRightIcon />}
                />
              )}
            </div>
          </div>

          <div className="screen-line-top screen-line-bottom py-px">
            <div className="h-4" />
          </div>

          {doc.metadata.tags && doc.metadata.tags.length > 0 && (
            <ul className="flex flex-wrap gap-x-3 px-4 pb-2 font-mono text-xs text-muted-foreground">
              {doc.metadata.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={{ pathname: "/blog", query: { tag } }}
                    className="link-underline"
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <h1
            data-slot="doc-title"
            className="screen-line-bottom px-4 pb-1 text-[clamp(2rem,1.2rem+3.2vw,3.25rem)] leading-[1.08] font-medium tracking-tight text-balance"
          >
            {doc.metadata.title}
          </h1>

          <PostMetaBar
            createdAt={doc.metadata.createdAt}
            updatedAt={doc.metadata.updatedAt}
            readingTime={readingTime}
          />
        </DocContainer>

        {/* Wider centre column than the docs default so the article body's
            rules line up with the title block above it. */}
        <DocGrid className="lg:grid-cols-[1fr_var(--container-4xl)_1fr]">
          <DocLeftCol />

          <DocContentCol>
            <Prose className="prose-reading max-w-[68ch] px-(--page-padding) pt-8 [--page-padding:--spacing(4)]">
              <p>{doc.metadata.description}</p>

              <TOCInline className="lg:hidden" items={toc} />

              <div>
                <MDX code={doc.content} />
              </div>
            </Prose>

            <div className="h-10" />

            <PostEngagementBar slug={doc.slug} />
            <PostAuthorCard />
            <PostNeighbours previous={previous} next={next} />

            <div className="h-16" />
          </DocContentCol>

          <DocRightCol>
            <div className="sticky top-[calc(var(--doc-cols-top,0)+(--spacing(3)))] translate-x-2 opacity-0 in-data-doc-cols-ready:opacity-100">
              <TOCMinimap items={toc} />
            </div>
          </DocRightCol>
        </DocGrid>
      </DocPageRoot>
    </>
  )
}

function NeighbourButton({
  href,
  label,
  icon,
}: {
  href: string
  label: string
  icon: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            className="size-7 border-none"
            variant="secondary"
            size="icon-sm"
            asChild
          >
            <Link href={href} aria-label={label}>
              {icon}
            </Link>
          </Button>
        }
      />
      <TooltipContent className="pr-2 pl-3">
        <div className="flex items-center gap-3">
          {label}
          <Kbd>{icon}</Kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

function getPageJsonLd(doc: Doc, readingTime: number): WithContext<PageSchema> {
  const postUrl = `/blog/${doc.slug}`

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": absoluteUrl(postUrl),
    headline: doc.metadata.title,
    description: doc.metadata.description,
    image:
      doc.metadata.image ||
      absoluteUrl(
        `/og/simple?title=${encodeURIComponent(doc.metadata.title)}&description=${encodeURIComponent(doc.metadata.description)}`
      ),
    url: absoluteUrl(postUrl),
    datePublished: new Date(doc.metadata.createdAt).toISOString(),
    dateModified: new Date(doc.metadata.updatedAt).toISOString(),
    keywords: doc.metadata.tags?.join(", "),
    timeRequired: `PT${readingTime}M`,
    author: { "@id": JSON_LD_ID.person },
    mainEntityOfPage: absoluteUrl(postUrl),
    isPartOf: {
      "@type": "Blog",
      "@id": absoluteUrl("/blog"),
      name: "Blog",
      url: absoluteUrl("/blog"),
    },
  }
}
