import { SITE_INFO } from "@/config/site"
import { getBlogPosts } from "@/features/doc/data/documents"

export const revalidate = false
export const dynamic = "force-static"

const FEED_DESCRIPTION =
  "Notes on AI systems, agent runtimes, browser internals, and shipping backends that hold up in production."

/** Post titles and descriptions are author-written but still land inside XML. */
function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

export function GET() {
  const itemsXml = getBlogPosts()
    .map((doc) => {
      const url = `${SITE_INFO.url}/blog/${doc.slug}`

      return `    <item>
      <title>${escapeXml(doc.metadata.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(doc.metadata.description || "")}</description>
      <pubDate>${new Date(doc.metadata.createdAt).toUTCString()}</pubDate>
    </item>`
    })
    .join("\n")

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog | ${escapeXml(SITE_INFO.name)}</title>
    <link>${SITE_INFO.url}/blog</link>
    <atom:link href="${SITE_INFO.url}/blog/rss" rel="self" type="application/rss+xml" />
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en</language>
${itemsXml}
  </channel>
</rss>`

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  })
}
