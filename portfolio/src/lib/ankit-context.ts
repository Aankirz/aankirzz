import "server-only"

import { AWARDS } from "@/features/portfolio/data/awards"
import { EDUCATION } from "@/features/portfolio/data/education"
import { EXPERIENCES } from "@/features/portfolio/data/experiences"
import { PROJECTS } from "@/features/portfolio/data/projects"
import { TECH_STACK } from "@/features/portfolio/data/tech-stack"
import { USER } from "@/features/portfolio/data/user"

const oneLine = (s?: string) => (s ?? "").replace(/\s*\n\s*/g, " ").trim()
const period = (p: { start: string; end?: string }) =>
  `${p.start}–${p.end ?? "present"}`

/**
 * Builds a plain-text knowledge base about Ankit from the same data the site
 * renders, so the terminal assistant stays grounded and never invents facts.
 */
export function buildAnkitContext(): string {
  const experience = EXPERIENCES.map((e) => {
    const roles = e.positions
      .map(
        (p) =>
          `  - ${p.title} (${period(p.employmentPeriod)})${
            p.description ? `: ${oneLine(p.description)}` : ""
          }${p.skills?.length ? ` [${p.skills.join(", ")}]` : ""}`
      )
      .join("\n")
    return `${e.companyName}${e.location ? ` — ${e.location}` : ""}:\n${roles}`
  }).join("\n")

  const projects = PROJECTS.map(
    (p) =>
      `  - ${p.title} (${period(p.period)}): ${oneLine(p.description)} [${p.skills.join(", ")}] ${p.link}`
  ).join("\n")

  const education = EDUCATION.map(
    (e) =>
      `  - ${e.school}${e.degree ? `, ${e.degree}` : ""}${
        e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ""
      } (${period(e.period)}). ${oneLine(e.description)}`
  ).join("\n")

  const awards = AWARDS.map(
    (a) => `  - ${a.prize} — ${a.title} (${a.date}): ${oneLine(a.description)}`
  ).join("\n")

  const stack = TECH_STACK.map((t) => t.title).join(", ")

  return [
    `NAME: ${USER.displayName} (${USER.firstName} ${USER.lastName})`,
    `ROLE: ${USER.jobTitle}`,
    `LOCATION: ${USER.address} (timezone ${USER.timeZone})`,
    `SUMMARY: ${oneLine(USER.about)}`,
    `EMAIL: sahuankit453@gmail.com`,
    "",
    `EXPERIENCE:\n${experience}`,
    "",
    `PROJECTS:\n${projects}`,
    "",
    `EDUCATION:\n${education}`,
    "",
    `AWARDS:\n${awards}`,
    "",
    `TECH STACK: ${stack}`,
  ].join("\n")
}
