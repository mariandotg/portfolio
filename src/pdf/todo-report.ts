import type { Welcome } from '../models/resume.data.models'

const TODO_MARKER = '[[TODO'

/** Collects every `[[TODO: ...]]` placeholder present in a résumé's rendered fields. */
export function findTodos(data: Welcome): string[] {
  const todos: string[] = []

  const scan = (value: string, location: string) => {
    if (value.includes(TODO_MARKER)) {
      todos.push(`${location}: ${value}`)
    }
  }

  scan(data.about, 'about')
  scan(data.summary, 'summary')
  data.skills.forEach((skill, i) => scan(skill, `skills[${i}]`))

  for (const job of data.work) {
    scan(job.title, `work[${job.id}].title`)
    job.bullets?.forEach((bullet, i) => scan(bullet, `work[${job.id}].bullets[${i}]`))
    job.techStack?.forEach((tech, i) => scan(tech, `work[${job.id}].techStack[${i}]`))

    for (const client of job.clients ?? []) {
      scan(client.name, `work[${job.id}].clients[${client.id}].name`)
      if (client.role) scan(client.role, `work[${job.id}].clients[${client.id}].role`)
      client.bullets.forEach((bullet, i) => scan(bullet, `work[${job.id}].clients[${client.id}].bullets[${i}]`))
      client.techStack?.forEach((tech, i) => scan(tech, `work[${job.id}].clients[${client.id}].techStack[${i}]`))
    }
  }

  return todos
}

/** Prints a `  count TODOs` header followed by one line per TODO, for one variant/locale. */
export function printTodoReport(label: string, todos: string[]) {
  console.log(`  ${label}: ${todos.length} TODO${todos.length === 1 ? '' : 's'}`)
  for (const todo of todos) {
    console.log(`    - ${todo}`)
  }
}
