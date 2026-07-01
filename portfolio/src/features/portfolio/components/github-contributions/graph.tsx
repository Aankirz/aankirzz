"use client"

import { use, useState } from "react"
import { format } from "date-fns"
import { LoaderIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/registry/components/contribution-graph"
import type { YearContributions } from "@/features/portfolio/data/github-contributions"

export function GitHubContributionGraph({
  contributions,
}: {
  contributions: Promise<YearContributions>
}) {
  const { years, byYear, totals } = use(contributions)

  const currentYear = new Date().getFullYear()
  const initialYear = years.includes(currentYear) ? currentYear : years[0]
  const [year, setYear] = useState(initialYear)

  // Graceful empty state when the contributions API is unreachable.
  if (years.length === 0) {
    return (
      <div className="flex h-45 w-full items-center justify-center px-4 text-sm text-muted-foreground">
        GitHub contributions are unavailable right now.
      </div>
    )
  }

  const data = byYear[year] ?? byYear[initialYear] ?? []

  return (
    <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start sm:gap-4">
      {/* Graph — scrolls horizontally on narrow screens like GitHub does. */}
      <div className="-mx-4 min-w-0 flex-1 overflow-x-auto px-4 sm:mx-0 sm:overflow-x-visible sm:px-0">
        <ContributionGraph
          className="gap-4 py-1"
          data={data}
          blockSize={12}
          blockMargin={2}
          blockRadius={0}
          aria-label="GitHub Contributions Graph"
        >
        <ContributionGraphCalendar
          className="px-4 **:data-[slot=month-labels]:text-muted-foreground"
          title="GitHub Contributions"
          aria-hidden
        >
          {({ activity, dayIndex, weekIndex }) => (
            <Tooltip>
              <TooltipTrigger
                render={
                  <g>
                    <ContributionGraphBlock
                      activity={activity}
                      dayIndex={dayIndex}
                      weekIndex={weekIndex}
                    />
                  </g>
                }
              />
              <TooltipContent className="font-sans">
                <p>
                  {activity.count} contribution{activity.count > 1 ? "s" : null}{" "}
                  on {format(new Date(activity.date), "dd.MM.yyyy")}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </ContributionGraphCalendar>

          <ContributionGraphFooter className="gap-4 leading-none">
            <ContributionGraphTotalCount>
              {() => (
                <div className="text-muted-foreground">
                  {(totals[year] ?? 0).toLocaleString("en")} contributions in{" "}
                  {year}.
                </div>
              )}
            </ContributionGraphTotalCount>

            <ContributionGraphLegend aria-hidden />
          </ContributionGraphFooter>
        </ContributionGraph>
      </div>

      {/* Year selector — vertical on the right (GitHub-style), wraps on mobile.
          Ghost buttons that match the theme-toggle look. */}
      {years.length > 1 && (
        <div
          className="flex shrink-0 gap-1 max-sm:flex-wrap sm:flex-col"
          role="group"
          aria-label="Filter contributions by year"
        >
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setYear(y)}
              aria-pressed={y === year}
              className={cn(
                "cursor-pointer rounded-md px-2 py-1 text-center font-mono text-xs leading-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-link focus-visible:outline-none sm:w-14 sm:text-left",
                y === year
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {y}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function GitHubContributionFallback() {
  return (
    <div className="flex h-45 w-full items-center justify-center">
      <LoaderIcon className="animate-spin text-muted-foreground" />
    </div>
  )
}
