import { describe, expect, it } from "vitest"

import { countWords, readingTimeMinutes } from "./reading-time"

describe("countWords", () => {
  it("counts plain prose", () => {
    expect(countWords("one two three four five")).toBe(5)
  })

  it("ignores fenced code blocks", () => {
    const mdx = "intro words here\n\n```ts\nconst a = 1\nconst b = 2\n```\n"
    expect(countWords(mdx)).toBe(3)
  })

  it("ignores JSX components and imports", () => {
    const mdx =
      'import { Callout } from "x"\n\n<Callout>hi</Callout>\n\nreal prose'
    expect(countWords(mdx)).toBe(3)
  })

  it("keeps link text but drops the URL", () => {
    expect(countWords("see [the docs](https://example.com/a/b)")).toBe(3)
  })

  it("returns zero for an empty body", () => {
    expect(countWords("   \n\n  ")).toBe(0)
  })
})

describe("readingTimeMinutes", () => {
  it("never reports less than one minute", () => {
    expect(readingTimeMinutes("hi")).toBe(1)
  })

  it("scales with word count", () => {
    expect(readingTimeMinutes("word ".repeat(1100))).toBe(5)
  })
})
