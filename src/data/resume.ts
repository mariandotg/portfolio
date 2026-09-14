import type { Welcome } from '../models/resume.data.models'
import { getVariantResumeData, type ResumeVariantId } from './resume.variants'

// The variant the public site and the default PDFs render.
const PUBLIC_VARIANT: ResumeVariantId = 'java'

export const PUBLIC_RESUME_DATA: Record<string, Welcome> = {
  en: getVariantResumeData(PUBLIC_VARIANT, 'en'),
  es: getVariantResumeData(PUBLIC_VARIANT, 'es'),
}
