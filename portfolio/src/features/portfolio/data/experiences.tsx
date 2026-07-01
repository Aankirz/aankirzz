import { BotIcon, CodeXmlIcon, GlobeIcon } from "lucide-react"

import type { Experience } from "@/features/portfolio/types/experiences"

export const EXPERIENCES: Experience[] = [
  {
    id: "simbian-ai",
    companyName: "Simbian AI",
    companyLogo: "/companies/simbian.png",
    companyWebsite: "https://simbian.ai/",
    location: "Bangalore, India",
    locationType: "Remote",
    positions: [
      {
        id: "1",
        title: "Software Engineer",
        employmentPeriod: {
          start: "10.2025",
        },
        employmentType: "Full-time",
        icon: <BotIcon />,
        description: `- Built the **agent factory** at the core of Simbian's *Agentic Harness*, a multi-tenant LLM agent runtime — it constructs each session agent and its sub-agents from one shared config object, replacing a tangle of one-off setup code.
- Designed the **context and cost layer**: per-session token and dollar caps that aggregate spend across turns and sub-agents so an agent can't run away on cost, plus skill ranking, a goal-evaluator that judges when an agent has met its objective, and a live one-line session summarizer.
- Hardened the runtime for production with **nsjail** sandboxing that isolates each agent to its tenant, a sync engine that pins every session to the correct skill version, and a leader-elected scheduler using a **Postgres lock** so replicas never double-dispatch a job.
- Built the full **React** console on top of the runtime and wrote the **pytest** suite behind the whole system.`,
        skills: [
          "Python",
          "React",
          "PostgreSQL",
          "LLM Agent Runtimes",
          "nsjail",
          "pytest",
          "CDP",
        ],
        isExpanded: true,
      },
    ],
    isCurrentEmployer: true,
  },
  {
    id: "cred",
    companyName: "CRED",
    companyLogo: "/companies/cred.png",
    companyWebsite: "https://cred.club/",
    location: "Bangalore, India",
    locationType: "On-site",
    positions: [
      {
        id: "1",
        title: "Software Engineer Intern",
        employmentPeriod: {
          start: "05.2025",
          end: "10.2025",
        },
        employmentType: "Internship",
        icon: <CodeXmlIcon />,
        description: `- Owned the frontend end-to-end for **Fixed Deposits**, a net-new CRED product, architected on a template-driven pattern in **React** + **TypeScript** and shipped to production.
- Delivered [**CRED Money**](https://cred.club/money) GTM end-to-end, from frontend implementation through launch.
- Shipped an internal AI tool that generates Ops decision trees from natural language, replacing manual D-tree configuration.
- Built a natural-language-driven rules-engine generator for Rewards OS: a chat UI that produces validated rule JSON, checked live against the UAS Global API so non-technical users author correct rules.`,
        skills: ["React", "TypeScript"],
      },
    ],
  },
  {
    id: "wootzapp",
    companyName: "WootzApp",
    companyLogo: "/companies/wootzapp.png",
    companyWebsite: "https://www.wootzapp.com/",
    location: "Bangalore, India",
    locationType: "Hybrid",
    positions: [
      {
        id: "1",
        title: "Founding Engineer",
        employmentPeriod: {
          start: "03.2024",
          end: "11.2024",
        },
        employmentType: "Full-time",
        icon: <GlobeIcon />,
        description: `- Rewrote **Chromium** renderer internals (**C++/Java**) for WootzApp, a fully open-source Android browser, turning it into a deterministic training environment for AI agents that exposes internal rendering and DOM signals through a hardened **CDP** pipeline as reward sources off-the-shelf automation (Selenium, Playwright) can't surface.
- Built the Android **WebView** implementation and in-browser app surface, embedding agent-facing web tasks directly in the native browser.
- First engineer at the company — built the team from zero by hiring and onboarding the founding engineering group and setting technical direction for the Chromium-for-agents platform.`,
        skills: ["C++", "Java", "JavaScript", "Chromium", "CDP", "Android"],
      },
    ],
  },
  {
    id: "google-summer-of-code",
    companyName: "Google Summer of Code",
    companyLogos: ["/companies/gsoc.png", "/companies/chromium.png"],
    companyWebsite:
      "https://summerofcode.withgoogle.com/archive/2023/projects/ULtyGXXr",
    locationType: "Remote",
    positions: [
      {
        id: "1",
        title: "Contributor — Chromium Organization",
        employmentPeriod: {
          start: "05.2023",
          end: "09.2023",
        },
        employmentType: "Open Source Contributor",
        icon: <CodeXmlIcon />,
        description: `- Redesigned Chromium's in-browser UI for local media (\`file://\`) playback, modifying renderer-level **C++** (\`MediaDocumentParser\`) so media renders in a themed, cast-ready player instead of the default bare view.
- Added Cast support to the ChromeOS Gallery app via the **Remote Playback API**, enabling local media to cast to Chromecast devices from the OS gallery.
- Mentors: Muyao Xu, Angelo Tadres, Mark Foltz.`,
        skills: ["C++", "JavaScript"],
      },
    ],
  },
]
