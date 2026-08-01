"use client"

import { useCallback, useEffect, useState } from "react"
import { HeartIcon, ThumbsUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { haptic } from "@/registry/lib/haptic"

import { useVisitorId } from "../hooks/use-visitor-id"

const REACTIONS = [
  { kind: "like", label: "Useful", Icon: ThumbsUpIcon },
  { kind: "heart", label: "Loved it", Icon: HeartIcon },
] as const

type ReactionKind = (typeof REACTIONS)[number]["kind"]

type Counts = Record<ReactionKind, number>

const EMPTY_COUNTS: Counts = { like: 0, heart: 0 }

// Response shapes from /api/blog/[slug]. Declared because ts-reset types
// Response.json() as `{}`, so the payload has to be narrowed explicitly.
type EngagementResponse = {
  engagement: { views: number; reactions: Counts } | null
}
type ViewResponse = { views: number | null }
type ReactResponse = { count: number; active: boolean }

const localReactionKey = (slug: string, kind: ReactionKind) =>
  `blog:reacted:${slug}:${kind}`

/**
 * End-of-article reactions and view count. Counts load client-side because the
 * article itself is statically generated: fetching them on the server would
 * make every post dynamic to render a number that changes by the minute.
 *
 * The whole strip stays hidden until the store answers, so an unconfigured
 * environment shows nothing rather than a row of permanent zeros.
 */
export function PostEngagementBar({ slug }: { slug: string }) {
  const visitorId = useVisitorId()

  const [counts, setCounts] = useState<Counts | null>(null)
  const [views, setViews] = useState<number | null>(null)
  const [active, setActive] = useState<Record<ReactionKind, boolean>>({
    like: false,
    heart: false,
  })
  const [pending, setPending] = useState<ReactionKind | null>(null)

  // Which reactions this browser has already given. Mirrored locally so the
  // buttons render in the right state immediately, without waiting on a
  // round-trip that would make them flicker.
  useEffect(() => {
    try {
      setActive({
        like: localStorage.getItem(localReactionKey(slug, "like")) === "1",
        heart: localStorage.getItem(localReactionKey(slug, "heart")) === "1",
      })
    } catch {
      // storage blocked — buttons start inactive, server still dedups
    }
  }, [slug])

  useEffect(() => {
    const controller = new AbortController()

    fetch(`/api/blog/${slug}`, { signal: controller.signal })
      .then((res) =>
        res.ok ? (res.json() as Promise<EngagementResponse>) : null
      )
      .then((data) => {
        if (!data?.engagement) return
        setCounts(data.engagement.reactions ?? EMPTY_COUNTS)
        setViews(data.engagement.views ?? 0)
      })
      .catch(() => {})

    return () => controller.abort()
  }, [slug])

  // Recorded separately from the site-wide beacon so per-post totals are real
  // rather than inferred from overall traffic.
  useEffect(() => {
    if (!visitorId) return

    fetch(`/api/blog/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "view", visitorId }),
    })
      .then((res) => (res.ok ? (res.json() as Promise<ViewResponse>) : null))
      .then((data) => {
        if (typeof data?.views === "number") setViews(data.views)
      })
      .catch(() => {})
  }, [slug, visitorId])

  const react = useCallback(
    async (kind: ReactionKind) => {
      if (!visitorId || !counts || pending) return

      const wasActive = active[kind]
      const snapshot = counts

      haptic()
      setPending(kind)
      setActive((prev) => ({ ...prev, [kind]: !wasActive }))
      setCounts({
        ...counts,
        [kind]: Math.max(0, counts[kind] + (wasActive ? -1 : 1)),
      })

      try {
        const res = await fetch(`/api/blog/${slug}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "react", kind, visitorId }),
        })

        if (!res.ok) throw new Error("Reaction failed")

        const data = (await res.json()) as ReactResponse

        setCounts((prev) => ({ ...(prev ?? snapshot), [kind]: data.count }))
        setActive((prev) => ({ ...prev, [kind]: data.active }))

        try {
          if (data.active) {
            localStorage.setItem(localReactionKey(slug, kind), "1")
          } else {
            localStorage.removeItem(localReactionKey(slug, kind))
          }
        } catch {
          // storage blocked — server remains the source of truth
        }
      } catch {
        setCounts(snapshot)
        setActive((prev) => ({ ...prev, [kind]: wasActive }))
      } finally {
        setPending(null)
      }
    },
    [active, counts, pending, slug, visitorId]
  )

  if (!counts) return null

  return (
    <div className="screen-line-top flex flex-wrap items-center justify-between gap-3 px-4 py-4">
      <div className="flex items-center gap-2">
        {REACTIONS.map(({ kind, label, Icon }) => {
          const isActive = active[kind]

          return (
            <button
              key={kind}
              type="button"
              onClick={() => react(kind)}
              disabled={!visitorId || pending !== null}
              aria-pressed={isActive}
              aria-label={`${label} (${counts[kind]})`}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors duration-150",
                "disabled:cursor-not-allowed disabled:opacity-60",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                isActive
                  ? "border-link/40 bg-link/10 text-link"
                  : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "size-3.5 transition-transform duration-200 ease-out",
                  isActive && "fill-current motion-safe:scale-110"
                )}
              />
              <span className="tabular-nums">{counts[kind]}</span>
              <span className="sr-only">{label}</span>
            </button>
          )
        })}
      </div>

      {views !== null && (
        <p className="font-mono text-xs text-muted-foreground tabular-nums">
          {views.toLocaleString()} {views === 1 ? "read" : "reads"}
        </p>
      )}
    </div>
  )
}
