import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Check } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIn } from '../../components/AnimatedIn';
import { GhostButton, PrimaryButton } from '../../components/Buttons';
import { Card } from '../../components/Card';
import { ProgressBar } from '../../components/ProgressBar';
import { Ring } from '../../components/Ring';
import { SectionTitle } from '../../components/Section';
import { GOALS, PLANS, TRAINERS } from '../../data/seed';
import { rs } from '../../lib/format';
import { theme } from '../../theme/theme';

const ADMISSION_FEE = 1000;

export default function JoinScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [goal, setGoal] = useState(GOALS[1]);
  const [trainer, setTrainer] = useState(TRAINERS[0]);
  const [planId, setPlanId] = useState('quarterly');
  const [nameError, setNameError] = useState(false);
  const [joinedName, setJoinedName] = useState<string | null>(null);

  const plan = useMemo(() => PLANS.find((p) => p.id === planId) ?? PLANS[0], [planId]);
  const totalDue = plan.price + ADMISSION_FEE;

  const handleJoin = () => {
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    setJoinedName(name.trim());
  };

  const reset = () => {
    setName('');
    setPhone('');
    setJoinedName(null);
  };

  if (joinedName) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.successWrap}>
          <AnimatedIn index={0}>
            <Ring value={1} size={92} strokeWidth={6}>
              <Check size={34} color={theme.colors.success} strokeWidth={3} />
            </Ring>
          </AnimatedIn>
          <Text style={styles.successTitle}>{joinedName} is in.</Text>
          <Text style={styles.successText}>
            {plan.name} plan with {trainer}. {rs(totalDue)} collected today ({rs(plan.price)} plan +{' '}
            {rs(ADMISSION_FEE)} admission). A welcome message with today’s class timings was sent on
            WhatsApp.
          </Text>
          <View style={styles.successActions}>
            <PrimaryButton label="Add another member" onPress={reset} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Add member</Text>
            <Text style={styles.subtitle}>
              Under a minute at the front desk. Fee is collected now.
            </Text>
            <View style={styles.stepsWrap}>
              <View style={styles.stepsRow}>
                <Text style={[styles.stepLabel, styles.stepLabelActive]}>1 · Details</Text>
                <Text style={[styles.stepLabel, styles.stepLabelDone]}>
                  2 · Plan — already picked
                </Text>
                <Text style={styles.stepLabel}>3 · Done</Text>
              </View>
              <ProgressBar value={name.trim() ? 0.66 : 0.33} height={5} />
              <Text style={styles.stepsCaption}>
                You start at step 2 of 3 — the plan and trainer most members choose are
                pre-selected. Change anything below.
              </Text>
            </View>
          </View>

          <AnimatedIn index={0}>
            <Card>
              <Text style={styles.label}>Full name</Text>
              <TextInput
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  if (t.trim()) setNameError(false);
                }}
                placeholder="e.g. Sheraz Khan"
                placeholderTextColor={theme.colors.textTertiary}
                style={[styles.input, nameError && styles.inputError]}
                accessibilityLabel="Member full name"
                returnKeyType="next"
              />
              {nameError && <Text style={styles.errorText}>Name is required to add a member.</Text>}
              <Text style={[styles.label, styles.labelSpaced]}>Phone (WhatsApp)</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="03xx xxxxxxx"
                placeholderTextColor={theme.colors.textTertiary}
                style={styles.input}
                keyboardType="phone-pad"
                accessibilityLabel="Member phone number"
              />
            </Card>
          </AnimatedIn>

          <AnimatedIn index={1}>
            <SectionTitle title="Goal" />
            <View style={styles.chipWrap}>
              {GOALS.map((g) => (
                <Pressable
                  key={g}
                  onPress={() => setGoal(g)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: goal === g }}
                  style={[styles.chip, goal === g && styles.chipActive]}
                >
                  <Text style={[styles.chipLabel, goal === g && styles.chipLabelActive]}>{g}</Text>
                </Pressable>
              ))}
            </View>
          </AnimatedIn>

          <AnimatedIn index={2}>
            <SectionTitle title="Plan" />
            {PLANS.map((p) => {
              const selected = planId === p.id;
              return (
                <Pressable
                  key={p.id}
                  onPress={() => setPlanId(p.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`${p.name} plan, ${rs(p.price)}`}
                  style={({ pressed }) => pressed && styles.pressed}
                >
                  <Card style={[styles.planCard, selected && styles.planCardSelected]}>
                    <View style={[styles.radio, selected && styles.radioSelected]}>
                      {selected && <View style={styles.radioDot} />}
                    </View>
                    <View style={styles.planMain}>
                      <Text style={styles.planName}>{p.name}</Text>
                      <Text style={styles.planDetail}>{p.detail}</Text>
                    </View>
                    <Text style={styles.planPrice}>{rs(p.price)}</Text>
                  </Card>
                </Pressable>
              );
            })}
          </AnimatedIn>

          <AnimatedIn index={3}>
            <SectionTitle title="Trainer" />
            <View style={styles.chipWrap}>
              {TRAINERS.map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setTrainer(t)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: trainer === t }}
                  style={[styles.chip, trainer === t && styles.chipActive]}
                >
                  <Text style={[styles.chipLabel, trainer === t && styles.chipLabelActive]}>
                    {t}
                  </Text>
                </Pressable>
              ))}
            </View>
          </AnimatedIn>

          <AnimatedIn index={4}>
            <SectionTitle title="Due today" />
            <Card>
              <View style={styles.line}>
                <Text style={styles.lineLabel}>{plan.name} plan</Text>
                <Text style={styles.lineAmount}>{rs(plan.price)}</Text>
              </View>
              <View style={[styles.line, styles.lineDivider]}>
                <Text style={styles.lineLabel}>Admission fee (one-time)</Text>
                <Text style={styles.lineAmount}>{rs(ADMISSION_FEE)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{rs(totalDue)}</Text>
              </View>
            </Card>
            <View style={styles.cta}>
              <PrimaryButton label={`Add member — collect ${rs(totalDue)}`} onPress={handleJoin} />
              <View style={styles.ghostWrap}>
                <GhostButton
                  label="Save as enquiry instead"
                  onPress={() => setJoinedName(name.trim() || 'New enquiry')}
                />
              </View>
            </View>
          </AnimatedIn>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.canvas },
  flex: { flex: 1 },
  content: { padding: theme.spacing.xl, paddingBottom: 120 },
  header: { marginBottom: theme.spacing.xl },
  stepsWrap: { marginTop: theme.spacing.xl },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textTertiary,
  },
  stepLabelActive: { color: theme.colors.text },
  stepLabelDone: { color: theme.colors.accent },
  stepsCaption: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 17,
    marginTop: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSize.display,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    lineHeight: 20,
  },
  label: {
    fontSize: theme.fontSize.caption,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  labelSpaced: { marginTop: theme.spacing.lg },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.lg,
    fontSize: theme.fontSize.body,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
  },
  inputError: { borderColor: theme.colors.danger },
  errorText: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.danger,
    marginTop: theme.spacing.sm,
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
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
  chipLabel: {
    fontSize: theme.fontSize.caption,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSecondary,
  },
  chipLabelActive: { color: '#FFFFFF' },
  pressed: { opacity: 0.8 },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.lg,
  },
  planCardSelected: { borderColor: theme.colors.accent, borderWidth: 1.5 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: theme.colors.accent },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.accent },
  planMain: { flex: 1 },
  planName: {
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  planDetail: { fontSize: theme.fontSize.caption, color: theme.colors.textSecondary, marginTop: 2 },
  planPrice: {
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
  },
  lineDivider: { borderTopWidth: 1, borderTopColor: theme.colors.border },
  lineLabel: { fontSize: theme.fontSize.small, color: theme.colors.text },
  lineAmount: {
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderStrong,
    paddingTop: theme.spacing.lg,
  },
  totalLabel: {
    fontSize: theme.fontSize.section,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  totalValue: {
    fontSize: theme.fontSize.title,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  cta: { marginTop: theme.spacing.xxl },
  ghostWrap: { marginTop: theme.spacing.md },
  successWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xxl,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
  },
  successText: {
    fontSize: theme.fontSize.body,
    color: theme.colors.textSecondary,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
  successActions: { marginTop: theme.spacing.xxl, alignSelf: 'stretch' },
});
