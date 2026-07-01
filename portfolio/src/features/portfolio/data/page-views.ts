import "server-only"

// Page-view counter backed by Vercel KV / Upstash Redis (REST API). Tracks a
// running total plus per-day buckets so the Insights section can chart views
// over time. Reads the standard env vars set when you connect an Upstash store
// on Vercel; if it isn't configured, everything returns null/empty and the UI
// hides gracefully.
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const KV_TOKEN =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

const TOTAL_KEY = "pageviews"
const dayKey = (iso: string) => `pv:${iso}` // iso = YYYY-MM-DD
const seenKey = (id: string) => `pv:seen:${id.slice(0, 64)}`

// Count each visitor at most once per this window. Reloads and repeat visits
// within a day don't inflate the total; a genuine return the next day counts.
const DEDUP_WINDOW_SECONDS = 60 * 60 * 24

export const isPageViewsConfigured = Boolean(KV_URL && KV_TOKEN)

export type PageViewsPoint = { date: string; views: number }

async function redis<T>(command: unknown[]): Promise<T | null> {
  if (!isPageViewsConfigured) return null
  try {
    const res = await fetch(KV_URL as string, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
    })
    if (!res.ok) return null
    const json = (await res.json()) as { result: T }
    return json.result
  } catch {
    return null
  }
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Records a view, deduplicated per visitor. `SET ... NX` returns "OK" only when
 * the key is newly created, so a repeat visit (reload, second tab, revisit
 * within the window) returns null and we leave the count untouched. Bumps the
 * running total and today's bucket only for a genuinely new visitor.
 */
export async function incrementPageViews(
  visitorId?: string
): Promise<number | null> {
  if (!isPageViewsConfigured) return null

  if (visitorId) {
    const firstSeen = await redis([
      "SET",
      seenKey(visitorId),
      "1",
      "EX",
      DEDUP_WINDOW_SECONDS,
      "NX",
    ])
    if (firstSeen !== "OK") return getPageViews()
  }

  await redis(["INCR", dayKey(todayISO())])
  return redis<number>(["INCR", TOTAL_KEY])
}

/** Running total of all page views. */
export async function getPageViews(): Promise<number | null> {
  const result = await redis<string | number | null>(["GET", TOTAL_KEY])
  if (result === null || result === undefined) return isPageViewsConfigured ? 0 : null
  return Number(result)
}

/** Daily page views for the last `days` days (oldest → newest). */
export async function getPageViewsSeries(
  days = 30
): Promise<PageViewsPoint[]> {
  if (!isPageViewsConfigured) return []

  const dates: string[] = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setUTCDate(now.getUTCDate() - i)
    dates.push(d.toISOString().slice(0, 10))
  }

  const result = await redis<(string | null)[]>([
    "MGET",
    ...dates.map(dayKey),
  ])
  if (!result) return []

  return dates.map((date, i) => ({
    date,
    views: Number(result[i]) || 0,
  }))
}
