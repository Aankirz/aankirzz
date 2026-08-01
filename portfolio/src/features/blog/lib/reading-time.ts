/** Average adult silent reading speed for technical prose. */
const WORDS_PER_MINUTE = 220

/**
 * Strips the parts of an MDX body a reader doesn't actually read at prose speed
 * (fenced code, JSX components, frontmatter-free imports, link/image URLs) so a
 * post that is mostly code snippets isn't reported as a 20 minute read.
 */
function toReadableText(mdx: string): string {
  return mdx
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/^import\s.+$/gm, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~|-]/g, " ")
}

export function countWords(mdx: string): number {
  const text = toReadableText(mdx).trim()
  return text ? text.split(/\s+/).length : 0
}

/** Whole minutes, never zero: a one-line post is still "1 min read". */
export function readingTimeMinutes(mdx: string): number {
  return Math.max(1, Math.round(countWords(mdx) / WORDS_PER_MINUTE))
}
