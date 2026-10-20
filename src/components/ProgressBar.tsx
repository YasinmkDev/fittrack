import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { theme } from '../theme/theme';

interface ProgressBarProps {
  /** 0 to 1 */
  value: number;
  color?: string;
  height?: number;
}

/** Thin, flat progress track. Animates width once on mount — no loops, no shimmer. */
export function ProgressBar({ value, color = theme.colors.accent, height = 6 }: ProgressBarProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(Math.max(0, Math.min(1, value)), { duration: 700 });
  }, [progress, value]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <Animated.View
        style={[styles.fill, { backgroundColor: color, borderRadius: height / 2 }, fillStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { backgroundColor: theme.colors.surfaceAlt, overflow: 'hidden', width: '100%' },
  fill: { height: '100%' },
});
