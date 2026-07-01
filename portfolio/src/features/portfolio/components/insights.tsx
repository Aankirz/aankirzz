import { cn } from "@/lib/utils"
import Grid from "@/components/charts/grid"
import LineChart, { Line } from "@/components/charts/line-chart"
import { ChartTooltip } from "@/components/charts/tooltip"
import {
  Panel,
  PanelHeader,
  PanelTitle,
} from "@/features/portfolio/components/panel"
import { PanelTitleCopy } from "@/features/portfolio/components/panel-title-copy"
import {
  getPageViews,
  getPageViewsSeries,
} from "@/features/portfolio/data/page-views"

const ID = "insights"

export async function Insights() {
  const [total, series] = await Promise.all([
    getPageViews(),
    getPageViewsSeries(30),
  ])

  // Only show once the view counter is wired up (series is empty otherwise).
  if (series.length === 0) {
    return null
  }

  const totalViews = total ?? 0

  const today = series[series.length - 1]?.views ?? 0
  const last7 = series.slice(-7).reduce((sum, p) => sum + p.views, 0)
  const peak = Math.max(...series.map((p) => p.views))

  return (
    <Panel id={ID}>
      <PanelHeader>
        <PanelTitle>
          <a href={`#${ID}`}>Insights</a>
          <PanelTitleCopy id={ID} />
        </PanelTitle>
      </PanelHeader>

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-2 md:grid-cols-4">
          <div className="border-r border-line" />
          <div className="border-r border-line max-md:hidden" />
          <div className="border-r border-line max-md:hidden" />
        </div>

        <dl className="grid grid-cols-2 md:grid-cols-4">
          <Metric>
            <MetricLabel>Total views</MetricLabel>
            <MetricValue>{totalViews.toLocaleString()}</MetricValue>
          </Metric>
          <Metric>
            <MetricLabel>Today</MetricLabel>
            <MetricValue>{today.toLocaleString()}</MetricValue>
          </Metric>
          <Metric>
            <MetricLabel>Last 7 days</MetricLabel>
            <MetricValue>{last7.toLocaleString()}</MetricValue>
          </Metric>
          <Metric>
            <MetricLabel>Peak day</MetricLabel>
            <MetricValue>{peak.toLocaleString()}</MetricValue>
          </Metric>
        </dl>
      </div>

      <figure>
        <LineChart
          className="sm:aspect-3/1!"
          data={series}
          margin={{ top: 16, right: 32, bottom: 40, left: 32 }}
        >
          <Grid horizontal />
          <Line dataKey="views" stroke="var(--link)" strokeWidth={2} />
          <ChartTooltip rowLabels={{ views: "Page views" }} />
        </LineChart>

        <figcaption className="pointer-events-none absolute right-2 bottom-2 bg-background font-mono text-xs leading-none text-zinc-400 select-none sm:right-4 dark:text-zinc-700">
          FIG_002
        </figcaption>
      </figure>
    </Panel>
  )
}

function Metric({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="metric"
      className={cn(
        "flex flex-col gap-2 p-4",
        "max-sm:nth-[2n+1]:screen-line-bottom sm:nth-[4n+1]:screen-line-bottom",
        className
      )}
      {...props}
    />
  )
}

function MetricLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <dt
      data-slot="metric-label"
      className={cn("text-sm leading-none text-muted-foreground", className)}
      {...props}
    />
  )
}

function MetricValue({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <dd
      data-slot="metric-value"
      className={cn(
        "text-lg leading-none font-semibold tabular-nums",
        className
      )}
      {...props}
    />
  )
}

export function InsightsSkeleton() {
  return <Panel className="h-90.75" />
}
