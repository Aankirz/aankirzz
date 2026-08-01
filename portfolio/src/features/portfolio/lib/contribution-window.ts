import type { Activity } from "@/registry/components/contribution-graph"

/**
 * Days in the default view. GitHub profiles show a rolling year ending today
 * rather than a calendar year, so the graph reads the same as the one people
 * already know from the profile page.
 */
export const ROLLING_WINDOW_DAYS = 365

export type ContributionWindow = {
  activities: Activity[]
  total: number
  /** Inclusive ISO date bounds of the window. */
  start: string
  end: string
}

const toISODate = (date: Date) => date.toISOString().slice(0, 10)

/**
 * Slices a rolling year ending on `today` out of the full contribution history.
 *
 * Kept free of `server-only` imports so it stays unit-testable, and takes
 * `today` explicitly so tests are deterministic rather than dependent on the
 * clock.
 *
 * The upstream API returns whole calendar years newest-first and pads the
 * current year out to 31 December, so this has to bound both ends of the range
 * and re-sort ascending; a naive filter would render the window back to front.
 */
export function buildRollingWindow(
  contributions: Activity[],
  today: Date
): ContributionWindow {
  const end = toISODate(today)

  const startDate = new Date(today)
  startDate.setUTCDate(startDate.getUTCDate() - (ROLLING_WINDOW_DAYS - 1))
  const start = toISODate(startDate)

  const activities = contributions
    .filter((day) => day.date >= start && day.date <= end)
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    activities,
    total: activities.reduce((sum, day) => sum + day.count, 0),
    start,
    end,
  }
}
