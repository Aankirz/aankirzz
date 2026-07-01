"use client"

import { useEffect } from "react"

/**
 * Records one page view per browser session. Fires a single POST to the views
 * counter, guarded by sessionStorage so refreshes within a session don't
 * inflate the count. No-op if the counter store isn't configured.
 */
export function ViewBeacon() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("pv")) return
      sessionStorage.setItem("pv", "1")
    } catch {
      // sessionStorage unavailable (private mode) — still count the view once.
    }
    fetch("/api/views", { method: "POST" }).catch(() => {})
  }, [])

  return null
}
