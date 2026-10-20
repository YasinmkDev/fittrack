import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Flame } from 'lucide-react-native';

import { planById, type Member, type MemberStatus } from '../data/seed';
import { theme } from '../theme/theme';
import { Avatar } from './Avatar';
import { Card } from './Card';
import { Chip, type ChipTone } from './Chip';
import { ProgressBar } from './ProgressBar';

export const STATUS_META: Record<MemberStatus, { label: string; tone: ChipTone }> = {
  active: { label: 'Active', tone: 'success' },
  expiring: { label: 'Expiring soon', tone: 'warning' },
  expired: { label: 'Expired', tone: 'danger' },
  frozen: { label: 'Frozen', tone: 'info' },
};

interface MemberCardProps {
  member: Member;
  onPress: () => void;
}

export function MemberCard({ member, onPress }: MemberCardProps) {
  const plan = planById(member.planId);
  const status = STATUS_META[member.status];
  const elapsed = Math.max(0, Math.min(1, 1 - member.daysLeft / member.planDays));
  const daysLabel =
    member.daysLeft < 0
      ? `Expired ${Math.abs(member.daysLeft)}d ago`
      : member.status === 'frozen'
        ? `Frozen · ${member.daysLeft}d left on resume`
        : `${member.daysLeft} days left`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${member.name}, ${plan.name} plan, ${status.label}`}
      style={({ pressed }) => pressed && styles.pressed}>
      <Card style={styles.card}>
        <View style={styles.topRow}>
          <Avatar name={member.name} />
          <View style={styles.main}>
            <Text style={styles.name} numberOfLines={1}>
              {member.name}
            </Text>
            <Text style={styles.meta}>
              {plan.name} · {member.goal}
            </Text>
          </View>
          <Chip label={status.label} tone={status.tone} />
        </View>
        <View style={styles.progressWrap}>
          <ProgressBar
            value={elapsed}
            color={
              member.status === 'expired'
                ? theme.colors.danger
                : member.status === 'expiring'
                  ? theme.colors.warning
                  : theme.colors.accent
            }
            height={5}
          />
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.days}>{daysLabel}</Text>
          {member.streakWeeks > 0 && (
            <View style={styles.streak}>
              <Flame size={13} color={theme.colors.accent} />
              <Text style={styles.streakText}>{member.streakWeeks} wk streak</Text>
            </View>
          )}
          <Text style={styles.visits}>{member.visitsThisMonth} visits this month</Text>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.85 },
  card: { marginBottom: theme.spacing.md },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  main: { flex: 1 },
  name: {
    fontSize: theme.fontSize.body,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  meta: { fontSize: theme.fontSize.caption, color: theme.colors.textSecondary, marginTop: 2 },
  progressWrap: { marginTop: theme.spacing.lg },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    marginTop: theme.spacing.md,
    flexWrap: 'wrap',
  },
  days: { fontSize: theme.fontSize.caption, fontWeight: theme.fontWeight.semibold, color: theme.colors.text },
  streak: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  streakText: { fontSize: theme.fontSize.caption, color: theme.colors.accent, fontWeight: theme.fontWeight.semibold },
  visits: { fontSize: theme.fontSize.caption, color: theme.colors.textSecondary },
});
