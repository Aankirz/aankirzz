"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowUpRightIcon } from "lucide-react"

import { addQueryParams } from "@/utils/url"
import { UTM_PARAMS } from "@/config/site"
import { useMediaQuery } from "@/hooks/use-media-query"
import { PROJECTS } from "@/features/portfolio/data/projects"
import { periodYear } from "@/features/portfolio/lib/format-period"

/**
 * A live preview pinned in the right gutter on wide screens. As the visitor
 * scrolls the Projects section, it crossfades to the screenshot of whichever
 * project is in view — the card stays compact in the column, the picture lives
 * in the space to its right. Projects without a screenshot fade the panel out.
 */
export function ProjectShowcase() {
  const isWide = useMediaQuery("(min-width: 84rem)")
  const reduce = useReducedMotion()
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (!isWide) return
    const els = PROJECTS.map((p) => document.getElementById(`project-${p.id}`))
      .filter((el): el is HTMLElement => el !== null)
    if (els.length === 0) return

    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = (e.target as HTMLElement).dataset.projectId
          if (!id) continue
          if (e.isIntersecting) visible.add(id)
          else visible.delete(id)
        }
        // Topmost visible project wins.
        const topmost = PROJECTS.map((p) => p.id).find((id) => visible.has(id))
        setActiveId(topmost ?? null)
      },
      { rootMargin: "-25% 0% -45% 0%", threshold: 0 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [isWide])

  if (!isWide) return null

  const active = PROJECTS.find((p) => p.id === activeId && p.screenshot)

  return (
    <div
      className="fixed top-1/2 left-[calc(50vw+28rem+2rem)] z-40 hidden w-[min(24rem,calc(50vw-28rem-3.5rem))] -translate-y-1/2 min-[84rem]:block"
      aria-hidden
    >
      <AnimatePresence mode="wait">
        {active && (
          <motion.a
            key={active.id}
            href={addQueryParams(active.link, UTM_PARAMS)}
            target="_blank"
            rel="noopener"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="group pointer-events-auto block"
          >
            <p className="mb-2 font-mono text-xs text-muted-foreground">
              <span className="text-link">// </span>
              preview
            </p>

            <div className="overflow-hidden rounded-xl border border-line shadow-xl transition-colors group-hover:border-link">
              <Image
                src={active.screenshot!}
                alt={`${active.title} screenshot`}
                width={1280}
                height={800}
                quality={90}
                className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                unoptimized
              />
            </div>

            <div className="mt-2.5 flex items-center justify-between font-mono text-xs">
              <span className="text-foreground">{active.title}</span>
              <span className="flex items-center gap-1 text-muted-foreground transition-colors group-hover:text-link">
                {periodYear(active.period.start)}
                <ArrowUpRightIcon className="size-3.5" />
              </span>
            </div>
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  )
}
