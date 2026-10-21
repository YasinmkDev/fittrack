import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import {
  AudioLines,
  Check,
  Flame,
  Plus,
  Radio,
  Target,
  Trophy,
  Wind,
  Zap,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIn } from '../../components/AnimatedIn';
import { AppHeader } from '../../components/AppHeader';
import { Ring } from '../../components/Ring';
import { HUB, MILESTONES, RETENTION_RADAR, RETENTION_RADAR_EXTRA } from '../../data/apex';
import { theme } from '../../theme/theme';

/** Command Hub — recreated exactly from the owner's reference design. */
export default function HubScreen() {
  const [nudged, setNudged] = useState<string[]>([]);
  const [flashLive, setFlashLive] = useState(false);
  const [radarExpanded, setRadarExpanded] = useState(false);
  const nudge = (id: string) =>
    setNudged((prev) => (prev.includes(id) ? prev : [...prev, id]));

  const radarList = radarExpanded
    ? [...RETENTION_RADAR, ...RETENTION_RADAR_EXTRA]
    : RETENTION_RADAR;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AnimatedIn index={0}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.kicker}>HEAD TRAINER DECK</Text>
              <Text style={styles.h1}>Command Hub</Text>
            </View>
            <View style={styles.activePill}>
              <View style={styles.activeDot} />
              <Text style={styles.activePillText}>Floor Active</Text>
            </View>
          </View>
        </AnimatedIn>

        <AnimatedIn index={1}>
          <View style={styles.card}>
            <View style={styles.pulseHead}>
              <View style={styles.pulseTitleRow}>
                <Radio size={19} color={theme.colors.accent} />
                <Text style={styles.pulseTitle}>Live Studio Pulse</Text>
              </View>
              <Text style={styles.zoneText}>Zone A • Main Arena</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.pulseMain}>
              <View style={styles.pulseStats}>
                <View style={styles.occupancyRow}>
                  <Text style={styles.occupancy}>{HUB.occupancyPct}%</Text>
                  <Text style={styles.occupancyLabel}>Occupancy</Text>
                </View>
                <Text style={styles.activeAthletes} numberOfLines={1} adjustsFontSizeToFit>
                  {HUB.activeAthletes} / {HUB.capacity} Active Athletes
                </Text>
                <Text style={styles.surge}>{HUB.surgeNote}</Text>
              </View>
              <Ring value={HUB.occupancyPct / 100} size={92} strokeWidth={8}>
                <Zap size={22} color={theme.colors.accent} fill={theme.colors.accent} />
              </Ring>
            </View>
            <View style={styles.divider} />
            <View style={styles.envRow}>
              <View style={styles.envCard}>
                <View style={styles.envIcon}>
                  <AudioLines size={17} color={theme.colors.text} />
                </View>
                <View style={styles.envText}>
                  <Text style={styles.envLabel} numberOfLines={1}>
                    Sound Pressure
                  </Text>
                  <Text style={styles.envValue} numberOfLines={1} adjustsFontSizeToFit>
                    {HUB.soundDb} dB <Text style={styles.envState}>{HUB.soundState}</Text>
                  </Text>
                </View>
              </View>
              <View style={styles.envCard}>
                <View style={styles.envIcon}>
                  <Wind size={17} color={theme.colors.text} />
                </View>
                <View style={styles.envText}>
                  <Text style={styles.envLabel} numberOfLines={1}>
                    Air Quality
                  </Text>
                  <Text style={styles.envValue} numberOfLines={1} adjustsFontSizeToFit>
                    {HUB.airPpm} ppm
                  </Text>
                  <Text style={styles.envState}>CO₂</Text>
                </View>
              </View>
            </View>
          </View>
        </AnimatedIn>

        <AnimatedIn index={2}>
          <View style={styles.actionRow}>
            <Pressable
              onPress={() => router.push('/(tabs)/join')}
              accessibilityRole="button"
              accessibilityLabel="Add walk-in"
              style={({ pressed }) => [styles.walkinBtn, pressed && styles.pressed]}>
              <Plus size={17} color="#FFFFFF" strokeWidth={2.6} />
              <Text style={styles.walkinLabel}>+ Add Walk-in</Text>
            </Pressable>
            <Pressable
              onPress={() => setFlashLive((v) => !v)}
              accessibilityRole="button"
              accessibilityState={{ selected: flashLive }}
              accessibilityLabel={flashLive ? 'Flash Challenge is live' : 'Start flash challenge'}
              style={({ pressed }) => [
                styles.flashBtn,
                flashLive && styles.flashBtnLive,
                pressed && styles.pressed,
              ]}>
              <Zap
                size={16}
                color={flashLive ? theme.colors.accent : theme.colors.text}
                fill={flashLive ? theme.colors.accent : 'transparent'}
              />
              <Text
                style={[styles.flashLabel, flashLive && styles.flashLabelLive]}
                numberOfLines={1}
                adjustsFontSizeToFit>
                {flashLive ? 'Challenge Live' : 'Flash Challenge'}
              </Text>
            </Pressable>
          </View>
        </AnimatedIn>

        <AnimatedIn index={3}>
          <View style={styles.statRow}>
            <View style={[styles.card, styles.statCard]}>
              <Text style={styles.statLabel} numberOfLines={1}>
                Today Revenue
              </Text>
              <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
                {HUB.revenue}
              </Text>
              <View style={styles.deltaPill}>
                <Text style={styles.deltaText}>{HUB.revenueDelta}</Text>
              </View>
              <Text style={styles.statFoot}>vs baseline</Text>
            </View>
            <View style={[styles.card, styles.statCard]}>
              <Text style={styles.statLabel} numberOfLines={1}>
                Check-ins
              </Text>
              <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
                {HUB.checkins}
              </Text>
              <Text style={styles.statFoot}>of {HUB.checkinsCap} cap</Text>
              <View style={styles.miniBarTrack}>
                <View
                  style={[
                    styles.miniBarFill,
                    { width: `${(HUB.checkins / HUB.checkinsCap) * 100}%` },
                  ]}
                />
              </View>
            </View>
            <View style={[styles.card, styles.statCard]}>
              <Text style={styles.statLabel} numberOfLines={1}>
                Retention
              </Text>
              <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
                {HUB.retention}
              </Text>
              <View style={styles.grayPill}>
                <Text style={styles.grayPillText}>Rolling 30d</Text>
              </View>
              <Text style={styles.statFoot}>Tier 1 Elite</Text>
            </View>
          </View>
        </AnimatedIn>

        <AnimatedIn index={4}>
          <View style={styles.card}>
            <View style={styles.sectionHead}>
              <View style={styles.pulseTitleRow}>
                <Target size={19} color={theme.colors.rust} />
                <Text style={styles.sectionTitle}>Retention Radar</Text>
              </View>
              <Pressable
                onPress={() => setRadarExpanded((v) => !v)}
                accessibilityRole="button"
                accessibilityState={{ expanded: radarExpanded }}
                accessibilityLabel={radarExpanded ? 'Show fewer athletes' : 'View all at-risk athletes'}
                hitSlop={8}>
                <Text style={styles.viewAll}>{radarExpanded ? 'Show Less ›' : 'View All ›'}</Text>
              </Pressable>
            </View>
            {radarList.map((athlete, i) => {
              const isNudged = nudged.includes(athlete.id);
              return (
                <View key={athlete.id} style={[styles.radarRow, i > 0 && styles.rowDivider]}>
                  <View style={styles.avatarWrap}>
                    <View style={styles.initialsAvatar}>
                      <Text style={styles.initialsText}>{athlete.initials}</Text>
                    </View>
                    <View
                      style={[
                        styles.badgeDot,
                        {
                          backgroundColor:
                            athlete.badge === 'red' ? theme.colors.danger : '#F59E0B',
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.radarMain}>
                    <Text style={styles.radarName} numberOfLines={1}>
                      {athlete.name}
                    </Text>
                    <Text style={styles.radarDetail}>{athlete.detail}</Text>
                  </View>
                  <Pressable
                    onPress={() => nudge(athlete.id)}
                    disabled={isNudged}
                    accessibilityRole="button"
                    accessibilityLabel={
                      isNudged ? `${athlete.name} nudged` : `Nudge ${athlete.name}`
                    }
                    style={[styles.nudgeBtn, isNudged && styles.nudgeBtnDone]}>
                    {isNudged ? (
                      <Check size={14} color="#FFFFFF" strokeWidth={3} />
                    ) : (
                      <Text style={styles.nudgeLabel}>Nudge</Text>
                    )}
                  </Pressable>
                </View>
              );
            })}
          </View>
        </AnimatedIn>

        <AnimatedIn index={5}>
          <View style={styles.card}>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>Floor Milestones</Text>
              <Text style={styles.liveFeed}>Live feed</Text>
            </View>
            {MILESTONES.map((m) => (
              <View key={m.id} style={styles.milestoneRow}>
                <View style={styles.milestoneIcon}>
                  {m.icon === 'trophy' ? (
                    <Trophy size={16} color={theme.colors.rust} />
                  ) : (
                    <Flame size={16} color={theme.colors.accent} />
                  )}
                </View>
                <View style={styles.milestoneMain}>
                  <View style={styles.milestoneTop}>
                    <Text style={styles.milestoneName} numberOfLines={1}>
                      {m.name}
                    </Text>
                    <Text style={styles.milestoneWhen}>{m.when}</Text>
                  </View>
                  <Text style={styles.milestoneText}>{m.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </AnimatedIn>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.canvas },
  content: { padding: theme.spacing.xl, paddingBottom: 120 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  kicker: {
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 1.6,
    color: theme.colors.textTertiary,
  },
  h1: {
    fontSize: theme.fontSize.display,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    letterSpacing: -0.5,
    marginTop: theme.spacing.xs,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    backgroundColor: theme.colors.surface,
    marginTop: theme.spacing.xs,
  },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.success },
  activePillText: {
    fontSize: 12,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.xl,
    marginTop: theme.spacing.xl,
    ...theme.shadow,
  },
  pulseHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  pulseTitleRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  pulseTitle: {
    fontSize: theme.fontSize.section,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  zoneText: { fontSize: 12, color: theme.colors.textSecondary },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.lg,
  },
  pulseMain: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.lg },
  pulseStats: { flex: 1 },
  occupancyRow: { flexDirection: 'row', alignItems: 'baseline', gap: theme.spacing.sm },
  occupancy: {
    fontSize: 46,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    letterSpacing: -1,
  },
  occupancyLabel: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
    flexShrink: 1,
  },
  activeAthletes: {
    fontSize: theme.fontSize.body,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  surge: { fontSize: 12, color: theme.colors.textSecondary, marginTop: theme.spacing.xs },
  envRow: { flexDirection: 'row', gap: theme.spacing.md },
  envCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
  },
  envIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  envText: { flex: 1, minWidth: 0 },
  envLabel: { fontSize: 12, color: theme.colors.textSecondary },
  envValue: {
    fontSize: theme.fontSize.body,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: 1,
  },
  envState: { fontSize: 12, color: theme.colors.textSecondary, fontWeight: theme.fontWeight.regular },
  actionRow: { flexDirection: 'row', gap: theme.spacing.md, marginTop: theme.spacing.xl },
  walkinBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.pill,
    minHeight: 50,
  },
  walkinLabel: { color: '#FFFFFF', fontSize: theme.fontSize.body, fontWeight: theme.fontWeight.semibold },
  flashBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.pill,
    minHeight: 50,
  },
  flashLabel: {
    color: theme.colors.text,
    fontSize: theme.fontSize.body,
    fontWeight: theme.fontWeight.semibold,
    flexShrink: 1,
  },
  flashBtnLive: { backgroundColor: theme.colors.accentTint, borderColor: theme.colors.accent },
  flashLabelLive: { color: theme.colors.accent },
  pressed: { opacity: 0.85 },
  statRow: { flexDirection: 'row', gap: theme.spacing.md },
  statCard: { flex: 1, marginTop: theme.spacing.xl, padding: theme.spacing.lg },
  statLabel: { fontSize: 12, color: theme.colors.textSecondary },
  statValue: {
    fontSize: 21,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    letterSpacing: -0.3,
  },
  deltaPill: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.successTint,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    marginTop: theme.spacing.sm,
  },
  deltaText: { fontSize: 12, fontWeight: theme.fontWeight.bold, color: theme.colors.success },
  grayPill: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    marginTop: theme.spacing.sm,
  },
  grayPillText: { fontSize: 12, fontWeight: theme.fontWeight.semibold, color: theme.colors.textSecondary },
  statFoot: { fontSize: 12, color: theme.colors.textTertiary, marginTop: theme.spacing.sm },
  miniBarTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: theme.colors.surfaceAlt,
    marginTop: theme.spacing.sm,
    overflow: 'hidden',
  },
  miniBarFill: { height: '100%', borderRadius: 3, backgroundColor: theme.colors.accent },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.fontSize.section,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  viewAll: { fontSize: theme.fontSize.caption, fontWeight: theme.fontWeight.semibold, color: theme.colors.accent },
  liveFeed: { fontSize: 12, color: theme.colors.textSecondary },
  radarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  rowDivider: { borderTopWidth: 1, borderTopColor: theme.colors.border },
  avatarWrap: { position: 'relative' },
  initialsAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textSecondary,
  },
  badgeDot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  radarMain: { flex: 1, minWidth: 0 },
  radarName: { fontSize: theme.fontSize.body, fontWeight: theme.fontWeight.semibold, color: theme.colors.text },
  radarDetail: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
  nudgeBtn: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 74,
  },
  nudgeBtnDone: { backgroundColor: theme.colors.success },
  nudgeLabel: { color: '#FFFFFF', fontSize: theme.fontSize.caption, fontWeight: theme.fontWeight.bold },
  milestoneRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radii.md,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  milestoneIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneMain: { flex: 1, minWidth: 0 },
  milestoneTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: theme.spacing.sm,
  },
  milestoneName: {
    fontSize: theme.fontSize.body,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    flexShrink: 1,
  },
  milestoneWhen: { fontSize: 12, color: theme.colors.textTertiary },
  milestoneText: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
    lineHeight: 19,
    marginTop: 2,
  },
});
