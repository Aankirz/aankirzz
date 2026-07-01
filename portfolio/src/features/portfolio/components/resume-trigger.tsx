"use client"

import { useSetAtom } from "jotai"

import { resumeModalAtom } from "@/features/portfolio/state/resume-modal"

/** Button that opens the embedded resume viewer. Styling comes from the caller. */
export function ResumeTrigger({
  className,
  children,
  "aria-label": ariaLabel = "Resume",
}: {
  className?: string
  children: React.ReactNode
  "aria-label"?: string
}) {
  const setOpen = useSetAtom(resumeModalAtom)
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </button>
  )
}
