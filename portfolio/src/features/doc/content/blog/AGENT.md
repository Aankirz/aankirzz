# Blog publishing guide

How to add a post to `/blog`. Read this before writing any file in this folder.

Modelled on the pipeline in the Simbian marketing site, trimmed to what a
single-author blog actually needs. Two things carried over: a **closed tag set**
and a **hard-gate validator**. Two things deliberately left out: the markdown
precompiler (posts here are already read once at build time and rendered as
static pages, so a compile step buys nothing) and `authors.json` (one author).

---

## The pipeline

```
write .mdx  →  validate  →  build  →  static page + RSS + sitemap + OG image
```

Nothing is fetched at request time. Adding a post means adding a file and
rebuilding. There is no CMS, no database, and no publish button.

---

## 1. Create the file

Path: `src/features/doc/content/blog/<slug>.mdx`

**The filename is the slug and the URL.** `agent-runtime-isolation.mdx` becomes
`/blog/agent-runtime-isolation`. Lowercase, digits, hyphens. No dates, no
numbering, no underscores.

Choose the slug for what someone would search, not for the headline. Slugs are
permanent: renaming one breaks every existing link to it.

## 2. Frontmatter

```yaml
---
title: What a multi-tenant agent runtime has to guarantee
description: Isolation is not a feature you add later. The invariants I wish someone had handed me on day one.
tags: ["agents", "systems"]
image: /blog/agent-runtime.jpg
createdAt: "2026-08-02"
updatedAt: "2026-08-02"
---
```

| Field         | Required | Notes                                                        |
| ------------- | -------- | ------------------------------------------------------------ |
| `title`       | yes      | Under 80 chars. Sentence case. No trailing period.            |
| `description` | yes      | Under 200 chars. One sentence. Shown in the index, OG, and search results. |
| `createdAt`   | yes      | `YYYY-MM-DD`, quoted. Drives sort order and the year grouping. |
| `updatedAt`   | yes      | `YYYY-MM-DD`, quoted. Same as `createdAt` on first publish.    |
| `tags`        | no       | Inline array. **Must** come from the canonical list below.     |
| `image`       | no       | Absolute URL or a path under `/public`. 1200x630. Shown in the lead slot and as the OG card. |
| `new`         | no       | `true` shows an accent dot in the index. Remove it after a week or two. |
| `pinned`      | no       | `true` forces the post into the lead slot above the newest.   |

### Canonical tags

```
agents · ai · browsers · chromium · systems · backend · performance · career · meta
```

Every distinct tag becomes a filter chip on `/blog`, so the set stays closed.
Adding a tag is a deliberate edit to `CANONICAL_TAGS` in
`src/scripts/validate-blog-frontmatter.mjs`, not something to do in passing.

Get the live list any time:

```bash
node src/scripts/validate-blog-frontmatter.mjs --list-tags
```

## 3. Write the body

- **Do not repeat the title as an `# h1`.** The page renders the title from
  frontmatter. Start at `##`.
- **Do not restate the description in the opening line.** It is already rendered
  above the body as the lead paragraph.
- Headings in sentence case.
- No emojis, in prose or in headings.
- No em dashes. Use commas, colons, semicolons, periods, or parentheses.
- Body copy renders in Literata at 18px with a 68ch measure. Long paragraphs are
  fine; walls of eight-plus lines are not.
- Fenced code blocks get syntax highlighting from the language tag. Always set
  one.

Available MDX components (already in scope, no imports needed): `Callout`,
`CodeTabs`, `ComponentPreview`, `FramedImage`, `YouTubeEmbed`, `IframeEmbed`.

Reading time is computed from the body, with code blocks and JSX stripped out.
Do not set it by hand; there is no field for it.

## 4. Validate

**This is the gate. Run it before claiming a post is done.**

```bash
node src/scripts/validate-blog-frontmatter.mjs src/features/doc/content/blog/<slug>.mdx
```

Exit 0 means it passes. Exit 1 prints the exact failures on stderr. Fix them and
run again. Do not edit around the validator, and do not relax a rule to make a
post pass.

Validate the whole folder:

```bash
pnpm validate:blog
```

## 5. Verify

```bash
pnpm build
```

The build type-checks, prerenders every post, and regenerates the RSS feed and
sitemap. A post that does not appear in the build output is not published.

---

## What is generated automatically

Do not hand-write any of these:

- The `/blog` index entry, year grouping, and entry number
- Reading time
- The RSS feed at `/blog/rss`
- Sitemap entries
- The OG image, when `image` is absent (falls back to `/og/simple`)
- `BlogPosting` JSON-LD, breadcrumbs, and canonical URLs
- Previous/next links and their keyboard shortcuts
- View counts and reactions (stored in Redis, keyed by slug)

## Checklist

- [ ] Filename is a clean, permanent slug
- [ ] All four required frontmatter fields present, dates quoted `YYYY-MM-DD`
- [ ] Tags come from the canonical list
- [ ] Body starts at `##`, does not repeat title or description
- [ ] No emojis, no em dashes
- [ ] Every code fence has a language
- [ ] `validate-blog-frontmatter.mjs` exits 0
- [ ] `pnpm build` succeeds and the post appears in the route list
