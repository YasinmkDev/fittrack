import { StyleSheet, Text, View } from 'react-native';

import { initials } from '../lib/format';
import { theme } from '../theme/theme';

const TINTS = ['#FEF3C7', '#F0FDF4', '#EFF6FF', '#FDF2F8', '#F5F3FF'];
const INKS = ['#B45309', '#15803D', '#1D4ED8', '#BE185D', '#6D28D9'];

interface AvatarProps {
  name: string;
  size?: number;
}

/** Flat tint circle with initials — deterministic colour per name, no photos needed. */
export function Avatar({ name, size = 44 }: AvatarProps) {
  const hash = name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const i = hash % TINTS.length;
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: TINTS[i] },
      ]}
    >
      <Text style={[styles.text, { color: INKS[i], fontSize: size * 0.36 }]}>{initials(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
  text: { fontWeight: theme.fontWeight.semibold },
});
