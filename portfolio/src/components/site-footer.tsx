import { FileTextIcon, MailIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { GitHubIcon, LinkedInIcon } from "@/components/icons"
import { SiteFooterInteractiveLogotype } from "@/components/site-footer-brand"
import { ResumeTrigger } from "@/features/portfolio/components/resume-trigger"
import { SOCIAL } from "@/features/portfolio/data/social-links"
import { USER } from "@/features/portfolio/data/user"

export function SiteFooter() {
  const githubLink = SOCIAL.github
  const linkedinLink = SOCIAL.linkedin
  const emailLink = SOCIAL.email

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
                href={githubLink.href}
                target="_blank"
                rel="noopener"
              >
                {USER.displayName}
              </a>
            </dd>
          </Item>
        </dl>

        <div className="screen-line-top screen-line-bottom flex w-full before:z-1 after:z-1">
          <div className="mx-auto flex items-center justify-center gap-3 border-x border-line bg-background px-4">
            <a
              className="flex items-center text-muted-foreground transition-[color] hover:text-foreground"
              href={githubLink.href}
              target="_blank"
              rel="noopener"
              aria-label="GitHub Profile"
            >
              <GitHubIcon className="size-4" />
            </a>

            <Separator />

            <a
              className="flex items-center text-muted-foreground transition-[color] hover:text-foreground"
              href={linkedinLink.href}
              target="_blank"
              rel="noopener"
              aria-label="LinkedIn Profile"
            >
              <LinkedInIcon className="size-4" />
            </a>

            <Separator />

            <a
              className="flex items-center text-muted-foreground transition-[color] hover:text-foreground"
              href={emailLink.href}
              aria-label="Email"
            >
              <MailIcon className="size-4" />
            </a>

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
