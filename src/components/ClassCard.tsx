import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Check, Plus } from 'lucide-react-native';

import type { GymClass } from '../data/seed';
import { theme } from '../theme/theme';
import { Card } from './Card';
import { Chip } from './Chip';
import { ProgressBar } from './ProgressBar';

interface ClassCardProps {
  gymClass: GymClass;
}

/**
 * A class card you can act on: book a spot and the count and capacity bar
 * move; fill the class and it becomes a waitlist. State is local to the card.
 */
export function ClassCard({ gymClass }: ClassCardProps) {
  const [extraBooked, setExtraBooked] = useState(0);
  const [waitlisted, setWaitlisted] = useState(false);
  const booked = gymClass.booked + extraBooked;
  const full = booked >= gymClass.capacity;
  const pct = Math.min(1, booked / gymClass.capacity);
  const almostFull = pct >= 0.85;

  const book = () => {
    if (full) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExtraBooked((n) => n + 1);
  };

  const joinWaitlist = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setWaitlisted(true);
  };

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
        <ProgressBar
          value={pct}
          color={full ? theme.colors.danger : almostFull ? theme.colors.warning : theme.colors.accent}
          height={5}
        />
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.capacity}>
          {booked} of {gymClass.capacity} spots
          {full ? ' · class full' : almostFull ? ' · almost full' : ''}
        </Text>
        {gymClass.state !== 'done' &&
          (!full ? (
            <Pressable
              onPress={book}
              accessibilityRole="button"
              accessibilityLabel={`Book a spot in ${gymClass.name}`}
              style={styles.bookBtn}>
              <Plus size={14} color="#FFFFFF" strokeWidth={3} />
              <Text style={styles.bookBtnLabel}>Book spot</Text>
            </Pressable>
          ) : waitlisted ? (
            <View style={styles.waitlisted}>
              <Check size={14} color={theme.colors.success} strokeWidth={3} />
              <Text style={styles.waitlistedLabel}>On waitlist</Text>
            </View>
          ) : (
            <Pressable
              onPress={joinWaitlist}
              accessibilityRole="button"
              accessibilityLabel={`Join waitlist for ${gymClass.name}`}
              style={styles.waitlistBtn}>
              <Text style={styles.waitlistBtnLabel}>Join waitlist</Text>
            </Pressable>
          ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: theme.spacing.md },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md },
  main: { flex: 1 },
  name: {
    fontSize: theme.fontSize.body,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  meta: { fontSize: theme.fontSize.caption, color: theme.colors.textSecondary, marginTop: 2 },
  progressWrap: { marginTop: theme.spacing.lg },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  capacity: { fontSize: theme.fontSize.caption, color: theme.colors.textSecondary, flex: 1 },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.ink,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
    minHeight: 36,
  },
  bookBtnLabel: {
    color: '#FFFFFF',
    fontSize: theme.fontSize.caption,
    fontWeight: theme.fontWeight.bold,
  },
  waitlistBtn: {
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  waitlistBtnLabel: {
    fontSize: theme.fontSize.caption,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  waitlisted: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 36 },
  waitlistedLabel: {
    fontSize: theme.fontSize.caption,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.success,
  },
});
