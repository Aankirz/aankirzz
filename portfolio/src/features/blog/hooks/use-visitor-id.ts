"use client"

import { useSyncExternalStore } from "react"

/**
 * The same persistent id the site-wide view beacon uses, so a reader counts as
 * one person across both counters. Returns null when storage is blocked
 * (private mode, cookie-blocking extensions) rather than minting a throwaway id
 * per load, which would let one reader inflate every counter on refresh.
 *
 * Read through useSyncExternalStore rather than an effect: localStorage does not
 * exist during SSR, and this keeps the server and hydration snapshots explicitly
 * null instead of mismatching on the first client render.
 */

let cachedVisitorId: string | null = null
let hasResolved = false

function getSnapshot(): string | null {
  // Cached because getSnapshot must be referentially stable across renders.
  if (hasResolved) return cachedVisitorId

  hasResolved = true
  try {
    const stored = localStorage.getItem("vid") ?? crypto.randomUUID()
    localStorage.setItem("vid", stored)
    cachedVisitorId = stored
  } catch {
    cachedVisitorId = null
  }

  return cachedVisitorId
}

/** The id never changes within a session, so there is nothing to subscribe to. */
const subscribe = () => () => {}

const getServerSnapshot = () => null

export function useVisitorId(): string | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
