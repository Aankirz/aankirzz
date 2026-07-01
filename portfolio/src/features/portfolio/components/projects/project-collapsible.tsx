"use client"

import { useSetAtom } from "jotai"

import { Collapsible } from "@/components/base/collapsible-animated"
import { activeProjectAtom } from "@/features/portfolio/state/active-project"

/**
 * Thin client wrapper so ProjectItem can stay a server component (its Markdown
 * body renders an async server component). Reports the card's open state to the
 * showcase atom; server-rendered children are passed straight through.
 */
export function ProjectCollapsible({
  projectId,
  defaultOpen,
  className,
  children,
}: {
  projectId: string
  defaultOpen?: boolean
  className?: string
  children: React.ReactNode
}) {
  const setActive = useSetAtom(activeProjectAtom)

  return (
    <Collapsible
      className={className}
      defaultOpen={defaultOpen}
      onOpenChange={(open) =>
        setActive((current) =>
          open ? projectId : current === projectId ? null : current
        )
      }
    >
      {children}
    </Collapsible>
  )
}
