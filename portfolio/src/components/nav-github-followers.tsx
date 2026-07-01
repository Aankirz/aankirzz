import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { GitHubIcon } from "@/components/icons"
import { getGitHubProfile } from "@/features/portfolio/data/github-profile"
import { SOCIAL } from "@/features/portfolio/data/social-links"

export async function NavGitHubFollowers() {
  const profile = await getGitHubProfile()

  return (
    <a
      href={SOCIAL.github.href}
      target="_blank"
      rel="noopener"
      aria-label={`GitHub — ${profile?.followers ?? 0} followers`}
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "gap-1.5 border-none px-2"
      )}
    >
      <GitHubIcon className="size-4" />
      {profile && (
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {profile.followers.toLocaleString()}
        </span>
      )}
    </a>
  )
}
