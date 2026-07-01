import type { User } from "@/features/portfolio/types/user"

export const USER: User = {
  firstName: "Ankit",
  lastName: "Kiran Sahu",
  displayName: "Ankit Kiran",
  username: "aankirz",
  gender: "male",
  pronouns: "he/him",
  bio: "Software engineer. I build LLM agent runtimes and pixel-perfect frontends.",
  flipSentences: [
    "Software Engineer (AI) @ Simbian",
    "I build LLM agent runtimes",
    "ex-CRED · ex-Chromium (GSoC '23)",
    "Low-level systems, fast frontends",
  ],
  address: "India",
  phoneNumberB64: "KzkxODE0NDA4MTcyMw==", // +918144081723, base64 encoded
  emailB64: "c2FodWFua2l0NDUzQGdtYWlsLmNvbQ==", // base64 encoded
  website: "https://ankitkiran.vercel.app",
  jobTitle: "Software Engineer (AI)",
  jobs: [
    {
      title: "Software Engineer (AI)",
      company: "Simbian AI",
      website: "https://simbian.ai",
      experienceId: "simbian-ai",
    },
  ],
  about: `I’m Ankit — a software engineer who likes the hard, low-level parts: LLM agent runtimes, browser internals, and frontends shipped to millions.

Right now I build the multi-tenant agent runtime at [Simbian](https://simbian.ai). Before that I shipped net-new products at [CRED](https://cred.club), was the founding engineer at WootzApp re-architecting Chromium into a training environment for AI agents, and contributed to Chromium through [Google Summer of Code '23](https://summerofcode.withgoogle.com/archive/2023/projects/ULtyGXXr).

Winner of the Solana Colosseum Renaissance Hackathon ($30k, 2nd prize).
`,
  avatar: "/ankit.jpeg",
  avatarVariants: {
    lightOff: "/ankit.jpeg",
    lightOn: "/ankit.jpeg",
    darkOff: "/ankit.jpeg",
    darkOn: "/ankit.jpeg",
  },
  ogImage: "/og.svg",
  namePronunciationUrl: "",
  timeZone: "Asia/Kolkata",
  keywords: [
    "ankit kiran",
    "ankit kiran sahu",
    "aankirz",
    "ankit sahu",
    "simbian",
    "software engineer",
    "ai engineer",
    "chromium",
    "gsoc",
  ],
  dateCreated: "2024-01-01", // YYYY-MM-DD
}
