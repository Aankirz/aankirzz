"use client"

import { cn } from "@/lib/utils"

import { useTagQuery } from "../hooks/use-search-query"

/**
 * Topic filter as a single ruled strip of mono chips rather than a select. With
 * a handful of tags the options are cheaper to read than to open a menu for.
 */
export function PostTagFilter({ tags }: { tags: string[] }) {
  const { tag: activeTag, setTag } = useTagQuery()

  if (tags.length === 0) return null

  return (
    <div className="screen-line-bottom no-scrollbar flex items-center gap-1.5 overflow-x-auto px-4 py-2.5">
      <TagChip
        isActive={!activeTag}
        onClick={() => setTag(null)}
        aria-label="Show all posts"
      >
        All
      </TagChip>

      {tags.map((tag) => {
        const isActive = tag === activeTag

        return (
          <TagChip
            key={tag}
            isActive={isActive}
            onClick={() => setTag(isActive ? null : tag)}
            aria-pressed={isActive}
          >
            {tag}
          </TagChip>
        )
      })}
    </div>
  )
}

function TagChip({
  isActive,
  className,
  ...props
}: React.ComponentProps<"button"> & { isActive: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "shrink-0 rounded-md px-2 py-1 font-mono text-xs whitespace-nowrap transition-colors duration-150",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        isActive
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}
