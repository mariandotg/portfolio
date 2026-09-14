import React from 'react'
import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { THEME } from '../../styles/theme'
import { commonStyles } from '../../styles/common'
import { getPdfDictionary } from '../../dictionaries'
import type { Work, WorkClient } from '../../../models/resume.data.models'

const styles = StyleSheet.create({
  entryContainer: {
    marginBottom: THEME.spacing.itemGap,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  company: {
    fontFamily: THEME.fonts.heading,
    fontSize: THEME.fontSize.jobTitle,
    color: THEME.colors.black,
  },
  dateRange: {
    fontSize: THEME.fontSize.small,
    color: THEME.colors.mediumGray,
  },
  jobTitle: {
    fontFamily: THEME.fonts.bodyItalic,
    fontSize: THEME.fontSize.body,
    color: THEME.colors.mediumGray,
    marginBottom: 3,
  },
  techStack: {
    fontSize: THEME.fontSize.small,
    color: THEME.colors.lightGray,
    marginTop: 2,
    marginBottom: 1,
  },
  techLabel: {
    fontFamily: THEME.fonts.heading,
    fontSize: THEME.fontSize.small,
  },
  // `marginTop` only (no trailing `marginBottom`) is deliberate: react-pdf's
  // page-break heuristic defers a WHOLE node to the next page — instead of
  // splitting it — whenever the node's own box plus its trailing margin
  // overshoots the page boundary, even by a fraction of a point, as long as
  // something already rendered above it on the page (see react-pdf's
  // `shouldBreak`: `endOfPresence = child.bottom + marginBottom`, compared
  // against the page height). A `marginBottom` here previously tipped that
  // check by a hair for the RCI→Ford boundary, pushing all of Ford's block
  // (header + 6 bullets + tech stack — comfortably small enough to fit the
  // remaining page) onto a fresh page and leaving ~20% of the prior page
  // blank. `marginTop` carries the same visual spacing without ever
  // contributing to whether the PRECEDING sibling is judged to fit.
  clientBlock: {
    marginTop: 7,
    paddingLeft: 6,
  },
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  clientName: {
    fontFamily: THEME.fonts.heading,
    fontSize: THEME.fontSize.body,
    color: THEME.colors.darkGray,
    marginBottom: 2,
  },
  clientRole: {
    fontFamily: THEME.fonts.bodyItalic,
    fontSize: THEME.fontSize.small,
    color: THEME.colors.mediumGray,
  },
  clientDateRange: {
    fontSize: THEME.fontSize.small,
    color: THEME.colors.mediumGray,
  },
})

// A single bullet marker + text. `wrap={false}` keeps the row atomic: react-pdf
// either renders the whole row on the current page or moves it whole to the
// next one — it never splits the marker from its text across a page break.
const Bullet: React.FC<{ text: string }> = ({ text }) => (
  <View style={commonStyles.bulletItem} wrap={false}>
    <Text style={commonStyles.bulletDot}>{'•'}</Text>
    <Text style={commonStyles.bulletText}>{text}</Text>
  </View>
)

const BulletList: React.FC<{ bullets: readonly string[] }> = ({ bullets }) => (
  <View>
    {bullets.map((bullet, i) => (
      <Bullet key={i} text={bullet} />
    ))}
  </View>
)

const TechStack: React.FC<{ stack: readonly string[] }> = ({ stack }) => (
  <Text style={styles.techStack}>
    <Text style={styles.techLabel}>Technologies: </Text>
    {stack.join(', ')}
  </Text>
)

const ClientEntry: React.FC<{ client: WorkClient; presentLabel: string }> = ({ client, presentLabel }) => {
  const nameLine = (
    <Text style={styles.clientName}>
      {client.name}
      {client.role && <Text style={styles.clientRole}> — {client.role}</Text>}
    </Text>
  )

  return (
    <View style={styles.clientBlock}>
      {/* Not the header's literal first child on purpose — see
          `headerSpacer`'s comment: a `minPresenceAhead` header that IS the
          first child of its container has that hint silently ignored. */}
      <View style={commonStyles.headerSpacer} />
      {/* Atomic (wrap={false}) so the name/role/date line is never split
          mid-header, and `minPresenceAhead` demands ~2 lines of bullet
          content stay with it — so the header is never orphaned at the
          bottom of a page. Bullets are NOT bundled in here (unlike the old
          header+first-bullet bundle): each `Bullet` below is independently
          atomic, so react-pdf can fill the page up to whichever bullet is
          the last one that fits, instead of moving the whole client block
          when only a bundle didn't fit. */}
      <View wrap={false} minPresenceAhead={THEME.spacing.headerMinPresenceAhead}>
        {client.start != null ? (
          <View style={styles.clientHeader}>
            {nameLine}
            <Text style={styles.clientDateRange}>
              {client.start} — {client.end ?? presentLabel}
            </Text>
          </View>
        ) : (
          nameLine
        )}
      </View>
      <BulletList bullets={client.bullets} />
      {client.techStack && client.techStack.length > 0 && (
        <TechStack stack={client.techStack} />
      )}
    </View>
  )
}

const WorkEntry: React.FC<{ work: Work; presentLabel: string }> = ({ work, presentLabel }) => {
  return (
    <View style={styles.entryContainer}>
      {/* Same header-only-atomic strategy as ClientEntry, for the job's own header. */}
      <View style={commonStyles.headerSpacer} />
      <View wrap={false} minPresenceAhead={THEME.spacing.headerMinPresenceAhead}>
        <View style={styles.entryHeader}>
          <Text style={styles.company}>{work.company}</Text>
          <Text style={styles.dateRange}>
            {work.start} — {work.end ?? presentLabel}
          </Text>
        </View>
        <Text style={styles.jobTitle}>{work.title}</Text>
      </View>

      {work.bullets && work.bullets.length > 0 && <BulletList bullets={work.bullets} />}
      {work.techStack && work.techStack.length > 0 && (
        <TechStack stack={work.techStack} />
      )}

      {work.clients && work.clients.length > 0 && (
        <View>
          {work.clients.map((client, i) => (
            <ClientEntry key={i} client={client} presentLabel={presentLabel} />
          ))}
        </View>
      )}
    </View>
  )
}

interface WorkExperienceProps {
  work: Work[]
  locale: string
}

export const WorkExperience: React.FC<WorkExperienceProps> = ({ work, locale }) => {
  const dict = getPdfDictionary(locale)
  const reversed = [...work].reverse()

  return (
    <View style={commonStyles.sectionContainer}>
      <Text style={commonStyles.sectionTitle}>{dict.EXPERIENCE}</Text>
      <View style={commonStyles.horizontalRule} />
      {reversed.map((entry, i) => (
        <WorkEntry key={i} work={entry} presentLabel={dict.PRESENT} />
      ))}
    </View>
  )
}
