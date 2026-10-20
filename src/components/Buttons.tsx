import { Pressable, StyleSheet, Text } from 'react-native';
import * as Haptics from 'expo-haptics';

import { theme } from '../theme/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
}

/** Primary = near-black fill (the athletic premium choice). Accent is reserved for data and states. */
export function PrimaryButton({ label, onPress, accessibilityLabel }: ButtonProps) {
  return (
    <Pressable
      onPress={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
    >
      <Text style={styles.primaryLabel}>{label}</Text>
    </Pressable>
  );
}

export function AccentButton({ label, onPress, accessibilityLabel }: ButtonProps) {
  return (
    <Pressable
      onPress={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [styles.accent, pressed && styles.pressed]}
    >
      <Text style={styles.primaryLabel}>{label}</Text>
    </Pressable>
  );
}

export function GhostButton({ label, onPress, accessibilityLabel }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [styles.ghost, pressed && styles.pressed]}
    >
      <Text style={styles.ghostLabel}>{label}</Text>
    </Pressable>
  );
}

const base = {
  minHeight: 50,
  borderRadius: theme.radii.md,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  paddingHorizontal: theme.spacing.xl,
};

const styles = StyleSheet.create({
  primary: { ...base, backgroundColor: theme.colors.ink },
  accent: { ...base, backgroundColor: theme.colors.accent },
  primaryLabel: {
    color: '#FFFFFF',
    fontSize: theme.fontSize.body,
    fontWeight: theme.fontWeight.semibold,
  },
  ghost: {
    ...base,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    backgroundColor: theme.colors.surface,
  },
  ghostLabel: {
    color: theme.colors.text,
    fontSize: theme.fontSize.body,
    fontWeight: theme.fontWeight.semibold,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});
