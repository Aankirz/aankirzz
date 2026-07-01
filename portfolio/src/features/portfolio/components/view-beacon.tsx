"use client"

import { useEffect } from "react"

/**
 * Records one page view per visitor. A persistent id in localStorage survives
 * reloads and tab closes, and the server dedups on it, so the same person is
 * counted once (per day) rather than on every refresh. No-op if storage is
 * blocked or the counter store isn't configured.
 */
export function ViewBeacon() {
  useEffect(() => {
    let visitorId: string
    try {
      visitorId = localStorage.getItem("vid") ?? crypto.randomUUID()
      localStorage.setItem("vid", visitorId)
    } catch {
      return // no storage → skip counting rather than inflate the total
    }

    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId }),
    }).catch(() => {})
  }, [])

  return null
}
