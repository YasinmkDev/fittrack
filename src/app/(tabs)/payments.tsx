import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIn } from '../../components/AnimatedIn';
import { AnimatedNumber } from '../../components/AnimatedNumber';
import { Avatar } from '../../components/Avatar';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { ProgressBar } from '../../components/ProgressBar';
import { SectionTitle } from '../../components/Section';
import { GYM, MEMBERS, PAYMENTS } from '../../data/seed';
import { rs, rsCompact } from '../../lib/format';
import { theme } from '../../theme/theme';

export default function PaymentsScreen() {
  const feesPct = GYM.feesCollected / GYM.feesTarget;
  const dueMembers = MEMBERS.filter((m) => m.feeTotal - m.feePaid > 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Payments</Text>
          <Text style={styles.subtitle}>Fees — collected, due and overdue</Text>
        </View>

        <AnimatedIn index={0}>
          <Card>
            <Text style={styles.label}>Collected in October</Text>
            <AnimatedNumber value={GYM.feesCollected} format={rs} style={styles.bigNumber} />
            <View style={styles.progressWrap}>
              <ProgressBar value={feesPct} />
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>
                Target {rs(GYM.feesTarget)} · {Math.round(feesPct * 100)}%
              </Text>
              <Chip label={`${rsCompact(GYM.feesOutstanding)} outstanding`} tone="warning" />
            </View>
            <View style={styles.noteRow}>
              <Text style={styles.noteText}>
                {GYM.overdueMembers} members are overdue. Send fee reminders from each member page
                — they go on WhatsApp.
              </Text>
            </View>
          </Card>
        </AnimatedIn>

        <AnimatedIn index={1}>
          <SectionTitle title="Who still owes" />
          <Card padded={false} style={styles.dueCard}>
            {dueMembers.map((member, i) => {
              const due = member.feeTotal - member.feePaid;
              return (
                <Pressable
                  key={member.id}
                  onPress={() => router.push(`/member/${member.id}`)}
                  accessibilityRole="button"
                  accessibilityLabel={`${member.name} owes ${rs(due)}`}
                  style={[styles.dueRow, i > 0 && styles.dueDivider]}>
                  <Avatar name={member.name} size={40} />
                  <View style={styles.dueMain}>
                    <Text style={styles.dueName} numberOfLines={1}>
                      {member.name}
                    </Text>
                    <Text style={styles.dueMeta}>
                      Paid {rs(member.feePaid)} of {rs(member.feeTotal)}
                    </Text>
                  </View>
                  <Text style={styles.dueAmount}>{rsCompact(due)} due</Text>
                  <ChevronRight size={17} color={theme.colors.textTertiary} />
                </Pressable>
              );
            })}
          </Card>
        </AnimatedIn>

        <AnimatedIn index={2}>
          <SectionTitle title="Recent payments" />
          <Card padded={false} style={styles.recentCard}>
            {PAYMENTS.map((payment, i) => (
              <View key={payment.id} style={[styles.recentRow, i > 0 && styles.recentDivider]}>
                <View style={styles.recentMain}>
                  <Text style={styles.recentName} numberOfLines={1}>
                    {payment.name}
                  </Text>
                  <Text style={styles.recentMeta}>
                    {payment.kind} · {payment.method} · {payment.when}
                  </Text>
                </View>
                <Text style={styles.recentAmount}>+{rs(payment.amount)}</Text>
              </View>
            ))}
          </Card>
        </AnimatedIn>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.canvas },
  content: { padding: theme.spacing.xl, paddingBottom: theme.spacing.xxxl },
  header: { marginBottom: theme.spacing.xl },
  title: { fontSize: theme.fontSize.display, fontWeight: theme.fontWeight.bold, color: theme.colors.text },
  subtitle: { fontSize: theme.fontSize.small, color: theme.colors.textSecondary, marginTop: theme.spacing.xs },
  label: { fontSize: theme.fontSize.caption, fontWeight: theme.fontWeight.medium, color: theme.colors.textSecondary },
  bigNumber: { fontSize: 30, fontWeight: theme.fontWeight.bold, color: theme.colors.text, marginTop: theme.spacing.xs },
  progressWrap: { marginTop: theme.spacing.lg },
  summaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.md, marginTop: theme.spacing.md },
  summaryText: { fontSize: theme.fontSize.caption, color: theme.colors.textSecondary },
  noteRow: { marginTop: theme.spacing.lg, paddingTop: theme.spacing.lg, borderTopWidth: 1, borderTopColor: theme.colors.border },
  noteText: { fontSize: theme.fontSize.caption, color: theme.colors.textSecondary, lineHeight: 18 },
  dueCard: { paddingHorizontal: theme.spacing.xl, overflow: 'hidden' },
  dueRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, paddingVertical: theme.spacing.lg, minHeight: 64 },
  dueDivider: { borderTopWidth: 1, borderTopColor: theme.colors.border },
  dueMain: { flex: 1 },
  dueName: { fontSize: theme.fontSize.small, fontWeight: theme.fontWeight.semibold, color: theme.colors.text },
  dueMeta: { fontSize: theme.fontSize.caption, color: theme.colors.textSecondary, marginTop: 2 },
  dueAmount: { fontSize: theme.fontSize.caption, fontWeight: theme.fontWeight.bold, color: theme.colors.danger },
  recentCard: { paddingHorizontal: theme.spacing.xl },
  recentRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.lg, gap: theme.spacing.md },
  recentDivider: { borderTopWidth: 1, borderTopColor: theme.colors.border },
  recentMain: { flex: 1 },
  recentName: { fontSize: theme.fontSize.small, fontWeight: theme.fontWeight.semibold, color: theme.colors.text },
  recentMeta: { fontSize: theme.fontSize.caption, color: theme.colors.textSecondary, marginTop: 2 },
  recentAmount: { fontSize: theme.fontSize.small, fontWeight: theme.fontWeight.bold, color: theme.colors.success },
});
