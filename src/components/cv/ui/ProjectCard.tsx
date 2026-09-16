import React from 'react'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { EntryTitle } from './EntryTitle'
import type { Project } from '@/models/resume.data.models'
import { Badge } from './Badge'

interface Props {
  project: Project
}

const ProjectCard: React.FunctionComponent<Props> = ({ project }) => {
  return (
    <Card className="flex flex-col gap-0 overflow-hidden rounded-sm border-0 bg-transparent py-0 shadow-none">
      <CardHeader className="flex flex-col gap-0 space-y-1.5 px-0">
        <div className="space-y-1">
          <EntryTitle className="mb-1 underline-offset-2">
            {project.link ? (
              <a
                href={project.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:underline"
              >
                {project.title}
              </a>
            ) : (
              project.title
            )}
          </EntryTitle>
          <div className="hidden font-mono text-xs underline print:block">
            {project.link?.href
              .replace('https://', '')
              .replace('www.', '')
              .replace('/', '')}
          </div>
          <CardDescription className="font-base text-base print:text-[10px]">
            {project.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex px-0">
        <div className="mt-2 flex flex-wrap gap-1">
          {project.techStack.map((tech) => (
            <Badge variant="secondary" key={tech}>
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export { ProjectCard }
