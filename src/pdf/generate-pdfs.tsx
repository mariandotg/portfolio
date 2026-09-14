import path from 'node:path'
import { fileURLToPath } from 'node:url'
import React from 'react'
import { renderToFile } from '@react-pdf/renderer'
import { RESUME_DATA } from '../data/resume.datav2'
import { RESUME_VARIANT_IDS, getVariantResumeData, type Lang } from '../data/resume.variants'
import { CvDocument } from './components/CvDocument'
import { findTodos, printTodoReport } from './todo-report'
import type { Welcome } from '../models/resume.data.models'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.resolve(__dirname, '../../public')

const LOCALES: readonly Lang[] = ['en', 'es']

interface RenderTarget {
  label: string
  filename: string
  locale: Lang
  data: Welcome
  isDefault: boolean
}

function buildTargets(): RenderTarget[] {
  const targets: RenderTarget[] = []

  for (const locale of LOCALES) {
    targets.push({
      label: `default/${locale}`,
      filename: `mariano-guillaume-cv-${locale}.pdf`,
      locale,
      data: RESUME_DATA[locale],
      isDefault: true,
    })
  }

  for (const variantId of RESUME_VARIANT_IDS) {
    for (const locale of LOCALES) {
      targets.push({
        label: `${variantId}/${locale}`,
        filename: `mariano-guillaume-cv-${variantId}-${locale}.pdf`,
        locale,
        data: getVariantResumeData(variantId, locale),
        isDefault: false,
      })
    }
  }

  return targets
}

async function generatePdfs() {
  const targets = buildTargets()

  console.log('TODOs:')
  let defaultTodoCount = 0
  for (const target of targets) {
    const todos = findTodos(target.data)
    printTodoReport(target.label, todos)
    if (target.isDefault) defaultTodoCount += todos.length
  }

  if (defaultTodoCount > 0) {
    console.error(
      `\nThe default résumé contains ${defaultTodoCount} TODO placeholder(s). Fix them before generating — the default CV must never ship placeholders.`,
    )
    process.exit(1)
  }

  console.log('\nGenerating PDF CVs...')

  for (const target of targets) {
    const outputPath = path.join(OUTPUT_DIR, target.filename)
    process.stdout.write(`  Generating ${target.filename}... `)
    await renderToFile(<CvDocument data={target.data} locale={target.locale} />, outputPath)
    console.log('done')
  }

  console.log('All PDFs generated successfully.')
}

generatePdfs().catch((err) => {
  console.error('PDF generation failed:', err)
  process.exit(1)
})
