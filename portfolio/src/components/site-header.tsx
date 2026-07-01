import Link from "next/link"
import { FileTextIcon, MailIcon } from "lucide-react"

import { MAIN_NAV } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import { ChanhDaiMark } from "@/components/chanhdai-mark"
import { NavDesktop } from "@/components/nav-desktop"
import { SiteHeaderShell } from "@/components/site-header-shell"
import { ThemeToggle } from "@/components/theme-toggle"
import { ResumeTrigger } from "@/features/portfolio/components/resume-trigger"
import { SOCIAL } from "@/features/portfolio/data/social-links"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 max-w-screen overflow-x-clip bg-background px-2 pt-(--header-pt) [--header-h:calc(var(--header-height)-var(--header-pt))] [--header-pt:--spacing(2)]">
      <SiteHeaderShell>
        <Link href="/" aria-label="Home">
          <ChanhDaiMark className="h-8 shrink-0" />
        </Link>

        <div className="flex-1" />

        <NavDesktop items={MAIN_NAV} />

        <div className="flex items-center">
          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  href={SOCIAL.email.href}
                  aria-label="Contact"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon-sm" }),
                    "border-none"
                  )}
                >
                  <MailIcon />
                </a>
              }
            />
            <TooltipContent>Contact</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              render={
                <ResumeTrigger
                  aria-label="Resume"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon-sm" }),
                    "border-none"
                  )}
                >
                  <FileTextIcon />
                </ResumeTrigger>
              }
            />
            <TooltipContent>Resume</TooltipContent>
          </Tooltip>

          <Separator
            orientation="vertical"
            className="mx-2 data-vertical:h-5 data-vertical:self-center"
          />
          <ThemeToggle />
        </div>
      </SiteHeaderShell>
    </header>
  )
}
