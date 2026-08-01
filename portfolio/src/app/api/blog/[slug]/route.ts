import { NextResponse } from "next/server"

import {
  getPostEngagement,
  incrementPostViews,
  isReactionKind,
  isSafeSlug,
  toggleReaction,
} from "@/features/blog/data/post-engagement"

export const runtime = "nodejs"

/** Bounded so a caller can't push an arbitrary-length key into the store. */
const MAX_VISITOR_ID_LENGTH = 64

type RouteContext = { params: Promise<{ slug: string }> }

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params

  if (!isSafeSlug(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 })
  }

  return NextResponse.json({ engagement: await getPostEngagement(slug) })
}

export async function POST(request: Request, { params }: RouteContext) {
  const { slug } = await params

  if (!isSafeSlug(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const { action, kind, visitorId } = (body ?? {}) as Record<string, unknown>

  const safeVisitorId =
    typeof visitorId === "string" &&
    visitorId.length > 0 &&
    visitorId.length <= MAX_VISITOR_ID_LENGTH
      ? visitorId
      : undefined

  if (action === "view") {
    return NextResponse.json({
      views: await incrementPostViews(slug, safeVisitorId),
    })
  }

  if (action === "react") {
    if (!isReactionKind(kind)) {
      return NextResponse.json({ error: "Unknown reaction" }, { status: 400 })
    }

    if (!safeVisitorId) {
      return NextResponse.json({ error: "Missing visitorId" }, { status: 400 })
    }

    const result = await toggleReaction(slug, kind, safeVisitorId)

    if (!result) {
      return NextResponse.json({ error: "Unavailable" }, { status: 503 })
    }

    return NextResponse.json(result)
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 })
}
