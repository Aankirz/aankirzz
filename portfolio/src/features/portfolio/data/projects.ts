import type { Project } from "../types/projects"

export const PROJECTS: Project[] = [
  {
    id: "wootz-browser",
    title: "Wootz Browser",
    period: {
      start: "03.2024",
    },
    link: "https://github.com/wootzapp/wootz-browser",
    skills: ["C++", "Chromium", "CDP", "Android"],
    description:
      "- **★ 105 on GitHub** — fully open-source Android browser built on Chromium, re-architected into a deterministic training environment for AI agents.\n- Exposes internal rendering and DOM signals through a hardened CDP pipeline as agent reward sources that off-the-shelf automation can't surface.",
    isExpanded: true,
  },
  {
    id: "pairtrader",
    title: "PairTrader",
    period: {
      start: "2024",
    },
    link: "https://pairtrader.in",
    screenshot: "/projects/pairtrader.jpg",
    skills: ["React", "Django", "AWS", "Vercel"],
    description:
      "- Full-stack algorithmic trading platform built with **React** + **Django** — responsive UI and live trading charts driven by daily stock-market API updates.\n- Hit a **97% Lighthouse** score (0.7s FCP) via efficient rendering and reduced API calls; deployed on Vercel + AWS, cutting network latency ~30% with optimized backend calls.",
  },
  {
    id: "crucible",
    title: "Crucible",
    period: {
      start: "2025",
    },
    link: "https://crucible-api-md84.onrender.com",
    screenshot: "/projects/crucible.jpg",
    skills: ["Python", "Gemini 3", "Google ADK", "Arize Phoenix", "MCP"],
    description:
      "- An agent that **builds and self-optimizes text-to-SQL agents**: it drafts an agent, scores it against held-out gold SQL by execution match, reads its own failing traces through the **Arize Phoenix MCP** server, and mutates until it clears a quality bar.\n- One database in → one tuned, measured agent out (~50% → 100% on held-out tests). Built with Gemini 3 + Google ADK for the Google Cloud Rapid Agent Hackathon.",
  },
  {
    id: "askthecrowd",
    title: "AskTheCrowd",
    period: {
      start: "2025",
    },
    link: "https://github.com/Aankirz/askthecrowd",
    screenshot: "/projects/askthecrowd.jpg",
    skills: ["Next.js", "React", "Open Source"],
    description:
      "- Free, open-source **AnswerThePublic** alternative — type a keyword and get a shareable map of what the internet is asking, pulled from Google Autocomplete + Reddit.\n- Visual radial wheel with SVG/PNG export, built for content and SEO teams. No login, no tracking.",
  },
]
