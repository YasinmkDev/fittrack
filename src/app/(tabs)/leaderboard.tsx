import { useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ArrowRight, Star, Trophy, Zap } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIn } from '../../components/AnimatedIn';
import { AppHeader } from '../../components/AppHeader';
import { CONTENDERS, TOURNAMENT, TRAINERS } from '../../data/apex';
import { theme } from '../../theme/theme';

/** Leaderboard — recreated exactly from the owner's reference design. */
export default function LeaderboardScreen() {
  const [launched, setLaunched] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AnimatedIn index={0}>
          <View style={styles.card}>
            <View style={styles.tourneyHead}>
              <Text style={styles.kicker}>TOURNAMENT SPOTLIGHT</Text>
              <Text style={styles.season}>Live Season 04</Text>
            </View>
            <Text style={styles.tourneyTitle}>{TOURNAMENT.title}</Text>
            <Text style={styles.tourneySub}>{TOURNAMENT.subtitle}</Text>
            <ImageBackground
              source={{ uri: TOURNAMENT.image }}
              style={styles.banner}
              imageStyle={styles.bannerImage}>
              <View style={styles.bannerShade} />
              <View style={styles.prizeRow}>
                <Trophy size={17} color="#FFFFFF" />
                <Text style={styles.prizeText}>{TOURNAMENT.prize}</Text>
              </View>
            </ImageBackground>
            <View style={styles.progressHead}>
              <Text style={styles.dayText}>{TOURNAMENT.day}</Text>
              <Text style={styles.completedText}>{TOURNAMENT.completed}</Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${TOURNAMENT.progress * 100}%` }]}
              />
            </View>
            <View style={styles.progressFoot}>
              <Text style={styles.footGray}>{TOURNAMENT.started}</Text>
              <Text style={styles.footGray}>{TOURNAMENT.ends}</Text>
            </View>
          </View>
        </AnimatedIn>

        <AnimatedIn index={1}>
          <View style={styles.fameHead}>
            <Text style={styles.h2}>Trainer Hall of Fame</Text>
            <Text style={styles.viewAll}>View All ›</Text>
          </View>
          <Text style={styles.fameSub}>October Performance Metrics</Text>
        </AnimatedIn>

        <AnimatedIn index={2}>
          <View style={styles.podium}>
            <PodiumCard
              name={TRAINERS.second.name}
              role={TRAINERS.second.role}
              photo={TRAINERS.second.photo}
              earnings={TRAINERS.second.earnings}
              retention={TRAINERS.second.retention}
              rank={2}
            />
            <View style={styles.leaderCard}>
              <View style={styles.leaderBadge}>
                <Star size={11} color="#FFFFFF" fill="#FFFFFF" />
                <Text style={styles.leaderBadgeText}>#1 Leader</Text>
              </View>
              <Image source={{ uri: TRAINERS.leader.photo }} style={styles.leaderPhoto} />
              <Text style={styles.leaderName}>{TRAINERS.leader.name}</Text>
              <Text style={styles.leaderRole}>{TRAINERS.leader.role}</Text>
              <View style={styles.cardDivider} />
              <Text style={styles.leaderEarnings}>{TRAINERS.leader.earnings}</Text>
              <Text style={styles.leaderRetention}>{TRAINERS.leader.retention}</Text>
            </View>
            <PodiumCard
              name={TRAINERS.third.name}
              role={TRAINERS.third.role}
              photo={TRAINERS.third.photo}
              earnings={TRAINERS.third.earnings}
              retention={TRAINERS.third.retention}
              rank={3}
            />
          </View>
        </AnimatedIn>

        <AnimatedIn index={3}>
          <View style={styles.card}>
            <View style={styles.standingsHead}>
              <Text style={styles.cardTitle}>Contender Standings</Text>
              <View style={styles.tierPill}>
                <Text style={styles.tierText}>Global Tier 1</Text>
              </View>
            </View>
            {CONTENDERS.map((c, i) => (
              <View key={c.rank} style={[styles.contenderRow, i > 0 && styles.rowDivider]}>
                <Text style={styles.rank}>{c.rank}</Text>
                <Image source={{ uri: c.photo }} style={styles.contenderPhoto} />
                <View style={styles.contenderMain}>
                  <Text style={styles.contenderName}>{c.name}</Text>
                  <Text style={styles.contenderSessions}>{c.sessions}</Text>
                </View>
                <View style={styles.xpCol}>
                  <Text style={[styles.xp, c.rank === 1 && styles.xpBlue]}>{c.xp}</Text>
                  <Text style={[styles.xpNote, c.xpNoteRust && styles.xpNoteRust]}>
                    {c.xpNote}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </AnimatedIn>

        <AnimatedIn index={4}>
          <View style={styles.card}>
            <View style={styles.growthHead}>
              <Text style={styles.kicker}>TRAINER GROWTH ENGINE</Text>
              <Zap size={18} color={theme.colors.accent} fill={theme.colors.accent} />
            </View>
            <Text style={styles.growthTitle}>1-Tap PT Boost Campaign</Text>
            <Text style={styles.growthBody}>
              Target unengaged top-tier members with personalized coaching incentives.
              Projected studio impact: <Text style={styles.growthImpact}>+$4,290 MRR.</Text>
            </Text>
            <Pressable
              onPress={() => setLaunched(true)}
              disabled={launched}
              accessibilityRole="button"
              accessibilityLabel={launched ? 'Campaign launched' : 'Launch auto-campaign'}
              style={({ pressed }) => [
                styles.launchBtn,
                launched && styles.launchBtnDone,
                pressed && styles.pressed,
              ]}>
              <Text style={styles.launchLabel}>
                {launched ? 'Campaign Launched ✓' : 'Launch Auto-Campaign'}
              </Text>
              {!launched && <ArrowRight size={16} color="#FFFFFF" />}
            </Pressable>
          </View>
        </AnimatedIn>
      </ScrollView>
    </SafeAreaView>
  );
}

function PodiumCard({
  name,
  role,
  photo,
  earnings,
  retention,
  rank,
}: {
  name: string;
  role: string;
  photo: string;
  earnings: string;
  retention: string;
  rank: number;
}) {
  return (
    <View style={styles.sideCard}>
      <View style={styles.avatarWrap}>
        <Image source={{ uri: photo }} style={styles.sidePhoto} />
        <View style={styles.rankBadge}>
          <Text style={styles.rankBadgeText}>{rank}</Text>
        </View>
      </View>
      <Text style={styles.sideName}>{name}</Text>
      <Text style={styles.sideRole}>{role}</Text>
      <View style={styles.cardDivider} />
      <Text style={styles.sideEarnings}>{earnings}</Text>
      <Text style={styles.sideRetention}>{retention}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.canvas },
  content: { padding: theme.spacing.xl, paddingBottom: theme.spacing.xxxl },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.xl,
    marginTop: theme.spacing.xl,
    ...theme.shadow,
  },
  kicker: {
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 1.6,
    color: theme.colors.rust,
  },
  tourneyHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  season: { fontSize: 12, color: theme.colors.textSecondary },
  tourneyTitle: {
    fontSize: 25,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    letterSpacing: -0.4,
    lineHeight: 31,
    marginTop: theme.spacing.md,
  },
  tourneySub: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  banner: {
    height: 132,
    borderRadius: theme.radii.md,
    overflow: 'hidden',
    marginTop: theme.spacing.lg,
    justifyContent: 'flex-end',
  },
  bannerImage: { borderRadius: theme.radii.md },
  bannerShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10,10,10,0.28)',
  },
  prizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  prizeText: { color: '#FFFFFF', fontSize: 17, fontWeight: theme.fontWeight.extrabold },
  progressHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: theme.spacing.lg,
  },
  dayText: { fontSize: theme.fontSize.small, fontWeight: theme.fontWeight.semibold, color: theme.colors.text },
  completedText: {
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.accent,
  },
  progressTrack: {
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.colors.surfaceAlt,
    marginTop: theme.spacing.md,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 4, backgroundColor: theme.colors.accent },
  progressFoot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  footGray: { fontSize: 12, color: theme.colors.textTertiary },
  fameHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: theme.spacing.xxl,
  },
  h2: { fontSize: 20, fontWeight: theme.fontWeight.extrabold, color: theme.colors.text },
  viewAll: { fontSize: theme.fontSize.caption, fontWeight: theme.fontWeight.semibold, color: theme.colors.accent },
  fameSub: { fontSize: 12, color: theme.colors.textSecondary, marginTop: theme.spacing.xs },
  podium: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md, marginTop: theme.spacing.xxl },
  sideCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
    alignItems: 'center',
    marginTop: 22,
    ...theme.shadow,
  },
  avatarWrap: { position: 'relative' },
  sidePhoto: { width: 52, height: 52, borderRadius: 26, backgroundColor: theme.colors.surfaceAlt },
  rankBadge: {
    position: 'absolute',
    bottom: -2,
    right: -4,
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeText: { fontSize: 10, fontWeight: theme.fontWeight.bold, color: theme.colors.text },
  sideName: {
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  sideRole: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 },
  cardDivider: {
    height: 1,
    alignSelf: 'stretch',
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  sideEarnings: { fontSize: 16, fontWeight: theme.fontWeight.extrabold, color: theme.colors.text },
  sideRetention: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 3 },
  leaderCard: {
    flex: 1.12,
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.accent,
    borderRadius: theme.radii.lg,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
    alignItems: 'center',
    ...theme.shadow,
  },
  leaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 4,
    marginTop: -26,
    marginBottom: theme.spacing.md,
  },
  leaderBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: theme.fontWeight.bold },
  leaderPhoto: { width: 62, height: 62, borderRadius: 31, backgroundColor: theme.colors.surfaceAlt },
  leaderName: {
    fontSize: theme.fontSize.body,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  leaderRole: { fontSize: 11, fontWeight: theme.fontWeight.semibold, color: theme.colors.rust, marginTop: 2 },
  leaderEarnings: { fontSize: 19, fontWeight: theme.fontWeight.extrabold, color: theme.colors.text },
  leaderRetention: {
    fontSize: 11,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.accent,
    marginTop: 3,
  },
  standingsHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  cardTitle: { fontSize: 17, fontWeight: theme.fontWeight.bold, color: theme.colors.text },
  tierPill: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 5,
  },
  tierText: { fontSize: 11, fontWeight: theme.fontWeight.semibold, color: theme.colors.textSecondary },
  contenderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  rowDivider: { borderTopWidth: 1, borderTopColor: theme.colors.border },
  rank: { fontSize: 17, fontWeight: theme.fontWeight.extrabold, color: theme.colors.text, width: 20 },
  contenderPhoto: { width: 42, height: 42, borderRadius: 21, backgroundColor: theme.colors.surfaceAlt },
  contenderMain: { flex: 1 },
  contenderName: { fontSize: theme.fontSize.body, fontWeight: theme.fontWeight.bold, color: theme.colors.text },
  contenderSessions: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 },
  xpCol: { alignItems: 'flex-end' },
  xp: { fontSize: theme.fontSize.body, fontWeight: theme.fontWeight.extrabold, color: theme.colors.text },
  xpBlue: { color: theme.colors.accent },
  xpNote: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 },
  xpNoteRust: { color: theme.colors.rust, fontWeight: theme.fontWeight.semibold },
  growthHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  growthTitle: {
    fontSize: 19,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    letterSpacing: -0.3,
    marginTop: theme.spacing.md,
  },
  growthBody: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginTop: theme.spacing.sm,
  },
  growthImpact: { color: theme.colors.text, fontWeight: theme.fontWeight.bold },
  launchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.pill,
    minHeight: 50,
    marginTop: theme.spacing.lg,
  },
  launchBtnDone: { backgroundColor: theme.colors.success },
  launchLabel: { color: '#FFFFFF', fontSize: theme.fontSize.body, fontWeight: theme.fontWeight.semibold },
  pressed: { opacity: 0.85 },
});
