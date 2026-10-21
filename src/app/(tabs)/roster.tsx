import { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { BadgeCheck, Clock, Link2, Plus, Search } from 'lucide-react-native';
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '../../components/AppHeader';
import { Ring } from '../../components/Ring';
import { ATHLETES, SPOTLIGHT, type Athlete } from '../../data/apex';
import { theme } from '../../theme/theme';

const CHIPS = [
  { id: 'all', label: 'All 248' },
  { id: 'vip', label: 'VIP Cohort' },
  { id: 'streaks', label: 'Streaks 30+' },
  { id: 'recovery', label: 'Recovery' },
];

/** Athlete Roster — recreated exactly from the owner's reference design. */
export default function RosterScreen() {
  const [chip, setChip] = useState('all');
  const [query, setQuery] = useState('');
  const [acted, setActed] = useState<string[]>([]);
  const [sortAsc, setSortAsc] = useState(false);
  const [bioOpen, setBioOpen] = useState(false);

  const athletes = useMemo(() => {
    const byChip = chip === 'all' ? ATHLETES : ATHLETES.filter((a) => a.cohort.includes(chip));
    const q = query.trim().toLowerCase();
    const filtered = q ? byChip.filter((a) => a.name.toLowerCase().includes(q)) : byChip;
    const loadOf = (a: Athlete) => parseFloat(a.stats[0].value.replace(/[^0-9.]/g, '')) || 0;
    return [...filtered].sort((a, b) => (sortAsc ? loadOf(a) - loadOf(b) : loadOf(b) - loadOf(a)));
  }, [chip, query, sortAsc]);

  const act = (id: string) =>
    setActed((prev) => (prev.includes(id) ? prev : [...prev, id]));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader />
      <View style={styles.header}>
        <Text style={styles.kicker}>LIVE ANALYTICS</Text>
        <Text style={styles.h1}>Athlete Roster</Text>
        <Text style={styles.subtitle}>High-performance tracking & biomarker surveillance.</Text>
      </View>

      <FlatList
        data={athletes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.spotCard}>
              <View style={styles.spotHead}>
                <View style={styles.spotTitleRow}>
                  <View style={styles.blueDot} />
                  <Text style={styles.spotKicker}>MOMENTUM SPOTLIGHT</Text>
                </View>
                <Text style={styles.spotTier}>{SPOTLIGHT.tier}</Text>
              </View>
              <View style={styles.spotMain}>
                <View style={styles.spotLeft}>
                  <Text style={styles.spotName}>{SPOTLIGHT.name}</Text>
                  <Text style={styles.spotProgram}>{SPOTLIGHT.program}</Text>
                  <View style={styles.spotStats}>
                    <View>
                      <Text style={styles.spotStatLabel}>STREAK</Text>
                      <Text style={styles.spotStatValue}>{SPOTLIGHT.streak}</Text>
                    </View>
                    <View style={styles.spotDivider} />
                    <View>
                      <Text style={styles.spotStatLabel}>VO2 DELTA</Text>
                      <Text style={[styles.spotStatValue, styles.spotStatBlue]}>
                        {SPOTLIGHT.vo2Delta}
                      </Text>
                    </View>
                  </View>
                </View>
                <Ring value={SPOTLIGHT.readiness / 100} size={86} strokeWidth={7}>
                  <View style={styles.ringCenter}>
                    <Text style={styles.ringPct}>{SPOTLIGHT.readiness}%</Text>
                    <Text style={styles.ringLabel}>READINESS</Text>
                  </View>
                </Ring>
              </View>
              <View style={styles.spotDividerH} />
              <View style={styles.spotFoot}>
                <Text style={styles.spotFootText}>
                  Heart Rate Variability: {SPOTLIGHT.hrv}
                </Text>
                <Pressable
                  onPress={() => setBioOpen((v) => !v)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: bioOpen }}
                  accessibilityLabel={bioOpen ? 'Hide biomarkers' : 'Show biomarkers'}
                  hitSlop={8}>
                  <Text style={styles.biomarkers}>{bioOpen ? 'Hide ›' : 'Biomarkers ›'}</Text>
                </Pressable>
              </View>
              {bioOpen && (
                <View style={styles.bioPanel}>
                  <View style={styles.bioCol}>
                    <Text style={styles.bioLabel} numberOfLines={1}>
                      Resting HR
                    </Text>
                    <Text style={styles.bioValue} numberOfLines={1} adjustsFontSizeToFit>
                      52 bpm
                    </Text>
                  </View>
                  <View style={[styles.bioCol, styles.bioColDivider]}>
                    <Text style={styles.bioLabel} numberOfLines={1}>
                      Sleep Score
                    </Text>
                    <Text style={styles.bioValue} numberOfLines={1} adjustsFontSizeToFit>
                      91 / 100
                    </Text>
                  </View>
                  <View style={[styles.bioCol, styles.bioColDivider]}>
                    <Text style={styles.bioLabel} numberOfLines={1}>
                      Body Mass
                    </Text>
                    <Text style={styles.bioValue} numberOfLines={1} adjustsFontSizeToFit>
                      61.2 kg
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.searchBox}>
              <Search size={18} color={theme.colors.textTertiary} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search by name, biometric tier, or protocol…"
                placeholderTextColor={theme.colors.textTertiary}
                style={styles.searchInput}
                accessibilityLabel="Search athletes"
                returnKeyType="search"
              />
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipScroll}
              contentContainerStyle={styles.chipRow}>
              {CHIPS.map((c) => {
                const active = chip === c.id;
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => setChip(c.id)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    style={[styles.chip, active && styles.chipActive]}>
                    <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                      {c.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.cohortRow}>
              <Text style={styles.cohortLabel}>ACTIVE COHORT ({ATHLETES.length})</Text>
              <Pressable
                onPress={() => setSortAsc((v) => !v)}
                accessibilityRole="button"
                accessibilityLabel={sortAsc ? 'Sorted by load, lowest first' : 'Sorted by load, highest first'}
                hitSlop={8}>
                <Text style={styles.sortBy}>Sort by Load {sortAsc ? '↑' : '↓'}</Text>
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(Math.min(index, 6) * 50)
              .springify()
              .damping(17)
              .stiffness(210)
              .mass(0.72)}
            layout={LinearTransition.springify().damping(19).stiffness(220)}
            exiting={FadeOut.duration(140)}>
            <AthleteCard athlete={item} acted={acted.includes(item.id)} onAct={() => act(item.id)} />
          </Animated.View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No athletes match</Text>
            <Text style={styles.emptyText}>Try a different name or cohort.</Text>
          </View>
        }
        ListFooterComponent={
          <Pressable
            onPress={() => router.push('/(tabs)/join')}
            accessibilityRole="button"
            accessibilityLabel="New athlete intake"
            style={({ pressed }) => [styles.intakeBtn, pressed && styles.pressed]}>
            <Plus size={17} color="#FFFFFF" strokeWidth={2.6} />
            <Text style={styles.intakeLabel}>+ New Athlete Intake</Text>
          </Pressable>
        }
      />
    </SafeAreaView>
  );
}

function AthleteCard({
  athlete,
  acted,
  onAct,
}: {
  athlete: Athlete;
  acted: boolean;
  onAct: () => void;
}) {
  return (
    <View style={styles.athleteCard}>
      <View style={styles.athleteHead}>
        <Image source={{ uri: athlete.photo }} style={styles.photo} />
        <View style={styles.athleteMain}>
          <Text style={styles.athleteName} numberOfLines={1}>
            {athlete.name}
          </Text>
          <Text style={styles.athleteProgram}>{athlete.program}</Text>
        </View>
        <View
          style={[
            styles.statusPill,
            athlete.statusTone === 'rust' && styles.statusPillRust,
            athlete.statusTone === 'done' && styles.statusPillDone,
          ]}>
          <Text
            numberOfLines={1}
            style={[
              styles.statusText,
              athlete.statusTone === 'rust' && styles.statusTextRust,
            ]}>
            {athlete.status}
          </Text>
        </View>
      </View>
      <View style={styles.statPanel}>
        {athlete.stats.map((stat, i) => (
          <View key={stat.label} style={[styles.statCol, i > 0 && styles.statColDivider]}>
            <Text style={styles.statColLabel} numberOfLines={1} adjustsFontSizeToFit>
              {stat.label}
            </Text>
            <Text style={styles.statColValue} numberOfLines={1} adjustsFontSizeToFit>
              {stat.value}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.athleteFoot}>
        <View style={styles.footLeft}>
          {athlete.footerIcon === 'clock' && (
            <Clock size={15} color={theme.colors.textTertiary} />
          )}
          {athlete.footerIcon === 'sync' && <Link2 size={15} color={theme.colors.textTertiary} />}
          {athlete.footerIcon === 'verified' && (
            <BadgeCheck size={15} color={theme.colors.textTertiary} />
          )}
          <Text style={styles.footText}>{athlete.footerText}</Text>
        </View>
        <Pressable
          onPress={onAct}
          disabled={acted}
          accessibilityRole="button"
          accessibilityLabel={`${athlete.action} for ${athlete.name}`}
          style={[
            styles.actionBtn,
            athlete.actionStyle === 'muted' && styles.actionBtnMuted,
            acted && styles.actionBtnDone,
          ]}>
          <Text
            style={[
              styles.actionLabel,
              athlete.actionStyle === 'muted' && styles.actionLabelMuted,
            ]}>
            {acted ? `${athlete.action} sent` : athlete.action}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.canvas },
  header: { paddingHorizontal: theme.spacing.xl, paddingTop: theme.spacing.lg },
  kicker: {
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 1.6,
    color: theme.colors.rust,
  },
  h1: {
    fontSize: theme.fontSize.display,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    letterSpacing: -0.5,
    marginTop: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  list: { padding: theme.spacing.xl, paddingTop: theme.spacing.lg },
  spotCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.xl,
    ...theme.shadow,
  },
  spotHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  spotTitleRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  blueDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.accent },
  spotKicker: {
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 1.2,
    color: theme.colors.accent,
  },
  spotTier: { fontSize: 12, color: theme.colors.textSecondary },
  spotMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  spotLeft: { flex: 1 },
  spotName: {
    fontSize: 24,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    letterSpacing: -0.4,
  },
  spotProgram: { fontSize: theme.fontSize.small, color: theme.colors.textSecondary, marginTop: 2 },
  spotStats: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.lg, marginTop: theme.spacing.lg },
  spotStatLabel: { fontSize: 10, fontWeight: theme.fontWeight.bold, letterSpacing: 1, color: theme.colors.textTertiary },
  spotStatValue: {
    fontSize: 19,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    marginTop: 2,
  },
  spotStatBlue: { color: theme.colors.accent },
  spotDivider: { width: 1, height: 34, backgroundColor: theme.colors.border },
  ringCenter: { alignItems: 'center' },
  ringPct: { fontSize: 17, fontWeight: theme.fontWeight.extrabold, color: theme.colors.text },
  ringLabel: { fontSize: 8, fontWeight: theme.fontWeight.bold, letterSpacing: 0.8, color: theme.colors.textTertiary },
  spotDividerH: { height: 1, backgroundColor: theme.colors.border, marginTop: theme.spacing.lg },
  spotFoot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  spotFootText: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.textSecondary,
    flex: 1,
    minWidth: 0,
  },
  bioPanel: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  bioCol: { flex: 1, minWidth: 0, alignItems: 'center', paddingHorizontal: theme.spacing.xs },
  bioColDivider: { borderLeftWidth: 1, borderLeftColor: theme.colors.border },
  bioLabel: { fontSize: 11, color: theme.colors.textSecondary },
  bioValue: {
    fontSize: theme.fontSize.body,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: 3,
  },
  biomarkers: { fontSize: theme.fontSize.caption, fontWeight: theme.fontWeight.semibold, color: theme.colors.accent },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 50,
    marginTop: theme.spacing.xl,
  },
  searchInput: { flex: 1, fontSize: theme.fontSize.small, color: theme.colors.text },
  chipScroll: { flexGrow: 0, marginTop: theme.spacing.lg },
  chipRow: { gap: theme.spacing.sm, paddingRight: theme.spacing.xl },
  chip: {
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: theme.colors.ink, borderColor: theme.colors.ink },
  chipLabel: { fontSize: theme.fontSize.caption, fontWeight: theme.fontWeight.semibold, color: theme.colors.text },
  chipLabelActive: { color: '#FFFFFF' },
  cohortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.md,
  },
  cohortLabel: {
    fontSize: 12,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 1.2,
    color: theme.colors.textTertiary,
  },
  sortBy: { fontSize: theme.fontSize.caption, fontWeight: theme.fontWeight.semibold, color: theme.colors.accent },
  athleteCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    ...theme.shadow,
  },
  athleteHead: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md },
  photo: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.surfaceAlt },
  athleteMain: { flex: 1, minWidth: 0 },
  athleteName: { fontSize: 17, fontWeight: theme.fontWeight.bold, color: theme.colors.text },
  athleteProgram: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2, lineHeight: 16 },
  statusPill: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 5,
  },
  statusPillRust: { backgroundColor: theme.colors.rustTint },
  statusPillDone: { backgroundColor: theme.colors.surfaceAlt },
  statusText: { fontSize: 11, fontWeight: theme.fontWeight.semibold, color: theme.colors.text },
  statusTextRust: { color: theme.colors.rust },
  statPanel: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  statCol: { flex: 1, minWidth: 0, alignItems: 'center', paddingHorizontal: theme.spacing.xs },
  statColDivider: { borderLeftWidth: 1, borderLeftColor: theme.colors.border },
  statColLabel: { fontSize: 11, color: theme.colors.textSecondary },
  statColValue: {
    fontSize: theme.fontSize.body,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: 3,
  },
  athleteFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  footLeft: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, flex: 1 },
  footText: { fontSize: 12, color: theme.colors.textSecondary, flexShrink: 1 },
  actionBtn: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.xl,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnMuted: { backgroundColor: theme.colors.surfaceAlt },
  actionBtnDone: { backgroundColor: theme.colors.success },
  actionLabel: { color: '#FFFFFF', fontSize: theme.fontSize.caption, fontWeight: theme.fontWeight.bold },
  actionLabelMuted: { color: theme.colors.text },
  empty: { alignItems: 'center', paddingVertical: theme.spacing.xxxl, gap: theme.spacing.sm },
  emptyTitle: { fontSize: theme.fontSize.section, fontWeight: theme.fontWeight.bold, color: theme.colors.text },
  emptyText: { fontSize: theme.fontSize.small, color: theme.colors.textSecondary },
  intakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.pill,
    minHeight: 54,
    marginHorizontal: theme.spacing.xxxl,
    marginTop: theme.spacing.sm,
  },
  intakeLabel: { color: '#FFFFFF', fontSize: theme.fontSize.body, fontWeight: theme.fontWeight.semibold },
  pressed: { opacity: 0.85 },
});
