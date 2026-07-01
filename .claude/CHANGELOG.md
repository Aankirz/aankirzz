
## 2026-07-01 — Build Ankit Kiran portfolio site
- Added `chanhdai.com/` and `portfolio/node_modules/` to `.gitignore`.
- Created `portfolio/` from the chanhdai.com app baseline (Next 16 + Tailwind v4 + shadcn), then customized:
  - Rewrote portfolio data (user, experiences, projects, education, tech-stack, awards, social-links) with Ankit's resume; emptied unused sections (testimonials, certifications, bookmarks).
  - Recomposed homepage to: Profile → Overview → Social → GitHub → Experience → Projects → Tech Stack → Education → Awards.
  - Rebranded wordmark/mark to "Ankit Kiran" / "AK"; local favicon/avatar/og SVGs; updated metadata, JSON-LD, manifest, vCard base.
  - Stripped X social + analytics refs from footer; set build script to `next build` (no bun needed); removed chanhdai's personal blog posts.
- Verified: `next build` passes; prod server returns 200 with all sections rendering Ankit's content.

## 2026-07-01 — Portfolio design pass (improvise, not copy)
- Reviewed live site via Playwright screenshots; found weak hero (double "AK", clipped bio), chanhdai branding in footer logotype + "inspired by" list, no color identity.
- Gave Ankit a distinct identity: terminal/systems-engineer direction + committed amber accent (CRT heritage; avoids blue-SaaS / green-terminal clichés).
  - Hero: replaced flat "AK" figure with a monospace shell panel (whoami / focus.txt) + blinking amber caret; shortened flip sentences (fixed clipping).
  - Accent: `--link` → amber (light+dark); Stack index numbers amber; link hover reveals amber; avatar/og recolored amber.
  - Footer: replaced hardcoded "chanhdai" pixel logotype with interactive "ankitkiran" monospace wordmark; trimmed "inspired by" to honest "Built with" tools.
- `next build` passes.

## 2026-07-01 — Hero rework + content trims (round 2)
- Rebuilt the hero (was cramped/collapsed): cinematic autoplay video banner (`/portfolio-bg.mp4`, compressed 32MB→5MB, with poster) + "Build · Ship · Repeat" serif-italic quote; real profile photo (`/ankit.jpeg`) overlapping the banner; name + flip subtitle; terminal strip given its own full-width row for breathing room.
- Removed per request: phone number, website/portfolio link, LeetCode link (socials now GitHub/LinkedIn/Email), and the gender/pronouns item.
- Updated footer to drop the removed website social. `next build` passes.

## 2026-07-01 — Submerged video, wider column, interactive AI terminal (round 3)
- Feathered the hero video edges (inset background vignette) so the clip looks submerged into the surface instead of a hard rectangle.
- Widened the main column site-wide (max-w-3xl → max-w-4xl across header, footer, content, layouts) to reduce side gutters.
- Replaced the static `cat ~/focus.txt` block with a real interactive terminal (`ask-ankit`): visitors type questions and an LLM answers, grounded only in Ankit's site data.
  - `src/lib/ankit-context.ts` builds a plain-text knowledge base from the same data the site renders.
  - `src/app/api/ask/route.ts` (server) holds the OpenRouter key, validates input, per-IP rate limits (10/min), and falls through a list of free models on 429.
  - `OPENROUTER_API_KEY` / `OPENROUTER_MODEL` live in gitignored `.env.local` (server-only, never exposed to the client).
- Verified end-to-end in a headless browser (ask → grounded answer) and `next build` passes.

## 2026-07-01 — Chat dock + avatar stacking fix (round 4)
- Fixed avatar rendering behind the video: the `relative` banner painted over the static identity row; gave the row `relative z-10` (plus more overlap + shadow) so the photo sits in front.
- Moved "ask-ankit" out of the hero into a floating terminal-style chat dock (`ask-bot.tsx`, mounted site-wide in (app)/layout): bottom-right launcher pill opens a docked terminal panel (header with online dot + close, scrollable Q&A, input). Adopts existing mono/amber/line tokens, motion via motion/react with ease-out + reduced-motion, Esc-to-close, focus-visible rings. No fake terminal chrome.
- Removed the in-hero terminal strip + deleted ask-terminal.tsx. `next build` passes; verified open/ask flow in a headless browser.

## 2026-07-01 — AI sidebar + prompt caching + prominent trigger (round 5)
- Replaced the corner chatbot with a full-height right-side AI sidebar (ai-sidebar.tsx): slide-in drawer, dimmed/blurred backdrop, header with Ankit's pfp + online dot, avatar chat bubbles, suggestion chips, pill input with send button. Esc/backdrop to close, body-scroll lock, focus rings, reduced-motion. Removed ask-bot.tsx.
- Made the trigger prominent: floating pill now shows Ankit's photo, "Ask my AI" + subtitle, and a pulsing amber online dot (was a small mono pill).
- Added prompt caching in /api/ask: context memoized once per instance; identical questions served from a 1h in-memory answer cache (FIFO, 300 cap) BEFORE rate limiting — also dodges free-tier 429s. Verified: 6.6s fresh → 22ms cached (cached:true).
- next build passes; open/ask flow verified in a headless browser.

## 2026-07-01 — Projects, stack, nav, sounds, radius (round 6)
- Projects: replaced list with Wootz Browser (now shows ★105 GitHub stars), PairTrader, Crucible, AskTheCrowd — descriptions pulled from their GitHub/READMEs. Added optional `screenshot` field to Project type; PairTrader/Crucible/AskTheCrowd render an in-card preview image (optimized into public/projects/).
- Stack: revamped to match spec — Languages (no Java), Backend adds SQL + Django, full AI/Infra row (LLM Agent Runtimes, pytest, nsjail, CDP); relabeled Languages/Databases (plural) in image order.
- Nav: removed the ⌘K search box; added "Contact me" (mailto); navbar is full-bleed at top and morphs to the content column on scroll (SiteHeaderShell client wrapper — kept SiteHeader a server component so NavItemGitHub still renders).
- Section rail: fixed top-left, IntersectionObserver active highlight, appears after scrolling past the hero, clear of the content column.
- Global interaction sounds: single delegated pointerdown listener (InteractionSounds) plays the soft click on any button/link/accordion; skips the theme toggle (has its own), silent under reduced-motion.
- Consistency: squared the rounded-full pills (Contact me → rounded-lg, AI trigger → rounded-xl, sidebar input/send/bubbles → rounded-lg) to match the site's radius standard; avatars/status dots stay round.
- All verified in a headless browser; next build passes.

## 2026-07-01 — Nav mail icon, dates, right-side showcase, logos, GH year (round 7)
- Nav: removed the GitHub icon; replaced "Contact me" text with a mail icon styled exactly like the theme toggle (ghost button, no amber border, same hover), mailto + tooltip.
- Dates: added format-period lib. Experience + Education now show language dates ("March 2024 — Present"); projects show year only (no hyphen/infinity).
- Project screenshots: innovative right-gutter "// preview" panel (project-showcase.tsx) that crossfades to the in-view project's screenshot on wide screens (≥84rem) via IntersectionObserver; in-card screenshot kept below that width. Adopts amber/mono/line tokens, no fake browser chrome.
- Company logos: fetched color brand marks for Simbian/CRED/WootzApp into public/companies/, wired as companyLogo, shown in color (dropped the grayscale filter).
- GitHub contributions: fetch current year (?y=<year>) instead of last 365 days; footer label now "N contributions in 2026".
- next build passes; all verified in a headless browser at 1600px.
