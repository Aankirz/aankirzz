import Link from "next/link"

import { cn } from "@/lib/utils"

const MODES = [
  { label: "Human", href: "/" },
  { label: "Machine", href: "/ai" },
] as const

export type SiteMode = (typeof MODES)[number]["label"]

/**
 * Human/machine view switch, pinned bottom-centre on both views. Plain links,
 * so the two renderings stay separately addressable and crawlable.
 */
export function ModeToggle({
  current,
  className,
}: {
  current: SiteMode
  className?: string
}) {
  return (
    <nav
      aria-label="View mode"
      className={cn(
        "fixed bottom-[calc(--spacing(14)+env(safe-area-inset-bottom,0))] left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-md px-2.5 py-1.5 font-mono text-[11px] tracking-wider uppercase sm:bottom-[calc(--spacing(2)+env(safe-area-inset-bottom,0))]",
        className
      )}
    >
      {MODES.map((mode) => {
        const isCurrent = mode.label === current

        return (
          <Link
            key={mode.label}
            href={mode.href}
            aria-current={isCurrent ? "page" : undefined}
            className={cn(
              "flex items-center gap-1.5 transition-opacity",
              isCurrent ? "opacity-100" : "opacity-55 hover:opacity-100"
            )}
          >
            <span
              aria-hidden
              className={cn(
                "size-2 rounded-full ring-1 ring-current",
                isCurrent && "bg-current"
              )}
            />
            {mode.label}
          </Link>
        )
      })}
    </nav>
  )
}
