/**
 * Reading progress, drawn on the article's own top hairline instead of as a
 * separate bar. CSS scroll-driven animation only: no scroll listener, no client
 * component, and it degrades to an inert rule where animation-timeline is
 * unsupported.
 */
export function ReadingProgress() {
  return (
    <div className="sticky top-(--header-height) z-30 h-px w-full" aria-hidden>
      <div className="reading-progress" />
    </div>
  )
}
