import { AwardIcon, MedalIcon, TrophyIcon } from "lucide-react"

import type { Award } from "../types/awards"

export const AWARDS: Award[] = [
  {
    id: "colosseum-renaissance-2024",
    prize: "2nd Prize — Winner ($30,000)",
    title: "Colosseum Renaissance Hackathon (Solana)",
    date: "2024",
    grade: "Hackathon",
    icon: <TrophyIcon />,
    description:
      "- Won $30,000 (2nd Prize) at the global Solana Renaissance Hackathon.",
    referenceLink: "https://solana.com/news/solana-renaissance-winners",
  },
  {
    id: "superteam-dao-2024",
    prize: "Member",
    title: "SuperteamDAO Blockchain Developer Community",
    date: "2024-06",
    grade: "Community",
    icon: <AwardIcon />,
    description:
      "- Selected for the SuperteamDAO blockchain developer community.",
  },
  {
    id: "gsoc-chromium-2023",
    prize: "Contributor",
    title: "Google Summer of Code 2023 (Chromium)",
    date: "2023",
    grade: "Open Source",
    icon: <MedalIcon />,
    description:
      "- Selected as a GSoC contributor for the Chromium organization.",
    referenceLink:
      "https://summerofcode.withgoogle.com/archive/2023/projects/ULtyGXXr",
  },
  {
    id: "dragonhacks-mlh-2022",
    prize: "Runner Up",
    title: "DragonHacks — Major League Hacking",
    date: "2022-05",
    grade: "Hackathon",
    icon: <AwardIcon />,
    description:
      "- Runner Up at DragonHacks (MLH) for the FoodPrint project.",
    referenceLink: "https://devpost.com/software/foodprint-fun",
  },
]
