import Image from "next/image"
import { addQueryParams } from "@/utils/url"
import { BoxIcon, LinkIcon } from "lucide-react"

import { periodYear } from "@/features/portfolio/lib/format-period"

import { UTM_PARAMS } from "@/config/site"
import { Tag } from "@/components/ui/tag"
import { Prose } from "@/components/ui/typography"
import { CollapsibleChevronsUpDownIcon } from "@/components/base/collapsible-animated"
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/base/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import { Markdown } from "@/components/markdown"

import type { Project } from "../../types/projects"
import { ProjectCollapsible } from "./project-collapsible"

export function ProjectItem({
  className,
  project,
}: {
  className?: string
  project: Project
}) {
  const year = periodYear(project.period.start)

  return (
    <ProjectCollapsible
      projectId={project.id}
      className={className}
      defaultOpen={project.isExpanded}
    >
      <div
        id={`project-${project.id}`}
        data-project-id={project.id}
        className="group/project flex scroll-mt-24 items-center hover:bg-accent-muted"
      >
        {project.logo ? (
          <Image
            src={project.logo}
            alt={project.title}
            width={32}
            height={32}
            quality={100}
            className="mx-4 flex size-6 shrink-0 grayscale select-none group-hover/project:grayscale-0"
            unoptimized
            aria-hidden
          />
        ) : (
          <div className="mx-4 flex size-6 shrink-0 items-center justify-center rounded-lg border border-muted-foreground/15 bg-muted text-muted-foreground ring-1 ring-line ring-offset-1 ring-offset-background select-none">
            <BoxIcon className="size-4" />
          </div>
        )}

        <div className="flex-1 border-l border-dashed border-line">
          <CollapsibleTrigger className="flex w-full items-center gap-2 p-4 pr-2 text-left">
            <div className="flex-1">
              <h3 className="mb-1 leading-snug font-medium text-balance">
                {project.title}
              </h3>

              <dl className="text-sm text-muted-foreground">
                <dt className="sr-only">Year</dt>
                <dd>{year}</dd>
              </dl>
            </div>

            <Tooltip>
              <TooltipTrigger
                render={
                  <a
                    className="relative flex size-6 shrink-0 items-center justify-center text-muted-foreground after:absolute after:-inset-2 hover:text-foreground"
                    href={addQueryParams(project.link, UTM_PARAMS)}
                    target="_blank"
                    rel="noopener"
                    aria-label="Open project"
                  >
                    <LinkIcon className="pointer-events-none size-4" />
                  </a>
                }
              />
              <TooltipContent>
                <p>Open project</p>
              </TooltipContent>
            </Tooltip>

            <div className="shrink-0 text-muted-foreground [&_svg]:size-4">
              <CollapsibleChevronsUpDownIcon duration={0.15} />
            </div>
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent className="overflow-hidden">
        <div className="space-y-4 border-t border-line p-4">
          {project.screenshot && (
            <a
              href={addQueryParams(project.link, UTM_PARAMS)}
              target="_blank"
              rel="noopener"
              className="group/shot relative block overflow-hidden rounded-lg border border-line ring-offset-background focus-visible:ring-2 focus-visible:ring-link focus-visible:outline-none min-[84rem]:hidden"
            >
              <Image
                src={project.screenshot}
                alt={`${project.title} screenshot`}
                width={1280}
                height={720}
                quality={90}
                className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 ease-out group-hover/shot:scale-[1.02]"
                unoptimized
              />
            </a>
          )}

          {project.description && (
            <Prose>
              <Markdown>{project.description}</Markdown>
            </Prose>
          )}

          {project.skills.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {project.skills.map((skill, index) => (
                <li key={index} className="flex">
                  <Tag>{skill}</Tag>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CollapsibleContent>
    </ProjectCollapsible>
  )
}
