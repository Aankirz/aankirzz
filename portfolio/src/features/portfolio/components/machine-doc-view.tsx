import { cn } from "@/lib/utils"
import type {
  MachineBlock,
  MachineNode,
} from "@/features/portfolio/lib/machine-doc"

/** Characters of left padding per indent level. */
const INDENT_CH = 2

/** Terminal palette. Fixed, not themed: the machine view is always dark. */
const PALETTE = [
  "[--machine-bg:#101010]",
  "[--machine-fg:#f6f6f6]",
  "[--machine-dim:#6f6f6f]",
  "[--machine-mark:#2a2a2a]",
].join(" ")

const LINK_LABEL =
  "bg-(--machine-mark) px-px text-(color:--machine-fg) hover:bg-(--machine-fg) hover:text-(color:--machine-bg)"

// Plain anchors throughout: the machine view is a document to be read and
// scraped, so it has no need for client-side routing.
function MachineLink({ label, href }: { label: string; href: string }) {
  const isExternal = /^https?:/.test(href)

  return (
    <span>
      <a
        href={href}
        className={LINK_LABEL}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        [{label}]
      </a>
      <span className="text-(color:--machine-dim)">({href})</span>
    </span>
  )
}

function renderNode(node: MachineNode, index: number) {
  if (typeof node === "string") return <span key={index}>{node}</span>
  return <MachineLink key={index} label={node.label} href={node.href} />
}

function Block({ block }: { block: MachineBlock }) {
  if (block.kind === "blank") return <div aria-hidden>&nbsp;</div>

  if (block.kind === "heading") {
    return <div className="text-(color:--machine-fg)">{block.text}</div>
  }

  return (
    <div
      // Indent as padding, not literal spaces, so wrapped lines stay aligned
      // with the first character instead of falling back to the left rule.
      style={{ paddingLeft: `${(block.indent ?? 0) * INDENT_CH}ch` }}
      className={cn(
        "break-words whitespace-pre-wrap",
        block.dim ? "text-(color:--machine-dim)" : "text-(color:--machine-fg)"
      )}
    >
      {block.nodes.map(renderNode)}
    </div>
  )
}

/**
 * The machine view: one narrow monospace column on a fixed dark canvas,
 * deliberately outside the site's light/dark theme. Same content as the human
 * view with every affordance removed.
 */
export function MachineDocView({ blocks }: { blocks: MachineBlock[] }) {
  return (
    <div className={cn("min-h-dvh bg-(--machine-bg) py-16", PALETTE)}>
      <div className="mx-auto w-full max-w-[72ch] border-x border-(--machine-mark) px-4 pb-24 font-mono text-[13px]/[1.55] text-(color:--machine-fg)">
        {blocks.map((block, index) => (
          <Block key={index} block={block} />
        ))}
      </div>
    </div>
  )
}
