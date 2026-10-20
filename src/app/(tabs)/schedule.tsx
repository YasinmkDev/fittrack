import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Dumbbell } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIn } from '../../components/AnimatedIn';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { ClassCard } from '../../components/ClassCard';
import { SectionTitle } from '../../components/Section';
import { CLASSES_TODAY, PT_SESSIONS } from '../../data/seed';
import { theme } from '../../theme/theme';

export default function ScheduleScreen() {
  const bookedTotal = CLASSES_TODAY.reduce((s, c) => s + c.booked, 0);
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Today's schedule</Text>
          <Text style={styles.subtitle}>
            {CLASSES_TODAY.length} classes · {bookedTotal} bookings · {PT_SESSIONS.length} PT sessions
          </Text>
        </View>

        {CLASSES_TODAY.map((gymClass, i) => (
          <AnimatedIn key={gymClass.id} index={i}>
            <ClassCard gymClass={gymClass} />
          </AnimatedIn>
        ))}

        <SectionTitle title="Personal training" />
        {PT_SESSIONS.map((session, i) => (
          <AnimatedIn key={session.id} index={i + 2}>
            <Card style={styles.ptCard}>
              <View style={styles.ptIcon}>
                <Dumbbell size={18} color={theme.colors.accentDark} />
              </View>
              <View style={styles.ptMain}>
                <Text style={styles.ptName}>
                  {session.member} <Text style={styles.ptTrainer}>with {session.trainer}</Text>
                </Text>
                <Text style={styles.ptFocus}>{session.focus}</Text>
              </View>
              <Chip label={session.when} tone="accent" />
            </Card>
          </AnimatedIn>
        ))}
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
  ptCard: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, marginBottom: theme.spacing.md },
  ptIcon: {
    width: 38,
    height: 38,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.accentTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ptMain: { flex: 1 },
  ptName: { fontSize: theme.fontSize.small, fontWeight: theme.fontWeight.semibold, color: theme.colors.text },
  ptTrainer: { color: theme.colors.textSecondary, fontWeight: theme.fontWeight.regular },
  ptFocus: { fontSize: theme.fontSize.caption, color: theme.colors.textSecondary, marginTop: 2 },
});
