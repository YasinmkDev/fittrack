import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { theme } from '../theme/theme';

interface SectionTitleProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionTitle({ title, actionLabel, onAction }: SectionTitleProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.fontSize.section,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  action: { flexDirection: 'row', alignItems: 'center', gap: 2, minHeight: 32 },
  actionLabel: {
    fontSize: theme.fontSize.caption,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.accent,
  },
});
