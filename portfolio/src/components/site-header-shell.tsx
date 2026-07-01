"use client"

import { useEffect, useState } from "react"

// The morphing inner container: full-bleed at the top of the page, contracting
// to the content column once the visitor scrolls. Isolated as a client
// component so SiteHeader can stay a server component (and keep rendering
// async server children like NavItemGitHub).
export function SiteHeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      style={{ maxWidth: scrolled ? "56rem" : "100%" }}
      className="screen-line-top screen-line-bottom mx-auto flex h-(--header-h) items-center justify-between gap-2 border-x border-line px-2 transition-[max-width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] after:z-1 after:transition-[background-color] sm:gap-4"
    >
      {children}
    </div>
  )
}
