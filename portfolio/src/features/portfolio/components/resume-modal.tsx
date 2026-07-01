"use client"

import { useEffect } from "react"
import { useAtom } from "jotai"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowUpRightIcon, XIcon } from "lucide-react"

import { RESUME_EMBED_URL, RESUME_URL } from "@/config/site"
import { resumeModalAtom } from "@/features/portfolio/state/resume-modal"

/** Embedded resume viewer — shows the Google Drive preview in a modal. */
export function ResumeModal() {
  const [open, setOpen] = useAtom(resumeModalAtom)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [open, setOpen])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-label="Resume"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex h-full max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-line bg-background shadow-2xl"
          >
            <header className="flex shrink-0 items-center justify-between border-b border-line px-4 py-2.5">
              <p className="font-mono text-sm text-foreground">
                <span className="mr-1.5 text-link">❯</span>
                resume.pdf
              </p>
              <div className="flex items-center gap-1">
                <a
                  href={RESUME_URL}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-1 rounded-md px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-link focus-visible:outline-none"
                >
                  Open in Drive
                  <ArrowUpRightIcon className="size-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close resume"
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-link focus-visible:outline-none"
                >
                  <XIcon className="size-4.5" />
                </button>
              </div>
            </header>

            <iframe
              src={RESUME_EMBED_URL}
              title="Ankit Kiran resume"
              className="min-h-0 flex-1 bg-muted"
              allow="autoplay"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
