"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { useMediaQuery } from "@/hooks/use-media-query"

const SECTIONS = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "stack", label: "Stack" },
  { id: "education", label: "Education" },
  { id: "awards", label: "Awards" },
] as const

export function SectionRail() {
  const isWide = useMediaQuery("(min-width: 80rem)") // only where the gutter exists
  const reduce = useReducedMotion()
  const [active, setActive] = useState<string>(SECTIONS[0].id)
  const [visible, setVisible] = useState(false)

  // Reveal the rail once the visitor scrolls past the first screen (the hero).
  useEffect(() => {
    if (!isWide) return
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [isWide])

  // Highlight the section currently in view.
  useEffect(() => {
    if (!isWide) return
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    )
    if (els.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const onScreen = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (onScreen[0]) setActive(onScreen[0].target.id)
      },
      { rootMargin: "-30% 0% -55% 0%", threshold: 0 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [isWide])

  if (!isWide) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="On this page"
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-[calc(var(--header-height)+--spacing(8))] left-[calc(50vw-28rem-9rem)] z-40 hidden xl:block"
        >
          <ul className="flex flex-col gap-1 border-l border-line pl-3">
            {SECTIONS.map((s) => {
              const isActive = active === s.id
              return (
                <li key={s.id} className="group relative -ml-3 flex items-center">
                  <span
                    className={
                      "absolute left-0 h-4 w-px -translate-x-px transition-colors " +
                      (isActive ? "bg-link" : "bg-transparent")
                    }
                    aria-hidden
                  />
                  <a
                    href={`#${s.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={
                      "pl-3 font-mono text-xs leading-6 transition-colors " +
                      (isActive
                        ? "text-link"
                        : "text-muted-foreground/60 hover:text-foreground")
                    }
                  >
                    {s.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
