# Changelog

## 2026-07-01 — Portfolio data refresh
- Rewrote `src/features/portfolio/data/projects.ts` with Ankit Kiran's projects (Wootz Browser, Simbian Agentic Harness, FoodPrint, Personal Portfolio); Wootz marked `isExpanded: true`.
- Emptied `testimonials.tsx`, `certifications.ts`, and `bookmarks.tsx` data arrays (kept export names/types, removed now-unused icon/helper imports) to retire those sections.

## 2026-07-04 — GitHub contributions default to previous year
- github-contributions/graph.tsx: default selected year is now the previous year (falls back to newest available); year buttons unchanged.

## 2026-07-05 — Don't cache failed GitHub contributions fetches
- github-contributions.ts: fetch failures now throw inside unstable_cache (nothing cached) and are caught per-request, instead of caching an empty result for 24h.

## 2026-08-02 — Blog: full reading experience
- Routes: added `/blog` (index) and `/blog/[slug]` (article), plus `/blog/rss` and `/og/simple` for social cards. Blog added to `MAIN_NAV`/`MOBILE_NAV`; sitemap now emits the index and every post.
- Index design: replaced the card grid with a ruled ledger (`post-ledger`, `post-lead`, `post-row`) — a lead slot for the newest/pinned post, then year-grouped hairline rows with a mono metadata rail. Hierarchy comes from scale contrast rather than uniform cards. Deleted the superseded `post-item.tsx` and `post-list.tsx`.
- Reading typography: added Literata as `--font-reading` for article body only (Geist is a UI face and flattens over long form); new `prose-reading` utility sets 18px/1.75 at a 68ch measure, keeps headings on Geist, and restyles blockquotes as pull-quotes instead of side-striped callouts. Widened the article grid's centre column to 4xl so body rules align with the title block.
- Article chrome: `reading-progress` (pure CSS scroll-driven animation on the top hairline, no scroll listener), `post-meta-bar` byline, `post-author-card`, and `post-neighbours` prev/next as ruled rows.
- Engagement: `post-engagement-bar` adds thumbs-up/heart reactions and a per-post read count, backed by `features/blog/data/post-engagement.ts` over the existing Upstash/Vercel KV store (new key prefixes only, no new service). Optimistic updates with rollback; the strip hides entirely when the store is unconfigured. New API route `/api/blog/[slug]` with slug and visitor-id validation.
- Filtering: search now also matches tags; added a `tag` URL param and `post-tag-filter` chips. Client components receive a `BlogPostSummary` instead of the full `Doc`, keeping every post's MDX body out of the browser bundle.
- Publishing pipeline (ported from the Simbian marketing site, trimmed for one author): `src/features/doc/content/blog/AGENT.md` authoring contract plus `src/scripts/validate-blog-frontmatter.mjs` hard-gate validator (`pnpm validate:blog`) enforcing required fields, date format, slug uniqueness, and a closed tag set. Skipped the upstream markdown precompiler — posts are already read once at build time and rendered statically.
- Homepage: rewrote `features/portfolio/components/blog.tsx` to reuse the ledger rows and wired the panel into `(app)/page.tsx` between Projects and Tech stack.
- Added `reading-time.ts` (strips code/JSX before counting) with unit tests.
