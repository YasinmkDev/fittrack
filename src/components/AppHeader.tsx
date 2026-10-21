import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { CircleUserRound, Expand } from 'lucide-react-native';

import { STUDIO } from '../data/apex';
import { theme } from '../theme/theme';

/** The APEX top bar from the reference designs: logo mark, wordmark, account. */
export function AppHeader() {
  return (
    <View style={styles.bar}>
      <View style={styles.left}>
        <Expand size={21} color={theme.colors.accent} strokeWidth={2.4} />
        <Text style={styles.wordmark}>{STUDIO.name}</Text>
      </View>
      <Pressable
        onPress={() => router.push('/auth')}
        accessibilityRole="button"
        accessibilityLabel="Account"
        hitSlop={8}>
        <CircleUserRound size={27} color={theme.colors.text} strokeWidth={1.6} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  wordmark: {
    fontSize: 17,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    letterSpacing: -0.2,
  },
});
