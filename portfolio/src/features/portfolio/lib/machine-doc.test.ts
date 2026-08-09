import { describe, expect, it } from "vitest"

import { buildMachineDoc } from "@/features/portfolio/lib/machine-doc"

const doc = buildMachineDoc()

const lines = doc.filter((block) => block.kind === "line")

const links = lines.flatMap((line) =>
  line.nodes.filter((node) => typeof node !== "string")
)

const plainText = lines
  .flatMap((line) =>
    line.nodes.map((node) => (typeof node === "string" ? node : node.label))
  )
  .join("\n")

describe("buildMachineDoc", () => {
  it("renders every portfolio section", () => {
    const headings = doc
      .filter((block) => block.kind === "heading")
      .map((block) => block.text)

    expect(headings).toEqual(
      expect.arrayContaining([
        "Contact",
        "Experience",
        "Projects",
        "Tech stack",
        "Education",
        "Awards",
      ])
    )
  })

  it("turns Markdown links into link nodes rather than literal text", () => {
    expect(links.length).toBeGreaterThan(0)
    expect(plainText).not.toMatch(/\]\(/)
  })

  it("leaves no Markdown emphasis markers in the output", () => {
    expect(plainText).not.toContain("**")
  })

  it("gives every link a non-empty label and href", () => {
    for (const link of links) {
      expect(link.label.trim()).not.toBe("")
      expect(link.href.trim()).not.toBe("")
    }
  })
})
