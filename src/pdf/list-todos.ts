import { PUBLIC_RESUME_DATA } from '../data/resume'
import { RESUME_VARIANT_IDS, getVariantResumeData, type Lang } from '../data/resume.variants'
import { findTodos, printTodoReport } from './todo-report'

const LOCALES: readonly Lang[] = ['en', 'es']

console.log('TODOs:')

for (const locale of LOCALES) {
  printTodoReport(`default/${locale}`, findTodos(PUBLIC_RESUME_DATA[locale]))
}

for (const variantId of RESUME_VARIANT_IDS) {
  for (const locale of LOCALES) {
    printTodoReport(`${variantId}/${locale}`, findTodos(getVariantResumeData(variantId, locale)))
  }
}
