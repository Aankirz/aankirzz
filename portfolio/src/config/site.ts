import type { Route } from "next"

import type { NavItem } from "@/types/nav"
import { SOCIAL } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"

export const SITE_INFO = {
  name: USER.displayName,
  url: process.env.NEXT_PUBLIC_APP_URL || "https://ankitkiran.vercel.app",
  ogImage: USER.ogImage,
  description: USER.bio,
  keywords: USER.keywords,
}

export const LICENSE = {
  name: "MIT License",
  url: "https://opensource.org/licenses/MIT",
}

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}

export const MAIN_NAV: NavItem<Route>[] = []

export const MOBILE_NAV: NavItem<Route>[] = [
  {
    title: "Home",
    href: "/",
  },
]

export const X_HANDLE: string | undefined = undefined
export const GITHUB_USERNAME = SOCIAL.github.handle
export const SOURCE_CODE_GITHUB_REPO = "Aankirz/portfolio"
export const SOURCE_CODE_GITHUB_URL = "https://github.com/Aankirz"

export const SPONSORSHIP_URL = "https://github.com/Aankirz"

export const RESUME_URL =
  "https://drive.google.com/file/d/1g2jNIvQ10qzXj3GLvtrHnoGZrpPY7u7K/view?usp=sharing"

export const UTM_PARAMS = {
  utm_source: "ankitkiran.vercel.app",
}
