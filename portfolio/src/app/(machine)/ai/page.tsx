import type { Metadata } from "next"

import { MachineDocView } from "@/features/portfolio/components/machine-doc-view"
import { ModeToggle } from "@/features/portfolio/components/mode-toggle"
import { USER } from "@/features/portfolio/data/user"
import { buildMachineDoc } from "@/features/portfolio/lib/machine-doc"

export const metadata: Metadata = {
  title: `${USER.displayName} – machine view`,
  description: `Plain-text rendering of ${USER.displayName}'s portfolio, for agents and crawlers.`,
  alternates: {
    canonical: "/ai",
  },
}

export default function MachineViewPage() {
  return (
    <>
      <MachineDocView blocks={buildMachineDoc()} />
      <ModeToggle
        current="Machine"
        className="bg-[#1c1c1c] text-[#f6f6f6] ring-1 ring-white/10"
      />
    </>
  )
}
