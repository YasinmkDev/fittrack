import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Search, SearchX, Share2 } from 'lucide-react-native';
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
  const [query, setQuery] = useState('');

  const members = useMemo(() => {
    const byStatus = filter === 'all' ? MEMBERS : MEMBERS.filter((m) => m.status === filter);
    const q = query.trim().toLowerCase();
    return q ? byStatus.filter((m) => m.name.toLowerCase().includes(q)) : byStatus;
  }, [filter, query]);

  const shareInvite = async () => {
    try {
      await Share.share({
        message:
          'Train at PowerHouse Gym, Mingora — join with my invite and get Rs 500 off your first plan. I get Rs 500 too. Ask for Yasin at the desk. (via FitTrack)',
      });
    } catch {
      // share sheet dismissed — nothing to do
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Your people</Text>
        <Text style={styles.title}>Members</Text>
        <Text style={styles.subtitle}>
          {GYM.totalMembers} total · showing {members.length} here
        </Text>
        <View style={styles.searchBox}>
          <Search size={17} color={theme.colors.textTertiary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by name…"
            placeholderTextColor={theme.colors.textTertiary}
            style={styles.searchInput}
            accessibilityLabel="Search members by name"
            returnKeyType="search"
          />
        </View>
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
        ListHeaderComponent={
          <View style={styles.inviteCard}>
            <Text style={styles.inviteKicker}>GROW THE GYM</Text>
            <Text style={styles.inviteTitle}>Give Rs 500, get Rs 500</Text>
            <Text style={styles.inviteText}>
              Members who invite a friend train longer. Send your invite — the Rs 500 lands on
              both plans when they join.
            </Text>
            <Pressable
              onPress={shareInvite}
              accessibilityRole="button"
              accessibilityLabel="Share gym invite"
              style={styles.inviteBtn}>
              <Share2 size={15} color={theme.colors.ink} />
              <Text style={styles.inviteBtnLabel}>Share invite</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(Math.min(index, 8) * 40)
              .springify()
              .damping(17)
              .stiffness(210)
              .mass(0.72)}
            layout={LinearTransition.springify().damping(19).stiffness(220)}
            exiting={FadeOut.duration(140)}
          >
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
  kicker: {
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 1.4,
    color: theme.colors.accent,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: theme.fontSize.display,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    minHeight: 48,
    marginTop: theme.spacing.lg,
  },
  searchInput: { flex: 1, fontSize: theme.fontSize.body, color: theme.colors.text },
  inviteCard: {
    backgroundColor: theme.colors.ink,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  inviteKicker: {
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 1.6,
    color: theme.colors.accent,
  },
  inviteTitle: {
    fontSize: theme.fontSize.title,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.inkText,
    marginTop: theme.spacing.sm,
  },
  inviteText: {
    fontSize: theme.fontSize.small,
    color: theme.colors.inkTextMuted,
    lineHeight: 20,
    marginTop: theme.spacing.xs,
  },
  inviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 42,
    marginTop: theme.spacing.lg,
  },
  inviteBtnLabel: {
    fontSize: theme.fontSize.caption,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.ink,
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
