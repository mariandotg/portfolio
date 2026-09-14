export const THEME = {
  fonts: {
    heading: 'Helvetica-Bold',
    body: 'Helvetica',
    bodyItalic: 'Helvetica-Oblique',
  },
  fontSize: {
    name: 18,
    sectionTitle: 11,
    jobTitle: 10,
    body: 9.5,
    small: 8.5,
    contact: 9,
  },
  spacing: {
    pageMargin: 40,
    sectionGap: 10,
    itemGap: 7,
    bulletIndent: 10,
    lineHeight: 1.4,
    // Points of content react-pdf must find directly after a job/client header
    // before allowing a page break — roughly 2 lines of body text, so a
    // header is never left alone at the bottom of a page. See
    // https://react-pdf.org/advanced#orphan-&-widow-protection
    headerMinPresenceAhead: 28,
  },
  colors: {
    black: '#111827',
    darkGray: '#1f2937',
    mediumGray: '#374151',
    lightGray: '#6b7280',
    rule: '#374151',
  },
} as const
