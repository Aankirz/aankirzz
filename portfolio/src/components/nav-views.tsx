"use client"

import { useEffect, useState } from "react"
import { EyeIcon } from "lucide-react"

/**
 * Live page-view count shown in the nav. Reads from the views API; renders
 * nothing until a real number arrives (hidden when the counter isn't
 * configured).
 */
export function NavViews() {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/views")
      .then((r) => r.json() as Promise<{ views: number | null }>)
      .then((d) => {
        if (typeof d.views === "number") setViews(d.views)
      })
      .catch(() => {})
  }, [])

  if (views === null) return null

  return (
    <span
      className="flex items-center gap-1 font-mono text-xs text-muted-foreground"
      title={`${views.toLocaleString()} page views`}
    >
      <EyeIcon className="size-4" />
      {views.toLocaleString()}
    </span>
  )
}
