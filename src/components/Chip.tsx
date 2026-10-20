import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme/theme';

export type ChipTone = 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const TONES: Record<ChipTone, { bg: string; fg: string }> = {
  accent: { bg: theme.colors.accentTint, fg: theme.colors.accentDark },
  success: { bg: theme.colors.successTint, fg: theme.colors.success },
  warning: { bg: theme.colors.warningTint, fg: theme.colors.warning },
  danger: { bg: theme.colors.dangerTint, fg: theme.colors.danger },
  info: { bg: theme.colors.infoTint, fg: theme.colors.info },
  neutral: { bg: theme.colors.surfaceAlt, fg: theme.colors.textSecondary },
};

interface ChipProps {
  label: string;
  tone?: ChipTone;
}

/** Small status pill. Colour is a soft tint with a darker ink — never a saturated fill. */
export function Chip({ label, tone = 'neutral' }: ChipProps) {
  const t = TONES[tone];
  return (
    <View style={[styles.chip, { backgroundColor: t.bg }]}>
      <Text style={[styles.label, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  label: { fontSize: 12, fontWeight: theme.fontWeight.semibold },
});
