import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SearchX } from 'lucide-react-native';
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MemberCard } from '../../components/MemberCard';
import { GYM, MEMBERS, type MemberStatus } from '../../data/seed';
import { theme } from '../../theme/theme';

type Filter = MemberStatus | 'all';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'expiring', label: 'Expiring' },
  { id: 'expired', label: 'Expired' },
  { id: 'frozen', label: 'Frozen' },
];

export default function MembersScreen() {
  const [filter, setFilter] = useState<Filter>('all');

  const members = useMemo(
    () => (filter === 'all' ? MEMBERS : MEMBERS.filter((m) => m.status === filter)),
    [filter],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Members</Text>
        <Text style={styles.subtitle}>
          {GYM.totalMembers} total · showing {members.length} here
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chipRow}
      >
        {FILTERS.map((f) => {
          const active = filter === f.id;
          const count =
            f.id === 'all' ? MEMBERS.length : MEMBERS.filter((m) => m.status === f.id).length;
          return (
            <Pressable
              key={f.id}
              onPress={() => setFilter(f.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${f.label}, ${count} members`}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                {f.label} · {count}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(Math.min(index, 8) * 40)
              .springify()
              .damping(17)
              .stiffness(210)
              .mass(0.72)}
            layout={LinearTransition.springify().damping(19).stiffness(220)}
            exiting={FadeOut.duration(140)}>
            <MemberCard member={item} onPress={() => router.push(`/member/${item.id}`)} />
          </Animated.View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <SearchX size={28} color={theme.colors.textTertiary} />
            <Text style={styles.emptyTitle}>No members here</Text>
            <Text style={styles.emptyText}>Members in this state will appear here.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.canvas },
  header: { paddingHorizontal: theme.spacing.xl, paddingTop: theme.spacing.sm },
  title: {
    fontSize: theme.fontSize.display,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  chipScroll: { flexGrow: 0, marginTop: theme.spacing.lg },
  chipRow: { paddingHorizontal: theme.spacing.xl, gap: theme.spacing.sm },
  chip: {
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: theme.colors.ink, borderColor: theme.colors.ink },
  chipLabel: {
    fontSize: theme.fontSize.caption,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSecondary,
  },
  chipLabelActive: { color: '#FFFFFF' },
  list: { padding: theme.spacing.xl, paddingTop: theme.spacing.lg },
  empty: { alignItems: 'center', paddingTop: theme.spacing.xxxl * 2, gap: theme.spacing.sm },
  emptyTitle: {
    fontSize: theme.fontSize.section,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  emptyText: { fontSize: theme.fontSize.small, color: theme.colors.textSecondary },
});
