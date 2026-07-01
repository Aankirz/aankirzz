"use client"

import { useEffect } from "react"

import { useClickSound } from "@/hooks/soundcn/use-click-sound"

// Elements that should click when activated. Kept broad but intentional:
// buttons, links, accordion/collapsible triggers, tabs, switches, summaries.
const INTERACTIVE_SELECTOR = [
  "button",
  "a[href]",
  "summary",
  "label",
  '[role="button"]',
  '[role="tab"]',
  '[role="switch"]',
  '[role="menuitem"]',
  '[data-slot="collapsible-trigger"]',
].join(",")

// The theme toggle plays its own click — skip it so it doesn't double up.
const SKIP_SELECTOR = '[aria-label="Toggle mode"]'

/**
 * Plays a soft click on every interactive activation, site-wide. A single
 * delegated listener instead of wiring sound into every component. Honors
 * reduced-motion via useClickSound (silent when the user prefers reduced
 * motion). ponytail: one listener, no per-component plumbing.
 */
export function InteractionSounds() {
  const [click] = useClickSound()

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target
      if (!(target instanceof Element)) return
      const hit = target.closest(INTERACTIVE_SELECTOR)
      if (!hit || hit.closest(SKIP_SELECTOR)) return
      if (hit.hasAttribute("disabled") || hit.getAttribute("aria-disabled") === "true")
        return
      click()
    }

    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [click])

  return null
}
