import type { ReactNode } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface AnimatedInProps {
  children: ReactNode;
  /** Stagger position in the list — each step adds 40ms, capped so long lists stay snappy. */
  index?: number;
  style?: ViewStyle;
}

/** The one entrance motion used across the whole app: fade + 8px rise, 220ms. */
export function AnimatedIn({ children, index = 0, style }: AnimatedInProps) {
  const delay = Math.min(index, 8) * 40;
  return (
    <Animated.View entering={FadeInDown.duration(220).delay(delay)} style={[styles.wrap, style]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({ wrap: { flexShrink: 1 } });
