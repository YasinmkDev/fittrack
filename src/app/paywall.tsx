import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Check, PartyPopper } from 'lucide-react-native';

import { AnimatedIn } from '../components/AnimatedIn';
import { GhostButton, PrimaryButton } from '../components/Buttons';
import { Card } from '../components/Card';
import { rs } from '../lib/format';
import { theme } from '../theme/theme';

const FEATURES = [
  'Unlimited members and plans',
  'Automatic WhatsApp fee reminders and expiry alerts',
  'Attendance and revenue reports for any month',
  'Trainer accounts with their own class views',
  'Member progress tracking — weight, streaks, goals',
  'A second branch, when you grow into it',
];

const MONTHLY = 3999;
const YEARLY = 39990;

export default function PaywallScreen() {
  const [yearly, setYearly] = useState(false);
  const [trialStarted, setTrialStarted] = useState(false);
  const price = yearly ? YEARLY : MONTHLY;

  return (
    <ScrollView style={styles.safe} contentContainerStyle={styles.content}>
      <AnimatedIn index={0}>
        <Text style={styles.title}>Spend evenings coaching, not chasing fees</Text>
        <Text style={styles.subtitle}>
          FitTrack Pro automates the admin: reminders go out on WhatsApp, expiries flag themselves,
          and every rupee is accounted for.
        </Text>
      </AnimatedIn>

      <AnimatedIn index={1}>
        <View style={styles.billingToggle}>
          <Pressable
            onPress={() => setYearly(false)}
            accessibilityRole="button"
            accessibilityState={{ selected: !yearly }}
            style={[styles.toggleOption, !yearly && styles.toggleOptionActive]}
          >
            <Text style={[styles.toggleLabel, !yearly && styles.toggleLabelActive]}>Monthly</Text>
          </Pressable>
          <Pressable
            onPress={() => setYearly(true)}
            accessibilityRole="button"
            accessibilityState={{ selected: yearly }}
            style={[styles.toggleOption, yearly && styles.toggleOptionActive]}
          >
            <Text style={[styles.toggleLabel, yearly && styles.toggleLabelActive]}>
              Yearly · save 17%
            </Text>
          </Pressable>
        </View>
      </AnimatedIn>

      <AnimatedIn index={2}>
        <Card style={styles.priceCard}>
          <Text style={styles.planName}>Pro</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{rs(price)}</Text>
            <Text style={styles.per}>/ {yearly ? 'year' : 'month'}</Text>
          </View>
          <Text style={styles.trialNote}>14 days free. Less than one member’s monthly fee.</Text>
          <View style={styles.featureList}>
            {FEATURES.map((feature) => (
              <View key={feature} style={styles.featureRow}>
                <View style={styles.checkIcon}>
                  <Check size={13} color="#FFFFFF" strokeWidth={3} />
                </View>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </Card>
      </AnimatedIn>

      <AnimatedIn index={3}>
        {trialStarted ? (
          <View style={styles.successCard}>
            <PartyPopper size={22} color={theme.colors.success} />
            <View style={styles.successMain}>
              <Text style={styles.successTitle}>Your 14-day free trial has started</Text>
              <Text style={styles.successSub}>
                WhatsApp automation and unlimited members are on. We will remind you before the
                first charge.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.cta}>
            <PrimaryButton label="Start 14-day free trial" onPress={() => setTrialStarted(true)} />
            <View style={styles.restore}>
              <GhostButton label="Restore purchase" onPress={() => {}} />
            </View>
          </View>
        )}
        <Text style={styles.finePrint}>
          Cancel anytime in Settings. In the live product, billing runs on JazzCash, EasyPaisa or
          bank transfer — this demo does not charge you.
        </Text>
      </AnimatedIn>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.canvas },
  content: { padding: theme.spacing.xl, paddingBottom: theme.spacing.xxxl },
  title: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.fontSize.body,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginTop: theme.spacing.md,
  },
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radii.pill,
    padding: theme.spacing.xs,
    marginTop: theme.spacing.xxl,
  },
  toggleOption: {
    flex: 1,
    minHeight: 40,
    borderRadius: theme.radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleOptionActive: { backgroundColor: theme.colors.surface, ...theme.shadow },
  toggleLabel: {
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSecondary,
  },
  toggleLabelActive: { color: theme.colors.text },
  priceCard: { marginTop: theme.spacing.lg },
  planName: {
    fontSize: theme.fontSize.caption,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 1.5,
    color: theme.colors.accent,
    textTransform: 'uppercase',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  price: { fontSize: 34, fontWeight: theme.fontWeight.bold, color: theme.colors.text },
  per: { fontSize: theme.fontSize.body, color: theme.colors.textSecondary },
  trialNote: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  featureList: { marginTop: theme.spacing.xl, gap: theme.spacing.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: theme.fontSize.small,
    color: theme.colors.text,
    lineHeight: 19,
  },
  cta: { marginTop: theme.spacing.xxl },
  restore: { marginTop: theme.spacing.md },
  successCard: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.successTint,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.xxl,
    alignItems: 'flex-start',
  },
  successMain: { flex: 1 },
  successTitle: {
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.success,
  },
  successSub: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  finePrint: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
});
