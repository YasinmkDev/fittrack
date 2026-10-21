import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Activity, Plus, SlidersHorizontal } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIn } from '../../components/AnimatedIn';
import { AppHeader } from '../../components/AppHeader';
import { SESSIONS, WEEK, type Session } from '../../data/apex';
import { theme } from '../../theme/theme';

/** Floor Schedule — recreated exactly from the owner's reference design. */
export default function ScheduleScreen() {
  const [selectedDay, setSelectedDay] = useState('24');
  const [checkedIn, setCheckedIn] = useState<string[]>([]);
  const [filterOn, setFilterOn] = useState(false);

  const checkIn = (id: string) =>
    setCheckedIn((prev) => (prev.includes(id) ? prev : [...prev, id]));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AnimatedIn index={0}>
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.kicker}>HIGH PERFORMANCE GRID</Text>
              <Text style={styles.h1}>Floor Schedule</Text>
            </View>
            <Text style={styles.month}>Oct 2024</Text>
          </View>
        </AnimatedIn>

        <AnimatedIn index={1}>
          <View style={styles.weekStrip}>
            {WEEK.map((d) => {
              const selected = selectedDay === d.date;
              return (
                <Pressable
                  key={d.date}
                  onPress={() => setSelectedDay(d.date)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`${d.day} ${d.date}`}
                  style={styles.dayCell}>
                  <Text style={[styles.dayName, selected && styles.dayNameSelected]}>
                    {d.day}
                  </Text>
                  <View style={[styles.dayBubble, selected && styles.dayBubbleSelected]}>
                    <Text style={[styles.dayNum, selected && styles.dayNumSelected]}>
                      {d.date}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </AnimatedIn>

        <AnimatedIn index={2}>
          <View style={styles.rhythmPanel}>
            <View style={styles.rhythmHead}>
              <View style={styles.rhythmTitleRow}>
                <View style={styles.blueDot} />
                <Text style={styles.rhythmTitle}>Studio Rhythm Today</Text>
              </View>
              <View style={styles.telemetryPill}>
                <Text style={styles.telemetryText}>Live Telemetry</Text>
              </View>
            </View>
            <View style={styles.rhythmCards}>
              <View style={styles.rhythmCard}>
                <Text style={styles.rhythmLabel}>Active Sessions</Text>
                <View style={styles.rhythmValueRow}>
                  <Text style={styles.rhythmValue}>8</Text>
                  <Text style={styles.rhythmUnit}>Slots</Text>
                </View>
              </View>
              <View style={styles.rhythmCard}>
                <Text style={styles.rhythmLabel}>Registered Athletes</Text>
                <View style={styles.rhythmValueRow}>
                  <Text style={styles.rhythmValue}>184</Text>
                  <Text style={styles.rhythmUnit}>Cap 210</Text>
                </View>
              </View>
            </View>
            <View style={styles.loadRow}>
              <Text style={styles.loadLabel}>Aggregate Floor Load</Text>
              <Text style={styles.loadValue}>87.6% Peak</Text>
            </View>
            <View style={styles.loadTrack}>
              <View style={[styles.loadFill, { width: '87.6%' }]} />
            </View>
          </View>
        </AnimatedIn>

        <AnimatedIn index={3}>
          <View style={styles.sessionsHead}>
            <Text style={styles.h2}>Sessions</Text>
            <Pressable
              onPress={() => setFilterOn((v) => !v)}
              accessibilityRole="button"
              accessibilityState={{ selected: filterOn }}
              accessibilityLabel="Filter floor"
              style={styles.filterBtn}>
              <Text style={styles.filterText}>Filter Floor</Text>
              <SlidersHorizontal
                size={15}
                color={filterOn ? theme.colors.accentDark : theme.colors.accent}
              />
            </Pressable>
          </View>
        </AnimatedIn>

        {SESSIONS.map((session, i) => (
          <AnimatedIn key={session.id} index={4 + i}>
            <SessionCard
              session={session}
              checkedIn={checkedIn.includes(session.id)}
              onCheckIn={() => checkIn(session.id)}
            />
          </AnimatedIn>
        ))}

        <AnimatedIn index={4 + SESSIONS.length}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add class slot"
            style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}>
            <Plus size={17} color="#FFFFFF" strokeWidth={2.6} />
            <Text style={styles.addLabel}>Add Class Slot</Text>
          </Pressable>
        </AnimatedIn>
      </ScrollView>
    </SafeAreaView>
  );
}

function SessionCard({
  session,
  checkedIn,
  onCheckIn,
}: {
  session: Session;
  checkedIn: boolean;
  onCheckIn: () => void;
}) {
  const telemetry = session.variant === 'telemetry';
  return (
    <View style={[styles.sessionCard, telemetry && styles.sessionCardAlt]}>
      <View style={styles.sessionTop}>
        <Text style={styles.sessionTime}>
          {session.time} <Text style={styles.sessionDur}>• {session.duration}</Text>
        </Text>
        {session.badge ? (
          <View
            style={[
              styles.badge,
              session.badgeTone === 'rust' && styles.badgeRust,
              session.badgeTone === 'blue' && styles.badgeBlue,
            ]}>
            <Text
              style={[
                styles.badgeText,
                session.badgeTone === 'rust' && styles.badgeTextRust,
                session.badgeTone === 'blue' && styles.badgeTextBlue,
              ]}>
              {session.badge}
            </Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.sessionName}>{session.name}</Text>
      <Text style={styles.sessionLoc}>{session.location}</Text>

      {telemetry ? (
        <View style={styles.telemetryBody}>
          <View style={styles.vo2Row}>
            <View style={styles.vo2Left}>
              <Activity size={16} color={theme.colors.accent} />
              <Text style={styles.vo2Label}>Target VO2 Band</Text>
            </View>
            <Text style={styles.vo2Value}>Zone 4 (88% Max)</Text>
          </View>
          <View style={styles.telemetryFoot}>
            <View style={styles.avatarStack}>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/women/12.jpg' }}
                style={[styles.stackAvatar, styles.stackFirst]}
              />
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/54.jpg' }}
                style={styles.stackAvatar}
              />
            </View>
            <Text style={styles.viewAnalytics}>View Analytics ›</Text>
          </View>
        </View>
      ) : (
        <View style={styles.coachRow}>
          <Image source={{ uri: session.coachPhoto }} style={styles.coachPhoto} />
          <View style={styles.coachMain}>
            <Text style={styles.coachName}>{session.coach}</Text>
            <Text style={styles.coachRole}>{session.coachRole}</Text>
          </View>
          {session.rightTop ? (
            <View style={styles.rightStats}>
              <Text style={styles.rightTop}>{session.rightTop}</Text>
              <Text style={styles.rightBottom}>{session.rightBottom}</Text>
            </View>
          ) : session.action === 'checkin' ? (
            <Pressable
              onPress={onCheckIn}
              disabled={checkedIn}
              accessibilityRole="button"
              accessibilityLabel={checkedIn ? 'Checked in' : `Check in to ${session.name}`}
              style={[styles.checkinBtn, checkedIn && styles.checkinBtnDone]}>
              <Text style={[styles.checkinLabel, checkedIn && styles.checkinLabelDone]}>
                {checkedIn ? 'Checked-in ✓' : 'Check-in'}
              </Text>
            </Pressable>
          ) : (
            <View style={styles.detailsBtn}>
              <Text style={styles.detailsLabel}>Details</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.canvas },
  content: { padding: theme.spacing.xl, paddingBottom: theme.spacing.xxxl },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: theme.spacing.md,
  },
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
  month: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  weekStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radii.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    marginTop: theme.spacing.xl,
  },
  dayCell: { flex: 1, alignItems: 'center', gap: theme.spacing.xs },
  dayName: { fontSize: 11, color: theme.colors.textTertiary, fontWeight: theme.fontWeight.medium },
  dayNameSelected: { color: theme.colors.textSecondary },
  dayBubble: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBubbleSelected: { backgroundColor: theme.colors.ink },
  dayNum: { fontSize: 16, fontWeight: theme.fontWeight.bold, color: theme.colors.text },
  dayNumSelected: { color: '#FFFFFF' },
  rhythmPanel: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.xl,
    marginTop: theme.spacing.xl,
  },
  rhythmHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  rhythmTitleRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  blueDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.accent },
  rhythmTitle: {
    fontSize: theme.fontSize.body,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  telemetryPill: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 5,
  },
  telemetryText: {
    fontSize: 11,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.accent,
  },
  rhythmCards: { flexDirection: 'row', gap: theme.spacing.md, marginTop: theme.spacing.lg },
  rhythmCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    padding: theme.spacing.lg,
  },
  rhythmLabel: { fontSize: 11, color: theme.colors.textSecondary },
  rhythmValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  rhythmValue: {
    fontSize: 28,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  rhythmUnit: { fontSize: 12, color: theme.colors.textSecondary },
  loadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: theme.spacing.xl,
  },
  loadLabel: { fontSize: 12, color: theme.colors.textSecondary },
  loadValue: { fontSize: theme.fontSize.small, fontWeight: theme.fontWeight.bold, color: theme.colors.text },
  loadTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
    marginTop: theme.spacing.sm,
    overflow: 'hidden',
  },
  loadFill: { height: '100%', borderRadius: 4, backgroundColor: theme.colors.ink },
  sessionsHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xxl,
  },
  h2: { fontSize: 20, fontWeight: theme.fontWeight.extrabold, color: theme.colors.text },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  filterText: {
    fontSize: theme.fontSize.caption,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.accent,
  },
  sessionCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.xl,
    marginTop: theme.spacing.lg,
    ...theme.shadow,
  },
  sessionCardAlt: { backgroundColor: theme.colors.surfaceAlt, borderColor: 'transparent' },
  sessionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  sessionTime: {
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  sessionDur: { color: theme.colors.textSecondary, fontWeight: theme.fontWeight.regular },
  badge: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 5,
  },
  badgeRust: { backgroundColor: theme.colors.rustTint },
  badgeBlue: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  badgeText: { fontSize: 11, fontWeight: theme.fontWeight.semibold, color: theme.colors.textSecondary },
  badgeTextRust: { color: theme.colors.rust, fontWeight: theme.fontWeight.bold, letterSpacing: 0.6 },
  badgeTextBlue: { color: theme.colors.accent },
  sessionName: {
    fontSize: 19,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    letterSpacing: -0.3,
    marginTop: theme.spacing.md,
  },
  sessionLoc: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 3 },
  coachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  coachPhoto: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.surfaceAlt },
  coachMain: { flex: 1 },
  coachName: { fontSize: theme.fontSize.small, fontWeight: theme.fontWeight.semibold, color: theme.colors.text },
  coachRole: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 1 },
  rightStats: { alignItems: 'flex-end' },
  rightTop: { fontSize: theme.fontSize.small, fontWeight: theme.fontWeight.bold, color: theme.colors.text },
  rightBottom: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 1 },
  checkinBtn: {
    borderWidth: 1.5,
    borderColor: theme.colors.accent,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.xl,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkinBtnDone: { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent },
  checkinLabel: { fontSize: theme.fontSize.caption, fontWeight: theme.fontWeight.bold, color: theme.colors.accent },
  checkinLabelDone: { color: '#FFFFFF' },
  detailsBtn: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.xl,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsLabel: { fontSize: theme.fontSize.caption, fontWeight: theme.fontWeight.semibold, color: theme.colors.text },
  telemetryBody: { marginTop: theme.spacing.lg },
  vo2Row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
  },
  vo2Left: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  vo2Label: { fontSize: theme.fontSize.caption, color: theme.colors.textSecondary },
  vo2Value: { fontSize: theme.fontSize.caption, fontWeight: theme.fontWeight.bold, color: theme.colors.text },
  telemetryFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
  },
  avatarStack: { flexDirection: 'row' },
  stackAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.surfaceAlt,
    backgroundColor: theme.colors.surfaceAlt,
  },
  stackFirst: { marginRight: -10 },
  viewAnalytics: {
    fontSize: theme.fontSize.caption,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.accent,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.pill,
    minHeight: 52,
    alignSelf: 'center',
    paddingHorizontal: theme.spacing.xxxl,
    marginTop: theme.spacing.xxl,
  },
  addLabel: { color: '#FFFFFF', fontSize: theme.fontSize.body, fontWeight: theme.fontWeight.semibold },
  pressed: { opacity: 0.85 },
});
