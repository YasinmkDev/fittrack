import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Line, Path } from 'react-native-svg';

import { theme } from '../theme/theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface TrendChartProps {
  data: number[];
  labels: string[];
  height?: number;
}

/**
 * Single solid accent line on a flat, very light area fill (8% opacity — a fill,
 * not a gradient). Draws itself once on mount. Baseline + sparse x labels only,
 * like a Stripe chart: the data speaks, the chrome stays silent.
 */
export function TrendChart({ data, labels, height = 150 }: TrendChartProps) {
  const [width, setWidth] = useState(0);
  const draw = useSharedValue(0);

  useEffect(() => {
    draw.value = 0;
    draw.value = withTiming(1, { duration: 900 });
  }, [draw]);

  const { line, area, pathLength } = useMemo(() => {
    if (width === 0 || data.length < 2) return { line: '', area: '', pathLength: 1 };
    const max = Math.max(...data) * 1.15;
    const stepX = width / (data.length - 1);
    const points = data.map((v, i) => ({
      x: i * stepX,
      y: height - (v / max) * height,
    }));
    const linePath = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' ');
    const areaPath = `${linePath} L${width},${height} L0,${height} Z`;
    let len = 0;
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      len += Math.hypot(dx, dy);
    }
    return { line: linePath, area: areaPath, pathLength: len };
  }, [data, width, height]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: pathLength * (1 - draw.value),
  }));

  return (
    <View>
      <View style={{ height }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {width > 0 && (
          <Svg width={width} height={height}>
            <Path d={area} fill={theme.colors.accent} opacity={0.08} />
            <AnimatedPath
              d={line}
              stroke={theme.colors.accent}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={pathLength}
              animatedProps={animatedProps}
            />
            <Line
              x1={0}
              y1={height - 0.5}
              x2={width}
              y2={height - 0.5}
              stroke={theme.colors.border}
              strokeWidth={1}
            />
          </Svg>
        )}
      </View>
      <View style={styles.labels}>
        {labels.map((label, i) => (
          <Text key={i} style={styles.label}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: theme.spacing.sm },
  label: { fontSize: 11, color: theme.colors.textTertiary },
});
