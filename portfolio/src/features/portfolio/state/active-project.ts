import { atom } from "jotai"

import { PROJECTS } from "@/features/portfolio/data/projects"

/**
 * Id of the project whose card is currently open. Drives the right-gutter
 * screenshot showcase so the preview reflects the open tab, not scroll
 * position. Initialised to the default-expanded project.
 */
export const activeProjectAtom = atom<string | null>(
  PROJECTS.find((p) => p.isExpanded)?.id ?? null
)
