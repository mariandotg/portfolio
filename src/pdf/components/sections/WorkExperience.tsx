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
  clientBlock: {
    marginTop: 4,
    marginBottom: 3,
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
  const [firstBullet, ...restBullets] = client.bullets

  return (
    <View style={styles.clientBlock}>
      {/* Bundles the header with its first bullet into one atomic block, so a
          page break never leaves the header alone with its bullet(s) pushed
          to the next page — the whole bundle moves together instead. */}
      <View wrap={false}>
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
        {firstBullet && <Bullet text={firstBullet} />}
      </View>
      {restBullets.length > 0 && <BulletList bullets={restBullets} />}
      {client.techStack && client.techStack.length > 0 && (
        <TechStack stack={client.techStack} />
      )}
    </View>
  )
}

const WorkEntry: React.FC<{ work: Work; presentLabel: string }> = ({ work, presentLabel }) => {
  const [firstBullet, ...restBullets] = work.bullets ?? []

  return (
    <View style={styles.entryContainer}>
      {/* Same atomic-bundle strategy as ClientEntry, for the job's own header. */}
      <View wrap={false}>
        <View style={styles.entryHeader}>
          <Text style={styles.company}>{work.company}</Text>
          <Text style={styles.dateRange}>
            {work.start} — {work.end ?? presentLabel}
          </Text>
        </View>
        <Text style={styles.jobTitle}>{work.title}</Text>
        {firstBullet && <Bullet text={firstBullet} />}
      </View>

      {restBullets.length > 0 && <BulletList bullets={restBullets} />}
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
