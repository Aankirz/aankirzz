"use client"

import { useAtom } from "jotai"

import { Collapsible } from "@/components/base/collapsible-animated"
import { activeProjectAtom } from "@/features/portfolio/state/active-project"

/**
 * Thin client wrapper so ProjectItem can stay a server component (its Markdown
 * body renders an async server component). Each project's open state is
 * *controlled* by a single shared atom, so opening one card closes the others
 * (accordion behaviour — projects only). Server-rendered children pass through.
 */
export function ProjectCollapsible({
  projectId,
  className,
  children,
}: {
  projectId: string
  className?: string
  children: React.ReactNode
}) {
  const [activeId, setActive] = useAtom(activeProjectAtom)

  return (
    <Collapsible
      className={className}
      open={activeId === projectId}
      onOpenChange={(open) => setActive(open ? projectId : null)}
    >
      {children}
    </Collapsible>
  )
}
