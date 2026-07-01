import { FileTextIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { SiteFooterInteractiveLogotype } from "@/components/site-footer-brand"
import { ResumeTrigger } from "@/features/portfolio/components/resume-trigger"
import { SOCIAL_ICONS } from "@/features/portfolio/components/social-link-icons"
import {
  SOCIAL,
  SOCIAL_LINKS,
} from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"

export function SiteFooter() {
  return (
    <footer className="max-w-screen overflow-x-clip px-2">
      <div className="mx-auto border-x border-line group-has-data-[slot=layout-wide]/layout:container md:max-w-4xl">
        <div className="screen-line-top screen-line-bottom">
          <div className="stripe-divider h-12" />
        </div>

        <dl className="flex flex-col gap-4 py-8 font-mono [&_dd]:text-sm [&_dt]:text-right [&_dt]:text-sm [&_dt]:text-muted-foreground">
          <Item>
            <dt>Crafted by</dt>
            <dd>
              <a
                className="link-underline"
                href={SOCIAL.linkedin.href}
                target="_blank"
                rel="noopener"
              >
                {USER.displayName}
              </a>
            </dd>
          </Item>
        </dl>

        <div className="screen-line-top screen-line-bottom flex w-full before:z-1 after:z-1">
          <div className="mx-auto flex flex-wrap items-center justify-center gap-3 border-x border-line bg-background px-4 [&_a]:flex [&_a]:items-center [&_img]:size-4 [&_svg]:size-4">
            {SOCIAL_LINKS.map((link, index) => (
              <div key={link.name} className="flex items-center gap-3">
                {index > 0 && <Separator />}
                <a
                  className="text-muted-foreground transition-[color] hover:text-foreground"
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener"
                  aria-label={link.title}
                >
                  {SOCIAL_ICONS[link.name]}
                </a>
              </div>
            ))}

            <Separator />

            <ResumeTrigger
              className="flex items-center text-muted-foreground transition-[color] hover:text-foreground"
              aria-label="Resume"
            >
              <FileTextIcon className="size-4" />
            </ResumeTrigger>
          </div>
        </div>
      </div>

      <SiteFooterInteractiveLogotype />

      <div className="h-(--fade-bottom-height)" />
      <div className="pb-[env(safe-area-inset-bottom,0)]" />
    </footer>
  )
}

function Separator({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex h-11 w-px bg-line", className)} {...props} />
}

function Item({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("grid grid-cols-2 gap-4", className)} {...props} />
}
