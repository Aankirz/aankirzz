import "server-only"

import { unstable_cache } from "next/cache"

import { GITHUB_USERNAME } from "@/config/site"
import type { Activity } from "@/registry/components/contribution-graph"

type GitHubContributionsResponse = {
  total: Record<string, number>
  contributions: Activity[]
}

export type YearContributions = {
  /** Years that have contributions, newest first (e.g. [2026, 2025, ...]). */
  years: number[]
  /** Daily activity grouped by calendar year. */
  byYear: Record<number, Activity[]>
  /** Per-year contribution totals. */
  totals: Record<number, number>
}

// Minimum contributions for a year to be worth offering as a filter.
const MIN_YEAR_CONTRIBUTIONS = 10

const EMPTY: YearContributions = { years: [], byYear: {}, totals: {} }

export const getGitHubContributions = unstable_cache(
  async (): Promise<YearContributions> => {
    let data: GitHubContributionsResponse
    try {
      const res = await fetch(
        `${process.env.GITHUB_CONTRIBUTIONS_API_URL}/v4/${GITHUB_USERNAME}?y=all`
      )
      if (!res.ok) return EMPTY
      data = (await res.json()) as GitHubContributionsResponse
    } catch {
      // Network failure (e.g. during a build with no egress): degrade gracefully.
      return EMPTY
    }

    const byYear: Record<number, Activity[]> = {}
    for (const day of data.contributions ?? []) {
      const year = Number(day.date.slice(0, 4))
      ;(byYear[year] ??= []).push(day)
    }

    const totals: Record<number, number> = {}
    for (const [year, total] of Object.entries(data.total ?? {})) {
      totals[Number(year)] = total
    }

    const years = Object.keys(totals)
      .map(Number)
      .filter((y) => totals[y] >= MIN_YEAR_CONTRIBUTIONS)
      .sort((a, b) => b - a)

    return { years, byYear, totals }
  },
  ["github-contributions"],
  { revalidate: 86400 } // Cache for 1 day (86400 seconds)
)
