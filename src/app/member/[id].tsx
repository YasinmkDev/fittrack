import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, Flame, NotebookPen, Share2, Sparkles } from 'lucide-react-native';

import { AnimatedIn } from '../../components/AnimatedIn';
import { Avatar } from '../../components/Avatar';
import { AccentButton, GhostButton, PrimaryButton } from '../../components/Buttons';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { ProgressBar } from '../../components/ProgressBar';
import { SectionTitle } from '../../components/Section';
import { TrendChart } from '../../components/TrendChart';
import { STATUS_META } from '../../components/MemberCard';
import { memberById, planById } from '../../data/seed';
import { rs } from '../../lib/format';
import { theme } from '../../theme/theme';

export default function MemberScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reminderSent, setReminderSent] = useState(false);
  const [renewed, setRenewed] = useState(false);
  const [cardShared, setCardShared] = useState(false);
  const member = memberById(id ?? '');

  if (!member) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyTitle}>Member not found</Text>
        <Text style={styles.emptyText}>This record may have been removed.</Text>
        <GhostButton label="Go back" onPress={() => router.back()} />
      </View>
    );
  }

  const plan = planById(member.planId);
  const status = STATUS_META[member.status];
  const due = member.feeTotal - member.feePaid;
  const planElapsed = Math.max(0, Math.min(1, 1 - member.daysLeft / member.planDays));
  const feePct = member.feeTotal > 0 ? member.feePaid / member.feeTotal : 1;
  const firstKg = member.weightSeries[0]?.kg ?? 0;
  const lastKg = member.weightSeries[member.weightSeries.length - 1]?.kg ?? 0;
  const weightDelta = Math.round((lastKg - firstKg) * 10) / 10;

  return (
    <ScrollView style={styles.safe} contentContainerStyle={styles.content}>
      <AnimatedIn index={0}>
        <View style={styles.identity}>
          <Avatar name={member.name} size={56} />
          <View style={styles.identityMain}>
            <Text style={styles.name}>{member.name}</Text>
            <Text style={styles.meta}>
              Member since {member.joined} · {member.phone}
            </Text>
          </View>
          <Chip label={status.label} tone={status.tone} />
        </View>
      </AnimatedIn>

      <AnimatedIn index={1}>
        <View style={styles.statRow}>
          <View style={styles.statBox}>
            <View style={styles.statValueRow}>
              <Flame size={16} color={theme.colors.accent} />
              <Text style={styles.statValue}>{member.streakWeeks} wks</Text>
            </View>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{member.visitsThisMonth}</Text>
            <Text style={styles.statLabel}>Visits this month</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {member.lastVisitDaysAgo === 0 ? 'Today' : `${member.lastVisitDaysAgo}d ago`}
            </Text>
            <Text style={styles.statLabel}>Last visit</Text>
          </View>
        </View>
      </AnimatedIn>

      <AnimatedIn index={2}>
        <SectionTitle title="Plan & fee" />
        <Card>
          <View style={styles.planTop}>
            <View>
              <Text style={styles.planName}>{plan.name} plan</Text>
              <Text style={styles.planMeta}>
                {member.status === 'frozen'
                  ? `Frozen · ${member.daysLeft} days left on resume`
                  : member.daysLeft < 0
                    ? `Expired ${Math.abs(member.daysLeft)} days ago`
                    : `${member.daysLeft} days left`}
              </Text>
            </View>
            <Text style={styles.planPrice}>{rs(member.feeTotal)}</Text>
          </View>
          <View style={styles.progressWrap}>
            <ProgressBar
              value={renewed ? 0.02 : planElapsed}
              color={theme.colors.accent}
              height={5}
            />
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeText}>
              Fee paid {rs(member.feePaid)}
              {due > 0 ? ` · ${rs(due)} balance` : ' · fully paid'}
            </Text>
            <Text style={styles.feePct}>{Math.round(feePct * 100)}%</Text>
          </View>
          {due > 0 &&
            (reminderSent ? (
              <View style={styles.sentRow}>
                <View style={styles.sentIcon}>
                  <Check size={13} color="#FFFFFF" strokeWidth={3} />
                </View>
                <Text style={styles.sentText}>Fee reminder sent on WhatsApp</Text>
              </View>
            ) : (
              <View style={styles.actionBtn}>
                <AccentButton label="Send fee reminder" onPress={() => setReminderSent(true)} />
              </View>
            ))}
          {(member.status === 'expiring' || member.status === 'expired') &&
            (renewed ? (
              <View style={styles.sentRow}>
                <View style={styles.sentIcon}>
                  <Check size={13} color="#FFFFFF" strokeWidth={3} />
                </View>
                <Text style={styles.sentText}>Renewed — new {plan.name} cycle started today</Text>
              </View>
            ) : (
              <View style={styles.actionBtn}>
                <PrimaryButton
                  label={`Renew ${plan.name} — ${rs(plan.price)}`}
                  onPress={() => setRenewed(true)}
                />
              </View>
            ))}
        </Card>
      </AnimatedIn>

      {member.weightSeries.length > 1 && (
        <AnimatedIn index={3}>
          <SectionTitle title="Body progress" />
          <Card>
            <View style={styles.weightTop}>
              <Text style={styles.weightValue}>{lastKg} kg</Text>
              <Text
                style={[styles.weightDelta, weightDelta <= 0 ? styles.weightGood : styles.weightUp]}
              >
                {weightDelta > 0 ? '+' : ''}
                {weightDelta} kg since {member.weightSeries[0].label} · goal: {member.goal}
              </Text>
            </View>
            <TrendChart
              data={member.weightSeries.map((w) => w.kg)}
              labels={member.weightSeries.map((w) => w.label)}
              height={110}
            />
          </Card>
        </AnimatedIn>
      )}

      <AnimatedIn index={4}>
        <Card style={styles.intimacyCard}>
          <View style={styles.intimacyHead}>
            <Sparkles size={15} color={theme.colors.accent} />
            <Text style={styles.intimacyTitle}>
              ABOUT {member.name.split(' ')[0].toUpperCase()}
            </Text>
          </View>
          <Text style={styles.intimacyText}>
            {member.weightSeries.length > 1
              ? `${weightDelta <= 0 ? 'Down' : 'Up'} ${Math.abs(weightDelta)} kg since ${member.weightSeries[0].label}, training on a ${member.streakWeeks}-week streak with ${member.visitsThisMonth} visits this month. This progress is ${member.name.split(' ')[0]}'s — and it is worth showing off.`
              : `Just getting started: ${member.visitsThisMonth} visits in the first month and a ${member.streakWeeks}-week streak already. Early consistency like this is what sticks.`}
          </Text>
        </Card>
      </AnimatedIn>

      <AnimatedIn index={5}>
        <SectionTitle title="Progress card — made to be shared" />
        <View style={styles.shareCard}>
          <Text style={styles.shareGym}>POWERHOUSE GYM · MINGORA</Text>
          <Text style={styles.shareResult}>
            {member.weightSeries.length > 1
              ? `${weightDelta <= 0 ? '−' : '+'}${Math.abs(weightDelta)} kg`
              : `${member.streakWeeks}-week streak`}
          </Text>
          <Text style={styles.shareSub}>
            {member.name} · {member.goal} · since {member.weightSeries[0]?.label ?? member.joined}
          </Text>
          <View style={styles.shareFooter}>
            <Flame size={13} color={theme.colors.accent} />
            <Text style={styles.shareFooterText}>
              {member.streakWeeks} week streak · Progress tracked with FitTrack
            </Text>
          </View>
        </View>
        {cardShared ? (
          <View style={styles.sentRow}>
            <View style={styles.sentIcon}>
              <Check size={13} color="#FFFFFF" strokeWidth={3} />
            </View>
            <Text style={styles.sentText}>
              Card sent to {member.name.split(' ')[0]} on WhatsApp
            </Text>
          </View>
        ) : (
          <View style={styles.actionBtn}>
            <PrimaryButton
              label="Send card to member"
              onPress={() => setCardShared(true)}
              accessibilityLabel={`Send progress card to ${member.name}`}
            />
          </View>
        )}
        <View style={styles.shareHintRow}>
          <Share2 size={13} color={theme.colors.textTertiary} />
          <Text style={styles.shareHint}>
            Members post these themselves — the gym’s results advertise the gym.
          </Text>
        </View>
      </AnimatedIn>

      <AnimatedIn index={6}>
        <SectionTitle title="Coach note" />
        <Card style={styles.noteCard}>
          <NotebookPen size={18} color={theme.colors.accentDark} />
          <Text style={styles.noteText}>{member.attendanceNote}</Text>
        </Card>
        <Card style={styles.detailCard}>
          <SpecRow label="Trainer" value={member.trainer} />
          <SpecRow label="Goal" value={member.goal} />
          <SpecRow label="Phone" value={member.phone} last />
        </Card>
      </AnimatedIn>
    </ScrollView>
  );
}

function SpecRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.specRow, !last && styles.specDivider]}>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.canvas },
  content: { padding: theme.spacing.xl, paddingBottom: theme.spacing.xxxl },
  emptyWrap: {
    flex: 1,
    backgroundColor: theme.colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.fontSize.title,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  emptyText: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  identity: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  identityMain: { flex: 1 },
  name: {
    fontSize: theme.fontSize.title,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  meta: { fontSize: theme.fontSize.caption, color: theme.colors.textSecondary, marginTop: 2 },
  statRow: { flexDirection: 'row', gap: theme.spacing.md, marginTop: theme.spacing.xl },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  statValueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statValue: {
    fontSize: theme.fontSize.section,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  statLabel: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 3, textAlign: 'center' },
  planTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  planName: {
    fontSize: theme.fontSize.body,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  planMeta: { fontSize: theme.fontSize.caption, color: theme.colors.textSecondary, marginTop: 2 },
  planPrice: {
    fontSize: theme.fontSize.body,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  progressWrap: { marginTop: theme.spacing.lg },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: theme.spacing.md },
  feeText: { fontSize: theme.fontSize.caption, color: theme.colors.textSecondary },
  feePct: {
    fontSize: theme.fontSize.caption,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  actionBtn: { marginTop: theme.spacing.lg },
  sentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.successTint,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    minHeight: 48,
  },
  sentIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sentText: {
    flex: 1,
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.success,
  },
  weightTop: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexWrap: 'wrap',
  },
  weightValue: { fontSize: 24, fontWeight: theme.fontWeight.bold, color: theme.colors.text },
  weightDelta: { fontSize: theme.fontSize.caption, fontWeight: theme.fontWeight.semibold },
  weightGood: { color: theme.colors.success },
  weightUp: { color: theme.colors.accent },
  noteCard: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  intimacyCard: { marginTop: theme.spacing.xs },
  intimacyHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  intimacyTitle: {
    fontSize: 12,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 1.1,
    color: theme.colors.accent,
  },
  intimacyText: {
    fontSize: theme.fontSize.small,
    lineHeight: 20,
    color: theme.colors.text,
  },
  shareCard: {
    backgroundColor: theme.colors.ink,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.xl,
  },
  shareGym: {
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 1.6,
    color: theme.colors.accent,
  },
  shareResult: {
    fontSize: 44,
    fontWeight: theme.fontWeight.extrabold,
    color: '#FFFFFF',
    marginTop: theme.spacing.md,
  },
  shareSub: {
    fontSize: theme.fontSize.small,
    color: '#D8D3CB',
    marginTop: theme.spacing.xs,
  },
  shareFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#2E2B28',
  },
  shareFooterText: { fontSize: 12, color: '#D8D3CB', fontWeight: theme.fontWeight.medium },
  shareHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
  },
  shareHint: { flex: 1, fontSize: 12, color: theme.colors.textTertiary, lineHeight: 17 },
  noteText: { flex: 1, fontSize: theme.fontSize.small, color: theme.colors.text, lineHeight: 20 },
  detailCard: {},
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  specDivider: { borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  specLabel: { fontSize: theme.fontSize.small, color: theme.colors.textSecondary },
  specValue: {
    flex: 1,
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    textAlign: 'right',
  },
});
