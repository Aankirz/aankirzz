import type { Education } from "@/features/portfolio/types/education"

export const EDUCATION: Education[] = [
  {
    id: "nit-rourkela",
    school: "National Institute of Technology, Rourkela",
    logo: "/companies/nitrkl.png",
    degree: "B.Tech",
    fieldOfStudy: "Chemical Engineering",
    period: {
      start: "07.2021",
      end: "05.2025",
    },
    description: `- CGPA: 7.70
- Active in competitive programming and open-source; selected for Google Summer of Code 2023 (Chromium).`,
    skills: [
      "C++",
      "Java",
      "Python",
      "DSA",
      "Operating Systems",
      "Computer Networks",
    ],
  },
  {
    id: "army-public-school",
    school: "Army Public School, Gopalpur",
    fieldOfStudy: "Class XII (CBSE)",
    period: {
      start: "2019",
      end: "2020",
    },
    description: `- Scored 94.4% in Class XII.`,
  },
]
