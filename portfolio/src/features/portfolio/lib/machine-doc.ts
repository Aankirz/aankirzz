import { SITE_INFO } from "@/config/site"
import { AWARDS } from "@/features/portfolio/data/awards"
import { EDUCATION } from "@/features/portfolio/data/education"
import { EXPERIENCES } from "@/features/portfolio/data/experiences"
import { PROJECTS } from "@/features/portfolio/data/projects"
import { SOCIAL } from "@/features/portfolio/data/social-links"
import { TECH_STACK } from "@/features/portfolio/data/tech-stack"
import { USER } from "@/features/portfolio/data/user"

/** A run of plain text, or a link rendered as `[LABEL](href)`. */
export type MachineNode = string | { label: string; href: string }

export type MachineBlock =
  | { kind: "heading"; text: string }
  | { kind: "line"; nodes: MachineNode[]; dim?: boolean; indent?: number }
  | { kind: "blank" }

const blank = (): MachineBlock => ({ kind: "blank" })
const heading = (text: string): MachineBlock => ({ kind: "heading", text })

function line(
  nodes: MachineNode | MachineNode[],
  options: { dim?: boolean; indent?: number } = {}
): MachineBlock {
  return {
    kind: "line",
    nodes: Array.isArray(nodes) ? nodes : [nodes],
    ...options,
  }
}

/**
 * Markdown links and emphasis are authored for the human view. The machine view
 * has no rich text, so inline links become `[label](href)` nodes and the
 * remaining `**`/`*` markers are stripped rather than shown as literal asterisks.
 */
const MARKDOWN_LINK = /\[([^\]]+)\]\(([^)]+)\)/g

/** Unwraps paired `**bold**` / `*italic*`; a lone asterisk is left as typed. */
function stripEmphasis(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1")
}

function parseInline(text: string): MachineNode[] {
  // Emphasis is stripped from the whole line first: `**[label](href)**` puts
  // each marker in a different segment, so per-segment stripping never pairs.
  const source = stripEmphasis(text)
  const nodes: MachineNode[] = []
  let cursor = 0

  for (const match of source.matchAll(MARKDOWN_LINK)) {
    const [full, label, href] = match
    const before = source.slice(cursor, match.index)
    if (before) nodes.push(before)
    nodes.push({ label, href })
    cursor = match.index + full.length
  }

  const rest = source.slice(cursor)
  if (rest) nodes.push(rest)

  return nodes.length > 0 ? nodes : [""]
}

/** Turns an authored Markdown block into one machine line per source line. */
function prose(text: string, indent = 0): MachineBlock[] {
  return text
    .split("\n")
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((raw) => line(parseInline(raw), { indent }))
}

function period({ start, end }: { start: string; end?: string }): string {
  return `${start} - ${end ?? "Present"}`
}

function decodeB64(value: string): string {
  return Buffer.from(value, "base64").toString("utf8")
}

function profileBlocks(): MachineBlock[] {
  const socials = Object.values(SOCIAL)

  return [
    heading(USER.displayName.toUpperCase()),
    line(`${USER.jobTitle} - ${USER.address} - ${USER.timeZone}`, {
      dim: true,
    }),
    line(USER.pronouns, { dim: true }),
    blank(),
    ...prose(USER.bio),
    blank(),
    ...prose(USER.about),
    blank(),
    heading("Contact"),
    line(
      {
        label: decodeB64(USER.emailB64),
        href: `mailto:${decodeB64(USER.emailB64)}`,
      },
      { indent: 1 }
    ),
    line({ label: USER.website, href: USER.website }, { indent: 1 }),
    ...socials.map((social) =>
      line([`${social.title}: `, { label: social.handle, href: social.href }], {
        indent: 1,
      })
    ),
  ]
}

function experienceBlocks(): MachineBlock[] {
  return EXPERIENCES.flatMap((experience) => [
    line(
      experience.companyWebsite
        ? [
            { label: experience.companyName, href: experience.companyWebsite },
            experience.isCurrentEmployer ? "  [current]" : "",
          ]
        : [experience.companyName]
    ),
    ...(experience.location
      ? [
          line(
            [
              experience.location,
              experience.locationType ? ` (${experience.locationType})` : "",
            ],
            { dim: true, indent: 1 }
          ),
        ]
      : []),
    ...experience.positions.flatMap((position) => [
      line(
        [
          position.title,
          position.employmentType ? ` - ${position.employmentType}` : "",
          ` - ${period(position.employmentPeriod)}`,
        ],
        { indent: 1 }
      ),
      ...(position.description ? prose(position.description, 2) : []),
      ...(position.skills?.length
        ? [line(position.skills.join(", "), { dim: true, indent: 2 })]
        : []),
    ]),
    blank(),
  ])
}

function projectBlocks(): MachineBlock[] {
  return PROJECTS.flatMap((project) => [
    line([
      { label: project.title, href: project.link },
      ` - ${period(project.period)}`,
    ]),
    ...(project.description ? prose(project.description, 1) : []),
    ...(project.skills.length
      ? [line(project.skills.join(", "), { dim: true, indent: 1 })]
      : []),
    blank(),
  ])
}

function techStackBlocks(): MachineBlock[] {
  const byCategory = new Map<string, string[]>()

  for (const tech of TECH_STACK) {
    for (const category of tech.categories) {
      byCategory.set(category, [
        ...(byCategory.get(category) ?? []),
        tech.title,
      ])
    }
  }

  return [...byCategory].map(([category, titles]) =>
    line(`${category}: ${titles.join(", ")}`, { indent: 1 })
  )
}

function educationBlocks(): MachineBlock[] {
  return EDUCATION.flatMap((entry) => [
    line(`${entry.school} - ${period(entry.period)}`),
    ...(entry.degree || entry.fieldOfStudy
      ? [
          line([entry.degree, entry.fieldOfStudy].filter(Boolean).join(", "), {
            indent: 1,
          }),
        ]
      : []),
    ...(entry.description ? prose(entry.description, 1) : []),
    blank(),
  ])
}

function awardBlocks(): MachineBlock[] {
  return AWARDS.flatMap((award) => [
    line(
      award.referenceLink
        ? [
            `${award.prize} - `,
            { label: award.title, href: award.referenceLink },
          ]
        : [`${award.prize} - ${award.title}`]
    ),
    line(`${award.date} - ${award.grade}`, { dim: true, indent: 1 }),
    ...(award.description ? prose(award.description, 1) : []),
    blank(),
  ])
}

/**
 * The portfolio rendered for machines: the same data the human view shows, as
 * a flat, scrapeable text document. Built from the data layer rather than the
 * components, so the two views cannot drift apart on content.
 */
export function buildMachineDoc(): MachineBlock[] {
  return [
    line({ label: SITE_INFO.url, href: SITE_INFO.url }),
    blank(),
    ...profileBlocks(),
    blank(),
    heading("Experience"),
    ...experienceBlocks(),
    heading("Projects"),
    ...projectBlocks(),
    heading("Tech stack"),
    ...techStackBlocks(),
    blank(),
    heading("Education"),
    ...educationBlocks(),
    heading("Awards"),
    ...awardBlocks(),
  ]
}
