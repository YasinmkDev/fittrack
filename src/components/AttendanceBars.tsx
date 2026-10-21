import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
  /** One detail line per day, shown when the day is tapped. */
  details?: string[];
  height?: number;
}

/**
 * 7-day check-in bars — interactive. Bars are 44pt-friendly tap targets:
 * tapping a day selects it (turns ink, springs taller) and swaps the detail
 * line underneath. Today is the flat accent. Bars grow in once on mount.
 */
export function AttendanceBars({ data, labels, details, height = 110 }: AttendanceBarsProps) {
  const max = Math.max(...data);
  const [selected, setSelected] = useState(data.length - 1);
  return (
    <View>
      <View style={[styles.chart, { height }]}>
        {data.map((value, i) => (
          <Bar
            key={i}
            value={value}
            max={max}
            isToday={i === data.length - 1}
            isSelected={selected === i}
            index={i}
            chartHeight={height}
            label={labels[i]}
            onPress={() => setSelected(i)}
          />
        ))}
      </View>
      <View style={styles.labels}>
        {labels.map((label, i) => (
          <Text key={i} style={[styles.label, selected === i && styles.labelSelected]}>
            {label}
          </Text>
        ))}
      </View>
      {details && (
        <View style={styles.detailRow}>
          <Text style={styles.detailDay}>{labels[selected]}</Text>
          <Text style={styles.detailText}>{details[selected]}</Text>
        </View>
      )}
    </View>
  );
}

function Bar({
  value,
  max,
  isToday,
  isSelected,
  index,
  chartHeight,
  label,
  onPress,
}: {
  value: number;
  max: number;
  isToday: boolean;
  isSelected: boolean;
  index: number;
  chartHeight: number;
  label: string;
  onPress: () => void;
}) {
  const progress = useSharedValue(0);
  const target = (value / max) * (chartHeight - 24);

  useEffect(() => {
    progress.value = withDelay(index * 50, withTiming(1, { duration: 550 }));
  }, [progress, index]);

  const barStyle = useAnimatedStyle(() => ({
    height: Math.max(6, target * progress.value) * (isSelected ? 1.06 : 1),
  }));

  const color = isSelected
    ? isToday
      ? theme.colors.accent
      : theme.colors.ink
    : isToday
      ? theme.colors.accent
      : theme.colors.barMuted;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`${label}: ${value} check-ins`}
      style={styles.barWrap}>
      <Text style={[styles.value, isSelected && styles.valueSelected]}>{value}</Text>
      <Animated.View style={[styles.bar, { backgroundColor: color }, barStyle]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: theme.spacing.sm },
  barWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    minHeight: 44,
  },
  value: { fontSize: 11, color: theme.colors.textTertiary, marginBottom: theme.spacing.xs },
  valueSelected: { color: theme.colors.text, fontWeight: theme.fontWeight.bold },
  bar: { width: '72%', borderTopLeftRadius: 5, borderTopRightRadius: 5 },
  labels: { flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.sm },
  label: { flex: 1, textAlign: 'center', fontSize: 11, color: theme.colors.textTertiary },
  labelSelected: { color: theme.colors.text, fontWeight: theme.fontWeight.bold },
  detailRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'baseline',
  },
  detailDay: {
    fontSize: theme.fontSize.caption,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  detailText: { flex: 1, fontSize: theme.fontSize.caption, color: theme.colors.textSecondary },
});
