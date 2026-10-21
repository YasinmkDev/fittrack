import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { theme } from '../theme/theme';

interface SectionTitleProps {
  title: string;
  /** Small orange caps label above the title — the hierarchy's middle layer. */
  kicker?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionTitle({ title, kicker, actionLabel, onAction }: SectionTitleProps) {
  return (
    <View style={styles.row}>
      <View style={styles.main}>
        {kicker && <Text style={styles.kicker}>{kicker}</Text>}
        <Text style={styles.title}>{title}</Text>
      </View>
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          style={styles.action}
          hitSlop={8}
        >
          <Text style={styles.actionLabel}>{actionLabel}</Text>
          <ChevronRight size={15} color={theme.colors.accent} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.xxl,
  },
  main: { flex: 1 },
  kicker: {
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 1.4,
    color: theme.colors.accent,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  title: {
    fontSize: theme.fontSize.section,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    letterSpacing: -0.2,
  },
  action: { flexDirection: 'row', alignItems: 'center', gap: 2, minHeight: 32 },
  actionLabel: {
    fontSize: theme.fontSize.caption,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.accent,
  },
});
