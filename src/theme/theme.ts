/**
 * FitTrack design tokens — see DESIGN.md.
 * Athletic clean: paper-white canvas, near-black primary actions, ONE flat
 * orange accent. No gradients, no glow, no neon.
 */
export const theme = {
  colors: {
    canvas: '#FAFAF9',
    surface: '#FFFFFF',
    surfaceAlt: '#F4F4F2',
    ink: '#131211',
    text: '#131211',
    textSecondary: '#6E6A63',
    textTertiary: '#A8A29A',
    border: '#E9E6E1',
    borderStrong: '#D8D3CB',
    accent: '#EA580C',
    accentDark: '#C2410C',
    accentTint: '#FFF3EC',
    success: '#15803D',
    successTint: '#F0FDF4',
    warning: '#B45309',
    warningTint: '#FFFBEB',
    danger: '#B91C1C',
    dangerTint: '#FEF2F2',
    info: '#1D4ED8',
    infoTint: '#EFF6FF',
    tabInactive: '#A8A29A',
    barMuted: '#DDD8D0',
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 },
  radii: { sm: 8, md: 12, lg: 16, pill: 999 },
  fontSize: { caption: 13, small: 14, body: 15, section: 16, title: 20, display: 28 },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  shadow: {
    shadowColor: '#131211',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;
