import React from 'react'
import { Card, CardContent, CardDescription, CardHeader } from './Card'
import { EntryTitle } from './EntryTitle'
import type { Project } from '@/models/resume.data.models'
import { Badge } from './Badge'

interface Props {
  project: Project
}

const ProjectCard: React.FunctionComponent<Props> = ({ project }) => {
  return (
    <Card className="flex flex-col overflow-hidden bg-transparent">
      <CardHeader className="">
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
      <CardContent className="mt-auto flex">
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
