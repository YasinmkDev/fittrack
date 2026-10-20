import type { ReactNode } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface AnimatedInProps {
  children: ReactNode;
  /** Stagger position in the list — each step adds 40ms, capped so long lists stay snappy. */
  index?: number;
  style?: ViewStyle;
}

/**
 * The one entrance motion used across the whole app — fluid edition.
 * Spring physics (slight overshoot, settles fast) instead of a fixed-duration
 * tween: it feels physical rather than programmed, and stays well inside the
 * Doherty threshold. Fade + small rise, staggered 40ms, capped for long lists.
 */
export function AnimatedIn({ children, index = 0, style }: AnimatedInProps) {
  const delay = Math.min(index, 8) * 40;
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(17).stiffness(210).mass(0.72)}
      style={[styles.wrap, style]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({ wrap: { flexShrink: 1 } });
