import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  AlarmClock,
  Bell,
  Check,
  ChevronRight,
  CircleAlert,
  Flame,
  Moon,
  Sparkles,
  UserCheck,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIn } from '../../components/AnimatedIn';
import { AnimatedNumber } from '../../components/AnimatedNumber';
import { AttendanceBars } from '../../components/AttendanceBars';
import { Avatar } from '../../components/Avatar';
import { Card } from '../../components/Card';
import { ClassCard } from '../../components/ClassCard';
import { Ring } from '../../components/Ring';
import { SectionTitle } from '../../components/Section';
import { CLASSES_TODAY, GYM, MEMBERS } from '../../data/seed';
import { rs, rsCompact } from '../../lib/format';
import { theme } from '../../theme/theme';

export default function HomeScreen() {
  const feesPct = GYM.feesCollected / GYM.feesTarget;
  const liveClass = CLASSES_TODAY.find((c) => c.state === 'live');
  const nextClass = CLASSES_TODAY.find((c) => c.state === 'upcoming');

  // Hook loop, live on this screen: trigger (expected now) → one-tap action
  // (check-in) → reward (counts tick, streak shows) → investment (attendance data).
  const [inGym, setInGym] = useState(GYM.inGymNow);
  const [checkins, setCheckins] = useState(GYM.checkinsToday);
  const [checkedIn, setCheckedIn] = useState<string[]>([]);
  const expectedNow = MEMBERS.filter((m) => GYM.expectedNowIds.includes(m.id));

  const checkIn = (memberId: string) => {
    if (checkedIn.includes(memberId)) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCheckedIn((prev) => [...prev, memberId]);
    setInGym((n) => n + 1);
    setCheckins((n) => n + 1);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AnimatedIn index={0}>
          <View style={styles.header}>
            <View style={styles.headerMain}>
              <Text style={styles.greeting}>
                {GYM.area} · {GYM.owner}’s gym
              </Text>
              <Text style={styles.business}>{GYM.name}</Text>
            </View>
            <Pressable
              onPress={() => router.push('/paywall')}
              accessibilityRole="button"
              accessibilityLabel="Notifications and Pro"
              style={styles.bell}
              hitSlop={8}
            >
              <Bell size={21} color={theme.colors.text} />
              <View style={styles.dot} />
            </Pressable>
          </View>
        </AnimatedIn>

        <AnimatedIn index={1}>
          <Card style={styles.liveCard}>
            <View style={styles.liveMain}>
              <View style={styles.liveLabelRow}>
                <View style={styles.liveDot} />
                <Text style={styles.liveLabel}>IN THE GYM NOW</Text>
              </View>
              <View style={styles.liveCountRow}>
                <AnimatedNumber value={inGym} format={(n) => `${n}`} style={styles.liveCount} />
                <Text style={styles.liveCapacity}>/ {GYM.capacityNow} capacity</Text>
              </View>
              <Text style={styles.liveSub}>
                {checkins} check-ins today · Peak expected 6–8 PM
              </Text>
              <View style={styles.statRow}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{GYM.totalMembers}</Text>
                  <Text style={styles.statLabel}>Members</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.stat}>
                  <Text style={[styles.statValue, styles.statAccent]}>+{GYM.newThisMonth}</Text>
                  <Text style={styles.statLabel}>New this month</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.stat}>
                  <Text style={[styles.statValue, styles.statDanger]}>{GYM.overdueMembers}</Text>
                  <Text style={styles.statLabel}>Fees overdue</Text>
                </View>
              </View>
            </View>
          </Card>
        </AnimatedIn>

        <AnimatedIn index={2}>
          <SectionTitle title="Expected now — one tap to check in" />
          <Card padded={false} style={styles.checkinCard}>
            {expectedNow.map((member, i) => {
              const isIn = checkedIn.includes(member.id);
              return (
                <View
                  key={member.id}
                  style={[styles.checkinRow, i > 0 && styles.checkinDivider]}>
                  <Avatar name={member.name} size={40} />
                  <View style={styles.checkinMain}>
                    <Text style={styles.checkinName} numberOfLines={1}>
                      {member.name}
                    </Text>
                    <View style={styles.checkinMetaRow}>
                      <Flame size={12} color={theme.colors.accent} />
                      <Text style={styles.checkinMeta}>
                        {member.streakWeeks} wk streak · usually in by now
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    onPress={() => checkIn(member.id)}
                    disabled={isIn}
                    accessibilityRole="button"
                    accessibilityLabel={
                      isIn ? `${member.name} checked in` : `Check in ${member.name}`
                    }
                    style={[styles.checkinBtn, isIn && styles.checkinBtnDone]}>
                    {isIn ? (
                      <Check size={16} color="#FFFFFF" strokeWidth={3} />
                    ) : (
                      <Text style={styles.checkinBtnLabel}>Check in</Text>
                    )}
                  </Pressable>
                </View>
              );
            })}
          </Card>
        </AnimatedIn>

        <AnimatedIn index={3}>
          <Card style={styles.feesCard}>
            <View style={styles.feesMain}>
              <Text style={styles.label}>Fees collected this month</Text>
              <AnimatedNumber value={GYM.feesCollected} format={rs} style={styles.bigNumber} />
              <Text style={styles.sub}>
                of {rs(GYM.feesTarget)} · {rsCompact(GYM.feesOutstanding)} still outstanding
              </Text>
            </View>
            <Ring value={feesPct} size={82}>
              <Text style={styles.ringText}>{Math.round(feesPct * 100)}%</Text>
            </Ring>
          </Card>
        </AnimatedIn>

        <AnimatedIn index={4}>
          <SectionTitle title="Needs your attention" />
          <Card padded={false} style={styles.attentionCard}>
            <AttentionRow
              icon={<AlarmClock size={19} color={theme.colors.warning} />}
              tint={theme.colors.warningTint}
              title="Fatima Noor expires in 3 days"
              sub="Quarterly plan · renews on time every cycle. Send the link."
              onPress={() => router.push('/member/m2')}
            />
            <AttentionRow
              icon={<CircleAlert size={19} color={theme.colors.danger} />}
              tint={theme.colors.dangerTint}
              title="Imran Ullah — fee overdue, 11 days absent"
              sub="Expired 6 days ago. Highest churn risk in the gym."
              onPress={() => router.push('/member/m3')}
              divider
            />
            <AttentionRow
              icon={<Moon size={19} color={theme.colors.info} />}
              tint={theme.colors.infoTint}
              title="Zubair Ahmad is frozen until 5 Nov"
              sub="Travel freeze · fee fully paid · 41 days left on resume."
              onPress={() => router.push('/member/m6')}
              divider
            />
          </Card>
        </AnimatedIn>

        <AnimatedIn index={5}>
          <Card style={styles.insightCard}>
            <View style={styles.insightHead}>
              <Sparkles size={16} color={theme.colors.accent} />
              <Text style={styles.insightTitle}>YOUR GYM, IN ONE LINE</Text>
            </View>
            <Text style={styles.insightText}>{GYM.insight}</Text>
            <Text style={styles.insightCaption}>From this week's check-ins and fee data</Text>
          </Card>
        </AnimatedIn>

        <AnimatedIn index={6}>
          <SectionTitle title="Attendance" />
          <Card>
            <Text style={styles.chartTitle}>Check-ins — last 7 days</Text>
            <AttendanceBars data={GYM.attendanceWeek} labels={GYM.attendanceDays} />
          </Card>
        </AnimatedIn>

        <AnimatedIn index={7}>
          <SectionTitle
            title="Today's classes"
            actionLabel="Schedule"
            onAction={() => router.push('/(tabs)/schedule')}
          />
          {liveClass && <ClassCard gymClass={liveClass} />}
          {nextClass && <ClassCard gymClass={nextClass} />}
        </AnimatedIn>

        <AnimatedIn index={8}>
          <Pressable
            onPress={() => router.push('/paywall')}
            accessibilityRole="button"
            accessibilityLabel="Upgrade to FitTrack Pro"
            style={({ pressed }) => [styles.proBanner, pressed && styles.pressed]}
          >
            <Sparkles size={19} color={theme.colors.accentDark} />
            <View style={styles.proMain}>
              <Text style={styles.proTitle}>Free plan — 200 member limit reached soon</Text>
              <Text style={styles.proSub}>
                Pro unlocks unlimited members and WhatsApp automation.
              </Text>
            </View>
            <ChevronRight size={18} color={theme.colors.accentDark} />
          </Pressable>
        </AnimatedIn>

        <AnimatedIn index={9}>
          <View style={styles.footerNote}>
            <UserCheck size={14} color={theme.colors.textTertiary} />
            <Text style={styles.footerText}>
              Front desk check-in is on in Settings. Members scan or search by name.
            </Text>
          </View>
        </AnimatedIn>
      </ScrollView>
    </SafeAreaView>
  );
}

function AttentionRow({
  icon,
  tint,
  title,
  sub,
  onPress,
  divider = false,
}: {
  icon: React.ReactNode;
  tint: string;
  title: string;
  sub: string;
  onPress: () => void;
  divider?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={[styles.attentionRow, divider && styles.attentionDivider]}
    >
      <View style={[styles.attentionIcon, { backgroundColor: tint }]}>{icon}</View>
      <View style={styles.attentionMain}>
        <Text style={styles.attentionTitle} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.attentionSub} numberOfLines={2}>
          {sub}
        </Text>
      </View>
      <ChevronRight size={17} color={theme.colors.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.canvas },
  content: { padding: theme.spacing.xl, paddingBottom: theme.spacing.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xl },
  headerMain: { flex: 1 },
  greeting: { fontSize: theme.fontSize.caption, color: theme.colors.textSecondary },
  business: {
    fontSize: theme.fontSize.title,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: 2,
  },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.danger,
  },
  liveCard: {},
  liveMain: {},
  liveLabelRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.accent },
  liveLabel: {
    fontSize: 12,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 1.2,
    color: theme.colors.accent,
  },
  liveCountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  liveCount: { fontSize: 42, fontWeight: theme.fontWeight.extrabold, color: theme.colors.text },
  liveCapacity: { fontSize: theme.fontSize.small, color: theme.colors.textSecondary },
  liveSub: { fontSize: theme.fontSize.caption, color: theme.colors.textSecondary, marginTop: 2 },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  stat: { flex: 1 },
  statValue: {
    fontSize: theme.fontSize.section,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  statAccent: { color: theme.colors.accent },
  statDanger: { color: theme.colors.danger },
  statLabel: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.md,
  },
  feesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  feesMain: { flex: 1 },
  label: {
    fontSize: theme.fontSize.caption,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
  },
  bigNumber: {
    fontSize: 28,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  sub: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },
  ringText: {
    fontSize: theme.fontSize.section,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  attentionCard: { overflow: 'hidden' },
  attentionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    minHeight: 64,
  },
  attentionDivider: { borderTopWidth: 1, borderTopColor: theme.colors.border },
  attentionIcon: {
    width: 38,
    height: 38,
    borderRadius: theme.radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attentionMain: { flex: 1 },
  attentionTitle: {
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    lineHeight: 19,
  },
  attentionSub: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  chartTitle: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  checkinCard: { paddingHorizontal: theme.spacing.xl, overflow: 'hidden' },
  checkinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    minHeight: 68,
  },
  checkinDivider: { borderTopWidth: 1, borderTopColor: theme.colors.border },
  checkinMain: { flex: 1 },
  checkinName: {
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  checkinMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  checkinMeta: { fontSize: theme.fontSize.caption, color: theme.colors.textSecondary },
  checkinBtn: {
    minWidth: 88,
    minHeight: 44,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  checkinBtnDone: { backgroundColor: theme.colors.success, minWidth: 44 },
  checkinBtnLabel: {
    color: '#FFFFFF',
    fontSize: theme.fontSize.caption,
    fontWeight: theme.fontWeight.bold,
  },
  insightCard: { marginTop: theme.spacing.md },
  insightHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  insightTitle: {
    fontSize: 12,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 1.1,
    color: theme.colors.accent,
  },
  insightText: {
    fontSize: theme.fontSize.body,
    lineHeight: 23,
    color: theme.colors.text,
    fontWeight: theme.fontWeight.medium,
  },
  insightCaption: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.sm,
  },
  proBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.accentTint,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.xxl,
  },
  pressed: { opacity: 0.8 },
  proMain: { flex: 1 },
  proTitle: {
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  proSub: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  footerNote: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xs,
  },
  footerText: { flex: 1, fontSize: 12, color: theme.colors.textTertiary, lineHeight: 17 },
});
