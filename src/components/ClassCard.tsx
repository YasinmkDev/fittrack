import { StyleSheet, Text, View } from 'react-native';

import type { GymClass } from '../data/seed';
import { theme } from '../theme/theme';
import { Card } from './Card';
import { Chip } from './Chip';
import { ProgressBar } from './ProgressBar';

interface ClassCardProps {
  gymClass: GymClass;
}

export function ClassCard({ gymClass }: ClassCardProps) {
  const pct = gymClass.booked / gymClass.capacity;
  const almostFull = pct >= 0.85;
  return (
    <Card style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.main}>
          <Text style={styles.name}>{gymClass.name}</Text>
          <Text style={styles.meta}>
            {gymClass.time} · {gymClass.trainer}
          </Text>
        </View>
        {gymClass.state === 'live' && <Chip label="Live now" tone="accent" />}
        {gymClass.state === 'done' && <Chip label="Done" tone="neutral" />}
        {gymClass.state === 'upcoming' && <Chip label="Upcoming" tone="info" />}
      </View>
      <View style={styles.progressWrap}>
        <ProgressBar value={pct} color={almostFull ? theme.colors.warning : theme.colors.accent} height={5} />
      </View>
      <Text style={styles.capacity}>
        {gymClass.booked} of {gymClass.capacity} spots booked
        {almostFull && gymClass.state !== 'done' ? ' · almost full' : ''}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: theme.spacing.md },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md },
  main: { flex: 1 },
  name: {
    fontSize: theme.fontSize.body,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  meta: { fontSize: theme.fontSize.caption, color: theme.colors.textSecondary, marginTop: 2 },
  progressWrap: { marginTop: theme.spacing.lg },
  capacity: { fontSize: theme.fontSize.caption, color: theme.colors.textSecondary, marginTop: theme.spacing.sm },
});
