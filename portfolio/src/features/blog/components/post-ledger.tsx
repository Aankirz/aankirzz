import type { BlogPostSummary } from "../lib/post-summary"
import { groupByYear } from "../lib/post-summary"
import { PostLead } from "./post-lead"
import { PostRow } from "./post-row"

/**
 * The blog index. A lead slot for the newest (or pinned) post, then the archive
 * as year-ruled ledger rows. Card grids flatten every post to equal weight; this
 * gives the top of the list somewhere to be loud and the tail somewhere to be
 * scannable.
 *
 * `showLead` is off while a search or tag filter is active: promoting an
 * arbitrary result to hero size misrepresents it as the featured post.
 */
export function PostLedger({
  posts,
  showLead = true,
}: {
  posts: BlogPostSummary[]
  showLead?: boolean
}) {
  if (posts.length === 0) {
    return <PostLedgerEmpty />
  }

  const [lead, ...rest] = posts
  const archive = showLead ? rest : posts

  // Entry numbers count down from the newest, so a post's number never shifts
  // as the archive grows. Offsets are resolved up front rather than accumulated
  // during render.
  const groups = groupByYear(archive)
  const groupOffsets = groups.reduce<number[]>((offsets, group, i) => {
    offsets.push(i === 0 ? 0 : offsets[i - 1] + groups[i - 1].posts.length)
    return offsets
  }, [])

  return (
    <div>
      {showLead && <PostLead post={lead} />}

      {groups.map((group, groupIndex) => (
        <section key={group.year} aria-label={`Posts from ${group.year}`}>
          <h2 className="screen-line-bottom bg-background px-4 py-2 font-mono text-xs tracking-wider text-muted-foreground tabular-nums">
            {group.year}
          </h2>

          <ul>
            {group.posts.map((post, index) => (
              <PostRow
                key={post.slug}
                post={post}
                index={archive.length - groupOffsets[groupIndex] - index}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function PostLedgerEmpty() {
  return (
    <div className="screen-line-bottom px-4 py-16 text-center">
      <p className="font-mono text-sm text-muted-foreground">
        No posts match that.
      </p>
      <p className="mt-2 font-reading text-sm text-muted-foreground/70">
        Try a shorter search, or clear the filters.
      </p>
    </div>
  )
}
