import { describe, expect, it } from "vitest"

import type { Activity } from "@/registry/components/contribution-graph"

import { buildRollingWindow, ROLLING_WINDOW_DAYS } from "./contribution-window"

/** A day `offset` days from `from` (negative = earlier). */
function dayAt(from: string, offset: number, count = 0): Activity {
  const date = new Date(`${from}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + offset)

  return {
    date: date.toISOString().slice(0, 10),
    count,
    level: count > 0 ? 1 : 0,
  }
}

const TODAY = new Date("2026-08-02T00:00:00Z")

describe("buildRollingWindow", () => {
  it("ends today and spans a full year", () => {
    const contributions = Array.from({ length: 900 }, (_, i) =>
      dayAt("2026-08-02", -i, 1)
    )

    const window = buildRollingWindow(contributions, TODAY)

    expect(window.end).toBe("2026-08-02")
    expect(window.start).toBe("2025-08-03")
    expect(window.activities).toHaveLength(ROLLING_WINDOW_DAYS)
  })

  it("excludes days outside the window on both sides", () => {
    const contributions = [
      dayAt("2026-08-02", -400, 5), // older than the window
      dayAt("2026-08-02", -10, 5), // inside
      dayAt("2026-08-02", 30, 5), // future padding returned by the API
    ]

    const window = buildRollingWindow(contributions, TODAY)

    expect(window.activities.map((a) => a.date)).toEqual(["2026-07-23"])
    expect(window.total).toBe(5)
  })

  /**
   * The upstream API returns whole calendar years newest-first, so a naive
   * filter yields [Jan..Aug 2026, Aug..Dec 2025] and the graph renders the
   * window back to front.
   */
  it("sorts ascending even when the source is year-descending", () => {
    const contributions = [
      dayAt("2026-08-02", -1, 1),
      dayAt("2026-08-02", -200, 1),
      dayAt("2026-08-02", -300, 1),
    ]

    const dates = buildRollingWindow(contributions, TODAY).activities.map(
      (a) => a.date
    )

    expect(dates).toEqual([...dates].sort())
  })

  it("sums only the counts inside the window", () => {
    const contributions = [
      dayAt("2026-08-02", -500, 99), // outside
      dayAt("2026-08-02", -5, 3),
      dayAt("2026-08-02", -6, 4),
    ]

    expect(buildRollingWindow(contributions, TODAY).total).toBe(7)
  })

  it("returns an empty window rather than throwing when there is no data", () => {
    const window = buildRollingWindow([], TODAY)

    expect(window.activities).toEqual([])
    expect(window.total).toBe(0)
  })
})
