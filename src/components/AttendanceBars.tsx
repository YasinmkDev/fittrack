import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { theme } from '../theme/theme';

interface AttendanceBarsProps {
  data: number[];
  labels: string[];
  height?: number;
}

/** 7-day check-in bars. Today is the flat accent, other days warm grey. Bars grow once. */
export function AttendanceBars({ data, labels, height = 110 }: AttendanceBarsProps) {
  const max = Math.max(...data);
  return (
    <View>
      <View style={[styles.chart, { height }]}>
        {data.map((value, i) => (
          <Bar
            key={i}
            value={value}
            max={max}
            isToday={i === data.length - 1}
            index={i}
            chartHeight={height}
          />
        ))}
      </View>
      <View style={styles.labels}>
        {labels.map((label, i) => (
          <Text
            key={i}
            style={[styles.label, i === labels.length - 1 && styles.labelToday]}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

function Bar({
  value,
  max,
  isToday,
  index,
  chartHeight,
}: {
  value: number;
  max: number;
  isToday: boolean;
  index: number;
  chartHeight: number;
}) {
  const progress = useSharedValue(0);
  const target = (value / max) * (chartHeight - 22);

  useEffect(() => {
    progress.value = withDelay(index * 50, withTiming(1, { duration: 550 }));
  }, [progress, index]);

  const barStyle = useAnimatedStyle(() => ({ height: Math.max(6, target * progress.value) }));

  return (
    <View style={styles.barWrap}>
      <Text style={[styles.value, isToday && styles.valueToday]}>{value}</Text>
      <Animated.View
        style={[
          styles.bar,
          { backgroundColor: isToday ? theme.colors.accent : theme.colors.barMuted },
          barStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: theme.spacing.sm },
  barWrap: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' },
  value: { fontSize: 11, color: theme.colors.textTertiary, marginBottom: theme.spacing.xs },
  valueToday: { color: theme.colors.accent, fontWeight: theme.fontWeight.bold },
  bar: { width: '72%', borderTopLeftRadius: 5, borderTopRightRadius: 5 },
  labels: { flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.sm },
  label: { flex: 1, textAlign: 'center', fontSize: 11, color: theme.colors.textTertiary },
  labelToday: { color: theme.colors.text, fontWeight: theme.fontWeight.semibold },
});
