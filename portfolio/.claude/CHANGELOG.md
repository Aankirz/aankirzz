# Changelog

## 2026-07-01 — Portfolio data refresh
- Rewrote `src/features/portfolio/data/projects.ts` with Ankit Kiran's projects (Wootz Browser, Simbian Agentic Harness, FoodPrint, Personal Portfolio); Wootz marked `isExpanded: true`.
- Emptied `testimonials.tsx`, `certifications.ts`, and `bookmarks.tsx` data arrays (kept export names/types, removed now-unused icon/helper imports) to retire those sections.

## 2026-07-04 — GitHub contributions default to previous year
- github-contributions/graph.tsx: default selected year is now the previous year (falls back to newest available); year buttons unchanged.
