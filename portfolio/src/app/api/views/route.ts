import { NextResponse } from "next/server"

import {
  getPageViews,
  incrementPageViews,
} from "@/features/portfolio/data/page-views"

export const runtime = "nodejs"

export async function GET() {
  return NextResponse.json({ views: await getPageViews() })
}

export async function POST(request: Request) {
  let visitorId: string | undefined
  try {
    const body = (await request.json()) as { visitorId?: unknown }
    if (typeof body.visitorId === "string") visitorId = body.visitorId
  } catch {
    // no/invalid body — fall through and count without a dedup id
  }
  return NextResponse.json({ views: await incrementPageViews(visitorId) })
}
