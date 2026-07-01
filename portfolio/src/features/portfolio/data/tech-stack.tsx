import {
  BotIcon,
  BoxIcon,
  CloudIcon,
  CodeIcon,
  ContainerIcon,
  DatabaseIcon,
  NetworkIcon,
  ServerIcon,
  ShieldIcon,
  TestTubeIcon,
} from "lucide-react"

import {
  JsIcon,
  ReactIcon,
  TailwindCssIcon,
  TsIcon,
  VercelIcon,
} from "@/components/icons"

import type { TechStack } from "../types/tech-stack"

export const TECH_STACK: TechStack[] = [
  // Languages
  {
    key: "python",
    title: "Python",
    href: "https://www.python.org",
    icon: <CodeIcon />,
    categories: ["Languages"],
  },
  {
    key: "typescript",
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
    icon: <TsIcon />,
    categories: ["Languages"],
  },
  {
    key: "javascript",
    title: "JavaScript",
    href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    icon: <JsIcon />,
    categories: ["Languages"],
  },
  {
    key: "cpp",
    title: "C++",
    href: "https://isocpp.org",
    icon: <CodeIcon />,
    categories: ["Languages"],
  },

  // Frontend
  {
    key: "react",
    title: "React",
    href: "https://react.dev",
    icon: <ReactIcon />,
    categories: ["Frontend"],
  },
  {
    key: "nextjs",
    title: "Next.js",
    href: "https://nextjs.org",
    icon: <BoxIcon />,
    categories: ["Frontend"],
  },
  {
    key: "redux",
    title: "Redux",
    href: "https://redux.js.org",
    icon: <BoxIcon />,
    categories: ["Frontend"],
  },
  {
    key: "tailwindcss",
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
    icon: <TailwindCssIcon />,
    categories: ["Frontend"],
  },
  {
    key: "materialui",
    title: "Material UI",
    href: "https://mui.com",
    icon: <BoxIcon />,
    categories: ["Frontend"],
  },

  // Backend
  {
    key: "nodejs",
    title: "Node.js",
    href: "https://nodejs.org",
    icon: <ServerIcon />,
    categories: ["Backend"],
  },
  {
    key: "expressjs",
    title: "Express.js",
    href: "https://expressjs.com",
    icon: <ServerIcon />,
    categories: ["Backend"],
  },
  {
    key: "sql",
    title: "SQL",
    href: "https://en.wikipedia.org/wiki/SQL",
    icon: <DatabaseIcon />,
    categories: ["Backend"],
  },
  {
    key: "django",
    title: "Django",
    href: "https://www.djangoproject.com",
    icon: <ServerIcon />,
    categories: ["Backend"],
  },

  // AI / Infra
  {
    key: "strands-sdk",
    title: "Strands SDK",
    href: "https://strandsagents.com",
    icon: <BotIcon />,
    categories: ["AI / Infra"],
  },
  {
    key: "litellm",
    title: "LiteLLM",
    href: "https://litellm.ai",
    icon: <BotIcon />,
    categories: ["AI / Infra"],
  },
  {
    key: "pytest",
    title: "pytest",
    href: "https://pytest.org",
    icon: <TestTubeIcon />,
    categories: ["AI / Infra"],
  },
  {
    key: "nsjail",
    title: "nsjail",
    href: "https://github.com/google/nsjail",
    icon: <ShieldIcon />,
    categories: ["AI / Infra"],
  },
  {
    key: "cdp",
    title: "CDP",
    href: "https://chromedevtools.github.io/devtools-protocol/",
    icon: <NetworkIcon />,
    categories: ["AI / Infra"],
  },

  // Databases
  {
    key: "postgresql",
    title: "PostgreSQL",
    href: "https://www.postgresql.org",
    icon: <DatabaseIcon />,
    categories: ["Databases"],
  },
  {
    key: "redis",
    title: "Redis",
    href: "https://redis.io",
    icon: <DatabaseIcon />,
    categories: ["Databases"],
  },
  {
    key: "mongodb",
    title: "MongoDB",
    href: "https://www.mongodb.com",
    icon: <DatabaseIcon />,
    categories: ["Databases"],
  },

  // DevOps
  {
    key: "aws",
    title: "AWS",
    href: "https://aws.amazon.com",
    icon: <CloudIcon />,
    categories: ["DevOps"],
  },
  {
    key: "docker",
    title: "Docker",
    href: "https://www.docker.com",
    icon: <ContainerIcon />,
    categories: ["DevOps"],
  },
  {
    key: "vercel",
    title: "Vercel",
    href: "https://vercel.com",
    icon: <VercelIcon />,
    categories: ["DevOps"],
  },
]
