import type { SocialProfile } from "@/features/portfolio/types/social-links"

/**
 * Keyed registry of social profiles — the single source of truth. Icons are
 * bound separately in `social-link-icons.tsx` (keyed by the same `SocialName`),
 * so adding a profile here forces the icon map to stay in sync at compile time.
 */
export const SOCIAL = {
  github: {
    title: "GitHub",
    handle: "Aankirz",
    href: "https://github.com/Aankirz",
    sameAs: true,
  },
  linkedin: {
    title: "LinkedIn",
    handle: "ankit-kiran",
    href: "https://www.linkedin.com/in/ankit-kiran-3819b0219",
    sameAs: true,
  },
  x: {
    title: "X",
    handle: "@AnkitKiran7",
    href: "https://x.com/AnkitKiran7",
    sameAs: true,
  },
  gerrit: {
    title: "Gerrit",
    handle: "Chromium reviews",
    href: "https://chromium-review.googlesource.com/q/owner:sahuankit453@gmail.com",
    sameAs: true,
  },
  blog: {
    title: "Blog",
    handle: "llawliet.bearblog.dev",
    href: "https://llawliet.bearblog.dev",
    sameAs: true,
  },
  email: {
    title: "Email",
    handle: "sahuankit453@gmail.com",
    href: "mailto:sahuankit453@gmail.com",
  },
} satisfies Record<string, SocialProfile>

export type SocialName = keyof typeof SOCIAL

export type SocialLink = SocialProfile & { name: SocialName }

export const SOCIAL_LINKS: SocialLink[] = (
  Object.entries(SOCIAL) as [SocialName, SocialProfile][]
).map(([name, profile]) => ({ name, ...profile }))
