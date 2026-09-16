import React from 'react'
import { Card, CardHeader } from './Card'
import type { Certificate } from '@/models/resume.data.models'

interface Props {
  certificate: Certificate
}

const CertificateCard: React.FunctionComponent<Props> = ({ certificate }) => {
  const card = (
    <Card className="print-avoid-break rounded-md border border-border bg-card p-3 transition-all group-hover:-translate-y-0.5 group-hover:border-primary/50">
      <CardHeader className="space-y-1">
        <div className="flex items-start justify-between gap-x-2">
          <p className="text-sm font-semibold leading-none transition-colors group-hover:text-primary">
            {certificate.title}
            {certificate.url && (
              <span
                aria-hidden="true"
                className="ml-1 inline-block text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
              >
                ↗
              </span>
            )}
          </p>
          <span className="text-sm tabular-nums text-muted-foreground shrink-0 print:text-[10px]">
            {certificate.date}
          </span>
        </div>
        <p className="text-sm text-muted-foreground print:text-[10px]">
          {certificate.issuer}
        </p>
      </CardHeader>
    </Card>
  )

  if (!certificate.url) {
    return card
  }

  return (
    <a
      href={certificate.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      {card}
    </a>
  )
}

export { CertificateCard }
