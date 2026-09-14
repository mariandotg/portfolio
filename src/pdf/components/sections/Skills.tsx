import React from 'react'
import { View, Text } from '@react-pdf/renderer'
import { THEME } from '../../styles/theme'
import { commonStyles } from '../../styles/common'
import { getPdfDictionary } from '../../dictionaries'

interface SkillsProps {
  skills: string[]
  locale: string
}

export const Skills: React.FC<SkillsProps> = ({ skills, locale }) => {
  const dict = getPdfDictionary(locale)
  return (
    <View style={commonStyles.sectionContainer}>
      {/* Same header-orphan guard as WorkExperience's job/client headers: a
          spacer keeps the title+rule from being the literal first child (see
          `headerSpacer`'s comment), and `minPresenceAhead` demands the skills
          list itself stay with its title instead of trailing onto a new page. */}
      <View style={commonStyles.headerSpacer} />
      <View wrap={false} minPresenceAhead={THEME.spacing.headerMinPresenceAhead}>
        <Text style={commonStyles.sectionTitle}>{dict.SKILLS}</Text>
        <View style={commonStyles.horizontalRule} />
      </View>
      <Text>{skills.join('\u00A0\u00B7\u00A0')}</Text>
    </View>
  )
}
