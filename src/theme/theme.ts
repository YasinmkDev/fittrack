/**
 * APEX Studio Lab design tokens — extracted from the owner's reference
 * designs (2026-10-20). Light warm-gray canvas, white cards with hairline
 * borders and large radii, vivid flat blue primary, rust for kickers and
 * alerts, black display type. No gradients, no glow.
 */
export const theme = {
  colors: {
    canvas: '#FCFCFA',
    surface: '#FFFFFF',
    surfaceAlt: '#F4F4F1',
    ink: '#141414',
    inkSoft: '#26231F',
    inkText: '#FFFFFF',
    inkTextMuted: '#A3A099',
    text: '#141414',
    textSecondary: '#74716A',
    textTertiary: '#A3A099',
    border: '#ECEAE5',
    borderStrong: '#DEDBD6',
    accent: '#0B6BDE',
    accentDark: '#0A58B7',
    accentTint: '#E8F1FD',
    rust: '#BC4B1F',
    rustTint: '#FBEADD',
    success: '#1E8E4F',
    successTint: '#E4F4EA',
    warning: '#BC4B1F',
    warningTint: '#FBEADD',
    danger: '#D92D20',
    dangerTint: '#FDECEA',
    info: '#0B6BDE',
    infoTint: '#E8F1FD',
    tabInactive: '#A3A099',
    barMuted: '#E9E7E2',
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 },
  radii: { sm: 10, md: 14, lg: 20, pill: 999 },
  fontSize: {
    caption: 13,
    small: 14,
    body: 15,
    section: 18,
    title: 22,
    display: 30,
    hero: 52,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  shadow: {
    shadowColor: '#141414',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
} as const;
