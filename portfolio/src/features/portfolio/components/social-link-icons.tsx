import { MailIcon, RssIcon } from "lucide-react"

import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons"
import type { SocialName } from "@/features/portfolio/data/social-links"

/**
 * Presentation binding for social profiles. Kept separate from the social
 * data so the data layer stays JSX-free. Keyed by `SocialName` so it stays
 * exhaustive with the registry.
 */
export const SOCIAL_ICONS: Record<SocialName, React.JSX.Element> = {
  github: <GitHubIcon />,
  linkedin: <LinkedInIcon />,
  x: <XIcon />,
  gerrit: (
    <img
      src="/companies/gerrit.png"
      alt=""
      className="size-4.5 rounded-[3px] object-contain"
    />
  ),
  blog: <RssIcon />,
  email: <MailIcon />,
}
