"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useAtomValue } from "jotai"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowUpRightIcon } from "lucide-react"

import { addQueryParams } from "@/utils/url"
import { UTM_PARAMS } from "@/config/site"
import { useMediaQuery } from "@/hooks/use-media-query"
import { PROJECTS } from "@/features/portfolio/data/projects"
import { periodYear } from "@/features/portfolio/lib/format-period"
import { activeProjectAtom } from "@/features/portfolio/state/active-project"

/**
 * A live preview pinned in the right gutter on wide screens. It mirrors the
 * project whose card is currently open — open a tab and its screenshot appears
 * immediately. Only shown while the Projects section is on screen; projects
 * without a screenshot fade the panel out.
 */
export function ProjectShowcase() {
  const isWide = useMediaQuery("(min-width: 84rem)")
  const reduce = useReducedMotion()
  const activeId = useAtomValue(activeProjectAtom)
  const [inView, setInView] = useState(false)
  const [top, setTop] = useState<number>(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isWide) return
    const section = document.getElementById("projects")
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "0px", threshold: 0 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [isWide])

  // Keep the preview vertically centered, but clamped inside the Projects
  // section so it never floats above or below it.
  useEffect(() => {
    if (!isWide) return
    const update = () => {
      const section = document.getElementById("projects")
      const h = ref.current?.offsetHeight ?? 0
      if (!section) return
      const rect = section.getBoundingClientRect()
      const desired = window.innerHeight / 2 - h / 2
      const min = rect.top + 8
      const max = rect.bottom - h - 8
      setTop(Math.max(Math.min(desired, max), Math.min(min, max)))
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [isWide, activeId, inView])

  if (!isWide) return null

  const active =
    inView ? PROJECTS.find((p) => p.id === activeId && p.screenshot) : undefined

  return (
    <div
      ref={ref}
      style={{ top }}
      className="fixed left-[calc(50vw+28rem+2rem)] z-40 hidden w-[min(24rem,calc(50vw-28rem-3.5rem))] min-[84rem]:block"
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
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
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
