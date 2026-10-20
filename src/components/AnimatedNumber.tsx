import { useEffect, useState } from 'react';
import { Text, type TextStyle } from 'react-native';
import { runOnJS, useAnimatedReaction, useSharedValue, withTiming } from 'react-native-reanimated';

interface AnimatedNumberProps {
  value: number;
  format: (n: number) => string;
  style?: TextStyle;
  duration?: number;
}

/** Counts up once when it appears — reads as "data arriving", not decoration. */
export function AnimatedNumber({ value, format, style, duration = 800 }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(value, { duration });
  }, [progress, value, duration]);

  useAnimatedReaction(
    () => progress.value,
    (current) => {
      runOnJS(setDisplay)(Math.round(current));
    },
  );

  return <Text style={style}>{format(display)}</Text>;
}
