import Image from "next/image"
import Link from "next/link"

import { SOCIAL } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"

/**
 * End-of-article byline. A reader who finished the piece is the most likely
 * person to want the rest of the site, so this is the one place the blog points
 * back at the portfolio.
 */
export function PostAuthorCard() {
  return (
    <aside className="screen-line-top screen-line-bottom flex items-start gap-4 px-4 py-6">
      <Image
        className="size-12 shrink-0 rounded-full object-cover"
        src={USER.avatar}
        alt=""
        width={96}
        height={96}
      />

      <div className="min-w-0">
        <p className="font-mono text-xs tracking-wider text-muted-foreground">
          Written by
        </p>

        <p className="mt-1 text-base font-medium">{USER.displayName}</p>

        <p className="mt-1 max-w-[52ch] font-reading text-sm/relaxed text-pretty text-muted-foreground">
          {USER.bio}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs">
          <Link href="/" className="link-underline">
            Portfolio
          </Link>
          <a
            href={SOCIAL.x.href}
            className="link-underline"
            rel="noopener"
            target="_blank"
          >
            {SOCIAL.x.handle}
          </a>
          <a
            href={SOCIAL.github.href}
            className="link-underline"
            rel="noopener"
            target="_blank"
          >
            GitHub
          </a>
          <a href={SOCIAL.email.href} className="link-underline">
            Email
          </a>
        </div>
      </div>
    </aside>
  )
}
