import "server-only"

// Per-post views and reactions, backed by the same Vercel KV / Upstash Redis
// store the site-wide view counter already uses (see
// features/portfolio/data/page-views.ts). No new service: only new key
// prefixes. If the store isn't configured every read returns null/zero and the
// UI hides itself, so local dev and unconfigured previews stay clean.
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const KV_TOKEN =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

export const isEngagementConfigured = Boolean(KV_URL && KV_TOKEN)

export const REACTION_KINDS = ["like", "heart"] as const
export type ReactionKind = (typeof REACTION_KINDS)[number]

export type PostEngagement = {
  views: number
  reactions: Record<ReactionKind, number>
}

export function isReactionKind(value: unknown): value is ReactionKind {
  return (
    typeof value === "string" &&
    (REACTION_KINDS as readonly string[]).includes(value)
  )
}

/**
 * Slugs come from the URL, and Redis keys are built by concatenation, so an
 * unconstrained slug could address arbitrary keys. Post slugs are filenames, so
 * this is exactly the character set they can legitimately contain.
 */
const SAFE_SLUG = /^[a-z0-9][a-z0-9-]{0,127}$/i

export function isSafeSlug(slug: string): boolean {
  return SAFE_SLUG.test(slug)
}

const viewsKey = (slug: string) => `blog:views:${slug}`
const reactionKey = (slug: string, kind: ReactionKind) =>
  `blog:react:${slug}:${kind}`
const viewSeenKey = (slug: string, id: string) =>
  `blog:seen:${slug}:${id.slice(0, 64)}`
const reactionSeenKey = (slug: string, kind: ReactionKind, id: string) =>
  `blog:reacted:${slug}:${kind}:${id.slice(0, 64)}`

/** Count a reader once per post per day. */
const VIEW_DEDUP_SECONDS = 60 * 60 * 24

/** One reaction per kind per visitor, effectively permanent. */
const REACTION_DEDUP_SECONDS = 60 * 60 * 24 * 365

async function redis<T>(command: unknown[]): Promise<T | null> {
  if (!isEngagementConfigured) return null

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

const toCount = (value: unknown): number => Number(value) || 0

export async function getPostEngagement(
  slug: string
): Promise<PostEngagement | null> {
  if (!isEngagementConfigured || !isSafeSlug(slug)) return null

  const result = await redis<(string | null)[]>([
    "MGET",
    viewsKey(slug),
    ...REACTION_KINDS.map((kind) => reactionKey(slug, kind)),
  ])

  if (!result) return null

  const [views, ...reactionCounts] = result

  return {
    views: toCount(views),
    reactions: Object.fromEntries(
      REACTION_KINDS.map((kind, i) => [kind, toCount(reactionCounts[i])])
    ) as Record<ReactionKind, number>,
  }
}

/**
 * Records a view unless this visitor already counted for this post today.
 * `SET ... NX` returns "OK" only when the key was newly created, so a reload
 * leaves the count untouched.
 */
export async function incrementPostViews(
  slug: string,
  visitorId?: string
): Promise<number | null> {
  if (!isEngagementConfigured || !isSafeSlug(slug)) return null

  if (visitorId) {
    const firstSeen = await redis([
      "SET",
      viewSeenKey(slug, visitorId),
      "1",
      "EX",
      VIEW_DEDUP_SECONDS,
      "NX",
    ])

    if (firstSeen !== "OK") {
      return redis<number>(["GET", viewsKey(slug)]).then(toCount)
    }
  }

  return redis<number>(["INCR", viewsKey(slug)])
}

/**
 * Toggles this visitor's reaction. Returns the new count, or null when the
 * store is unavailable so the client can roll its optimistic update back.
 */
export async function toggleReaction(
  slug: string,
  kind: ReactionKind,
  visitorId: string
): Promise<{ count: number; active: boolean } | null> {
  if (!isEngagementConfigured || !isSafeSlug(slug)) return null

  const seenKey = reactionSeenKey(slug, kind, visitorId)
  const claimed = await redis([
    "SET",
    seenKey,
    "1",
    "EX",
    REACTION_DEDUP_SECONDS,
    "NX",
  ])

  // Already reacted: withdraw it, so the control is a real toggle rather than a
  // one-way button that silently ignores the second press.
  if (claimed !== "OK") {
    await redis(["DEL", seenKey])
    const count = await redis<number>(["DECR", reactionKey(slug, kind)])

    // A DECR below zero means the counter and the dedup keys drifted (expired
    // seen-keys, a flushed store). Clamp rather than render a negative count.
    if (count !== null && count < 0) {
      await redis(["SET", reactionKey(slug, kind), "0"])
      return { count: 0, active: false }
    }

    return { count: toCount(count), active: false }
  }

  const count = await redis<number>(["INCR", reactionKey(slug, kind)])
  return { count: toCount(count), active: true }
}
