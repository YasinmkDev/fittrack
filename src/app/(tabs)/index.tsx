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
  PartyPopper,
  Sparkles,
  X,
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
import { CLASSES_TODAY, GYM, MEMBERS, RECOMMENDATIONS } from '../../data/seed';
import { rs, rsCompact } from '../../lib/format';
import { theme } from '../../theme/theme';

export default function HomeScreen() {
  const feesPct = GYM.feesCollected / GYM.feesTarget;
  const liveClass = CLASSES_TODAY.find((c) => c.state === 'live');
  const nextClass = CLASSES_TODAY.find((c) => c.state === 'upcoming');

  // ---- Habit loop state (Hook: trigger → action → reward → investment) ----
  const [inGym, setInGym] = useState(GYM.inGymNow);
  const [checkins, setCheckins] = useState(GYM.checkinsToday);
  const [checkedIn, setCheckedIn] = useState<string[]>([]);
  const [manualMissions, setManualMissions] = useState<string[]>([]);
  const [recIndex, setRecIndex] = useState(0);

  const expectedNow = MEMBERS.filter((m) => GYM.expectedNowIds.includes(m.id));
  const checkinMissionDone = checkedIn.length >= expectedNow.length;
  const missionsDone =
    (checkinMissionDone ? 1 : 0) +
    (manualMissions.includes('fees') ? 1 : 0) +
    (manualMissions.includes('remind') ? 1 : 0);
  const allMissionsDone = missionsDone === 3;
  const recommendation = RECOMMENDATIONS[recIndex] ?? null;

  const checkIn = (memberId: string) => {
    if (checkedIn.includes(memberId)) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCheckedIn((prev) => [...prev, memberId]);
    setInGym((n) => n + 1);
    setCheckins((n) => n + 1);
  };

  const toggleMission = (id: string) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setManualMissions((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));
  };

  const openRecommendation = () => {
    if (!recommendation) return;
    if (recommendation.route === 'member' && recommendation.targetId) {
      router.push(`/member/${recommendation.targetId}`);
    } else if (recommendation.route === 'payments') {
      router.push('/(tabs)/payments');
    } else {
      router.push('/(tabs)/join');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AnimatedIn index={0}>
          <View style={styles.header}>
            <View style={styles.headerMain}>
              <Text style={styles.greeting}>
                {GYM.area} · Evening, {GYM.owner}
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

        {/* ---------- DARK HERO: the hierarchy anchor ---------- */}
        <AnimatedIn index={1}>
          <View style={styles.hero}>
            <View style={styles.heroTopRow}>
              <View style={styles.liveLabelRow}>
                <View style={styles.liveDot} />
                <Text style={styles.heroKicker}>LIVE FLOOR</Text>
              </View>
              <View style={styles.streakChip}>
                <Flame size={13} color={theme.colors.accent} />
                <Text style={styles.streakChipText}>{GYM.ownerStreakDays}-day owner streak</Text>
              </View>
            </View>
            <View style={styles.heroCountRow}>
              <AnimatedNumber value={inGym} format={(n) => `${n}`} style={styles.heroCount} />
              <Text style={styles.heroCapacity}>/ {GYM.capacityNow} on the floor</Text>
            </View>
            <Text style={styles.heroSub}>
              {checkins} check-ins today · your peak (5–8 PM) is starting
            </Text>
            <View style={styles.heroGoalRow}>
              <Ring value={inGym / GYM.floorGoal} size={64} strokeWidth={6}>
                <Text style={styles.heroRingText}>
                  {Math.round((inGym / GYM.floorGoal) * 100)}%
                </Text>
              </Ring>
              <View style={styles.heroGoalMain}>
                <Text style={styles.heroGoalTitle}>Floor goal: {GYM.floorGoal} by 8 PM</Text>
                <Text style={styles.heroGoalSub}>
                  {GYM.floorGoal - inGym} more members puts you past it. Every check-in below moves
                  this ring.
                </Text>
              </View>
            </View>
            <View style={styles.heroStats}>
              <View style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{GYM.totalMembers}</Text>
                <Text style={styles.heroStatLabel}>Members</Text>
              </View>
              <View style={styles.heroDivider} />
              <View style={styles.heroStat}>
                <Text style={[styles.heroStatValue, styles.heroStatAccent]}>
                  +{GYM.newThisMonth}
                </Text>
                <Text style={styles.heroStatLabel}>New this month</Text>
              </View>
              <View style={styles.heroDivider} />
              <View style={styles.heroStat}>
                <Text style={[styles.heroStatValue, styles.heroStatDanger]}>
                  {GYM.overdueMembers}
                </Text>
                <Text style={styles.heroStatLabel}>Fees overdue</Text>
              </View>
            </View>
          </View>
        </AnimatedIn>

        {/* ---------- MISSIONS: the addictive layer ---------- */}
        <AnimatedIn index={2}>
          <SectionTitle kicker="Habit loop" title={`Today's missions — ${missionsDone} of 3`} />
          <Card padded={false} style={styles.missionCard}>
            <MissionRow
              done={checkinMissionDone}
              title={`Check in ${expectedNow.length} expected members`}
              progress={`${checkedIn.length} of ${expectedNow.length} done — use the desk row below`}
              auto
            />
            <MissionRow
              done={manualMissions.includes('fees')}
              title="Collect one overdue fee"
              progress="Imran Ullah · Rs 3,000 · 6 days overdue"
              onToggle={() => toggleMission('fees')}
              divider
            />
            <MissionRow
              done={manualMissions.includes('remind')}
              title="Send one renewal reminder"
              progress="Fatima Noor expires in 3 days"
              onToggle={() => toggleMission('remind')}
              divider
            />
          </Card>
          {allMissionsDone && (
            <AnimatedIn index={0}>
              <View style={styles.perfectDay}>
                <PartyPopper size={20} color={theme.colors.success} />
                <View style={styles.perfectMain}>
                  <Text style={styles.perfectTitle}>Perfect day — all missions complete</Text>
                  <Text style={styles.perfectSub}>
                    Do it again tomorrow and the streak hits {GYM.ownerStreakDays + 1} days.
                  </Text>
                </View>
              </View>
            </AnimatedIn>
          )}
        </AnimatedIn>

        {/* ---------- QUICK CHECK-IN ---------- */}
        <AnimatedIn index={3}>
          <SectionTitle kicker="Front desk" title="Expected now — tap to check in" />
          <Card padded={false} style={styles.checkinCard}>
            {expectedNow.map((member, i) => {
              const isIn = checkedIn.includes(member.id);
              return (
                <View key={member.id} style={[styles.checkinRow, i > 0 && styles.checkinDivider]}>
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
                    style={[styles.checkinBtn, isIn && styles.checkinBtnDone]}
                  >
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

        {/* ---------- FOR YOU: intimacy that reacts ---------- */}
        <AnimatedIn index={4}>
          <SectionTitle kicker="For you · from your data" title="Recommended next move" />
          {recommendation ? (
            <Card>
              <Text style={styles.recTitle}>{recommendation.title}</Text>
              <Text style={styles.recReason}>{recommendation.reason}</Text>
              <View style={styles.recActions}>
                <Pressable
                  onPress={openRecommendation}
                  accessibilityRole="button"
                  accessibilityLabel={recommendation.actionLabel}
                  style={styles.recPrimary}
                >
                  <Text style={styles.recPrimaryLabel}>{recommendation.actionLabel}</Text>
                  <ChevronRight size={15} color="#FFFFFF" />
                </Pressable>
                <Pressable
                  onPress={() => setRecIndex((i) => i + 1)}
                  accessibilityRole="button"
                  accessibilityLabel="Dismiss this recommendation"
                  style={styles.recDismiss}
                >
                  <X size={15} color={theme.colors.textSecondary} />
                  <Text style={styles.recDismissLabel}>Not now</Text>
                </Pressable>
              </View>
              <Text style={styles.recCounter}>
                {recIndex + 1} of {RECOMMENDATIONS.length} · refreshes from tonight’s data
              </Text>
            </Card>
          ) : (
            <Card>
              <Text style={styles.recTitle}>You’re all caught up</Text>
              <Text style={styles.recReason}>
                No more moves worth your time today. New recommendations generate from tonight’s
                check-ins and payments.
              </Text>
            </Card>
          )}
        </AnimatedIn>

        <AnimatedIn index={5}>
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

        <AnimatedIn index={6}>
          <SectionTitle kicker="Don't lose them" title="Needs your attention" />
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

        <AnimatedIn index={7}>
          <Card style={styles.insightCard}>
            <View style={styles.insightHead}>
              <Sparkles size={16} color={theme.colors.accent} />
              <Text style={styles.insightTitle}>YOUR GYM, IN ONE LINE</Text>
            </View>
            <Text style={styles.insightText}>{GYM.insight}</Text>
            <Text style={styles.insightCaption}>From this week’s check-ins and fee data</Text>
          </Card>
        </AnimatedIn>

        <AnimatedIn index={8}>
          <SectionTitle kicker="This week" title="Attendance — tap a day" />
          <Card>
            <AttendanceBars
              data={GYM.attendanceWeek}
              labels={GYM.attendanceDays}
              details={GYM.attendanceDetails}
            />
          </Card>
        </AnimatedIn>

        <AnimatedIn index={9}>
          <SectionTitle
            kicker="Schedule"
            title="On the floor today"
            actionLabel="All classes"
            onAction={() => router.push('/(tabs)/schedule')}
          />
          {liveClass && <ClassCard gymClass={liveClass} />}
          {nextClass && <ClassCard gymClass={nextClass} />}
        </AnimatedIn>

        <AnimatedIn index={10}>
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
      </ScrollView>
    </SafeAreaView>
  );
}

function MissionRow({
  done,
  title,
  progress,
  onToggle,
  auto = false,
  divider = false,
}: {
  done: boolean;
  title: string;
  progress: string;
  onToggle?: () => void;
  auto?: boolean;
  divider?: boolean;
}) {
  return (
    <View style={[styles.missionRow, divider && styles.missionDivider]}>
      <Pressable
        onPress={auto ? undefined : onToggle}
        disabled={auto}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: done }}
        accessibilityLabel={title}
        style={[styles.missionBox, done && styles.missionBoxDone]}
      >
        {done && <Check size={15} color="#FFFFFF" strokeWidth={3} />}
      </Pressable>
      <View style={styles.missionMain}>
        <Text style={[styles.missionTitle, done && styles.missionTitleDone]}>{title}</Text>
        <Text style={styles.missionProgress}>{progress}</Text>
      </View>
      {done ? (
        <Text style={styles.missionDoneLabel}>Done</Text>
      ) : auto ? (
        <Text style={styles.missionAutoLabel}>Auto</Text>
      ) : (
        <Text style={styles.missionAutoLabel}>Tap box</Text>
      )}
    </View>
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
    fontSize: theme.fontSize.display,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    letterSpacing: -0.5,
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
  // ---- hero ----
  hero: {
    backgroundColor: theme.colors.ink,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.xl,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  liveLabelRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.accent },
  heroKicker: {
    fontSize: 12,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 1.6,
    color: theme.colors.accent,
  },
  streakChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.inkSoft,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
  },
  streakChipText: {
    fontSize: 12,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.inkText,
  },
  heroCountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  heroCount: {
    fontSize: theme.fontSize.hero,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.inkText,
    letterSpacing: -1.5,
  },
  heroCapacity: { fontSize: theme.fontSize.small, color: theme.colors.inkTextMuted },
  heroSub: { fontSize: theme.fontSize.caption, color: theme.colors.inkTextMuted, marginTop: 2 },
  heroGoalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.inkSoft,
    borderRadius: theme.radii.md,
    padding: theme.spacing.lg,
  },
  heroRingText: {
    fontSize: theme.fontSize.caption,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.inkText,
  },
  heroGoalMain: { flex: 1 },
  heroGoalTitle: {
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.inkText,
  },
  heroGoalSub: {
    fontSize: 12,
    color: theme.colors.inkTextMuted,
    marginTop: 3,
    lineHeight: 17,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.inkSoft,
  },
  heroStat: { flex: 1 },
  heroStatValue: {
    fontSize: theme.fontSize.section,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.inkText,
  },
  heroStatAccent: { color: theme.colors.accent },
  heroStatDanger: { color: '#F87171' },
  heroStatLabel: { fontSize: 12, color: theme.colors.inkTextMuted, marginTop: 2 },
  heroDivider: {
    width: 1,
    height: 30,
    backgroundColor: theme.colors.inkSoft,
    marginHorizontal: theme.spacing.md,
  },
  // ---- missions ----
  missionCard: { paddingHorizontal: theme.spacing.xl, overflow: 'hidden' },
  missionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    minHeight: 64,
  },
  missionDivider: { borderTopWidth: 1, borderTopColor: theme.colors.border },
  missionBox: {
    width: 30,
    height: 30,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: theme.colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  missionBoxDone: { backgroundColor: theme.colors.success, borderColor: theme.colors.success },
  missionMain: { flex: 1 },
  missionTitle: {
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  missionTitleDone: { color: theme.colors.textSecondary, textDecorationLine: 'line-through' },
  missionProgress: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  missionDoneLabel: {
    fontSize: theme.fontSize.caption,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.success,
  },
  missionAutoLabel: { fontSize: 12, color: theme.colors.textTertiary },
  perfectDay: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.successTint,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
    alignItems: 'flex-start',
  },
  perfectMain: { flex: 1 },
  perfectTitle: {
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.success,
  },
  perfectSub: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  // ---- check-in ----
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
  checkinMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
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
  // ---- recommendations ----
  recTitle: {
    fontSize: theme.fontSize.title,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    lineHeight: 27,
    letterSpacing: -0.3,
  },
  recReason: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginTop: theme.spacing.sm,
  },
  recActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  recPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.ink,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 44,
  },
  recPrimaryLabel: {
    color: '#FFFFFF',
    fontSize: theme.fontSize.caption,
    fontWeight: theme.fontWeight.bold,
  },
  recDismiss: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minHeight: 44,
    paddingHorizontal: theme.spacing.sm,
  },
  recDismissLabel: {
    fontSize: theme.fontSize.caption,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSecondary,
  },
  recCounter: { fontSize: 12, color: theme.colors.textTertiary, marginTop: theme.spacing.md },
  // ---- fees / attention / insight ----
  feesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    marginTop: theme.spacing.xxl,
  },
  feesMain: { flex: 1 },
  label: {
    fontSize: theme.fontSize.caption,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
  },
  bigNumber: {
    fontSize: 30,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
    letterSpacing: -0.5,
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
  insightCard: {},
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
  insightCaption: { fontSize: 12, color: theme.colors.textTertiary, marginTop: theme.spacing.sm },
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
});
