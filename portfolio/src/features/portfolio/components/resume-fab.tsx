"use client"

import { useEffect, useState } from "react"
import { useSetAtom } from "jotai"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { FileTextIcon } from "lucide-react"

import { resumeModalAtom } from "@/features/portfolio/state/resume-modal"

// How close to the page bottom (px) before the label reveals.
const BOTTOM_THRESHOLD = 240

/**
 * Floating resume button. Icon-only while scrolling; once the visitor reaches
 * the bottom of the page it expands to reveal an "Open resume" label. Opens the
 * embedded resume viewer.
 */
export function ResumeFab() {
  const setOpen = useSetAtom(resumeModalAtom)
  const reduce = useReducedMotion()
  const [atBottom, setAtBottom] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.innerHeight + window.scrollY
      setAtBottom(
        scrolled >= document.documentElement.scrollHeight - BOTTOM_THRESHOLD
      )
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Open resume"
      className="group fixed bottom-[calc(--spacing(4)+env(safe-area-inset-bottom,0))] left-4 z-60 flex items-center rounded-xl border border-line bg-background/95 py-2 pr-2.5 pl-2.5 shadow-lg backdrop-blur transition-colors hover:border-link focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <FileTextIcon className="size-4.5 shrink-0 text-foreground transition-colors group-hover:text-link" />
      <AnimatePresence initial={false}>
        {atBottom && (
          <motion.span
            initial={reduce ? { opacity: 0 } : { opacity: 0, width: 0 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, width: "auto" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, width: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden whitespace-nowrap"
          >
            <span className="pr-0.5 pl-2 font-mono text-sm text-foreground">
              Open resume
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
