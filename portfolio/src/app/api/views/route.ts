import { NextResponse } from "next/server"

import {
  getPageViews,
  incrementPageViews,
} from "@/features/portfolio/data/page-views"

export const runtime = "nodejs"

export async function GET() {
  return NextResponse.json({ views: await getPageViews() })
}

export async function POST() {
  return NextResponse.json({ views: await incrementPageViews() })
}
