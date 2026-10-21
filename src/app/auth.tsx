import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  Apple,
  ArrowRight,
  Check,
  Expand,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from 'lucide-react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ring } from '../components/Ring';
import { theme } from '../theme/theme';

type Mode = 'login' | 'signup';
type Status = 'idle' | 'loading' | 'success';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRENGTH_LABELS = ['Too weak', 'Weak', 'Fair', 'Strong', 'Elite'];
const STRENGTH_COLORS = ['#D92D20', '#D92D20', '#E8930C', '#0B6BDE', '#1E8E4F'];

function runShake(x: SharedValue<number>) {
  x.value = withSequence(
    withTiming(-9, { duration: 45 }),
    withTiming(9, { duration: 45 }),
    withTiming(-6, { duration: 45 }),
    withTiming(0, { duration: 45 }),
  );
}

function setScale(x: SharedValue<number>, v: number) {
  x.value = withSpring(v, { damping: 18, stiffness: 320 });
}

function strengthOf(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(4, Math.max(1, score));
}

/**
 * APEX auth — interactive, animated, fluid. Sliding Login/Sign Up
 * segment, a form that morphs between modes on layout springs,
 * focus-lit fields, an animated password strength meter, an error
 * shake, and a ring-sweep success state before entering the app.
 * Demo build: any valid email + 6 character password is accepted;
 * accounts are not stored anywhere yet.
 */
export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [trackW, setTrackW] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const segX = useSharedValue(0);
  const shakeX = useSharedValue(0);
  const btnScale = useSharedValue(1);
  const blobA = useSharedValue(0);
  const blobB = useSharedValue(0);

  useEffect(() => {
    segX.value = withSpring(mode === 'signup' ? (trackW - 8) / 2 : 0, {
      damping: 26,
      stiffness: 280,
      mass: 0.9,
    });
  }, [mode, trackW, segX]);

  useEffect(() => {
    blobA.value = withRepeat(withTiming(1, { duration: 8000 }), -1, true);
    blobB.value = withRepeat(withTiming(1, { duration: 10000 }), -1, true);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [blobA, blobB]);

  const segStyle = useAnimatedStyle(() => ({ transform: [{ translateX: segX.value }] }));
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));
  const blobAStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: blobA.value * 26 },
      { translateY: blobA.value * 18 },
      { scale: 1 + blobA.value * 0.08 },
    ],
  }));
  const blobBStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: blobB.value * -22 },
      { translateY: blobB.value * -14 },
      { scale: 1 + blobB.value * 0.06 },
    ],
  }));

  const switchMode = (next: Mode) => {
    if (next === mode || status !== 'idle') return;
    Haptics.selectionAsync().catch(() => undefined);
    setMode(next);
    setError(null);
    setResetSent(false);
  };

  const shake = () => runShake(shakeX);

  const succeed = () => {
    setStatus('loading');
    timer.current = setTimeout(() => {
      setStatus('success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      timer.current = setTimeout(() => router.replace('/(tabs)'), 1000);
    }, 850);
  };

  const submit = () => {
    if (status !== 'idle') return;
    if (mode === 'signup' && name.trim().length < 2) {
      setError('Enter your full name to create the account.');
      shake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError('That email does not look right — check it and try again.');
      shake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
      return;
    }
    if (password.length < 6) {
      setError('Password needs at least 6 characters.');
      shake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
      return;
    }
    setError(null);
    succeed();
  };

  const social = () => {
    if (status !== 'idle') return;
    setError(null);
    succeed();
  };

  const strength = strengthOf(password);
  const busy = status !== 'idle';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Animated.View style={[styles.blob, styles.blobTop, blobAStyle]} pointerEvents="none" />
      <Animated.View style={[styles.blob, styles.blobBottom, blobBStyle]} pointerEvents="none" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.springify().damping(17).stiffness(210).mass(0.72)}>
            <View style={styles.brandRow}>
              <View style={styles.logoTile}>
                <Expand size={22} color="#FFFFFF" strokeWidth={2.4} />
              </View>
              <View>
                <Text style={styles.wordmark}>APEX Studio Lab</Text>
                <Text style={styles.brandKicker}>TRAINER COMMAND OS</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View
            key={mode}
            entering={FadeInDown.delay(70).springify().damping(17).stiffness(210).mass(0.72)}>
            <Text style={styles.h1}>{mode === 'login' ? 'Welcome back' : 'Create your account'}</Text>
            <Text style={styles.sub}>
              {mode === 'login'
                ? 'Sign in to run your floor, roster and schedule.'
                : 'Set up your studio command deck in under a minute.'}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(130).springify().damping(17).stiffness(210).mass(0.72)}>
            <View
              style={styles.segment}
              onLayout={(e) => setTrackW(e.nativeEvent.layout.width)}>
              {trackW > 0 && (
                <Animated.View
                  style={[styles.segIndicator, { width: (trackW - 8) / 2 }, segStyle]}
                />
              )}
              {(['login', 'signup'] as Mode[]).map((m) => {
                const active = mode === m;
                return (
                  <Pressable
                    key={m}
                    onPress={() => switchMode(m)}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: active }}
                    style={styles.segBtn}>
                    <Text style={[styles.segLabel, active && styles.segLabelActive]}>
                      {m === 'login' ? 'Log In' : 'Sign Up'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(190).springify().damping(17).stiffness(210).mass(0.72)}>
            <Animated.View layout={LinearTransition.springify().damping(24).stiffness(240)}>
              <Animated.View style={shakeStyle}>
                <View style={styles.card}>
                {status === 'success' ? (
                  <Animated.View entering={FadeIn.duration(220)} style={styles.successBox}>
                    <Ring value={1} size={86} strokeWidth={6} color={theme.colors.success}>
                      <Check size={34} color={theme.colors.success} strokeWidth={3} />
                    </Ring>
                    <Text style={styles.successTitle}>
                      {mode === 'login' ? 'Welcome back' : 'Account created'}
                    </Text>
                    <Text style={styles.successText}>Taking you to your command deck…</Text>
                  </Animated.View>
                ) : (
                  <>
                    {mode === 'signup' && (
                      <Animated.View
                        entering={FadeInDown.springify().damping(19).stiffness(230)}
                        exiting={FadeOut.duration(120)}>
                        <Text style={[styles.fieldLabel, styles.firstLabel]}>Full name</Text>
                        <View style={[styles.field, focused === 'name' && styles.fieldFocused]}>
                          <User size={17} color={focused === 'name' ? theme.colors.accent : theme.colors.textTertiary} />
                          <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Jax Walker"
                            placeholderTextColor={theme.colors.textTertiary}
                            style={styles.input}
                            onFocus={() => setFocused('name')}
                            onBlur={() => setFocused(null)}
                            autoComplete="name"
                            accessibilityLabel="Full name"
                          />
                        </View>
                      </Animated.View>
                    )}

                    <Text
                      style={[
                        styles.fieldLabel,
                        mode === 'login' && styles.firstLabel,
                      ]}>
                      Email
                    </Text>
                    <View style={[styles.field, focused === 'email' && styles.fieldFocused]}>
                      <Mail size={17} color={focused === 'email' ? theme.colors.accent : theme.colors.textTertiary} />
                      <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="you@studio.com"
                        placeholderTextColor={theme.colors.textTertiary}
                        style={styles.input}
                        onFocus={() => setFocused('email')}
                        onBlur={() => setFocused(null)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        accessibilityLabel="Email"
                      />
                    </View>

                    <Text style={styles.fieldLabel}>Password</Text>
                    <View style={[styles.field, focused === 'password' && styles.fieldFocused]}>
                      <Lock size={17} color={focused === 'password' ? theme.colors.accent : theme.colors.textTertiary} />
                      <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="••••••••"
                        placeholderTextColor={theme.colors.textTertiary}
                        style={styles.input}
                        onFocus={() => setFocused('password')}
                        onBlur={() => setFocused(null)}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                        accessibilityLabel="Password"
                      />
                      <Pressable
                        onPress={() => setShowPassword((v) => !v)}
                        accessibilityRole="button"
                        accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                        hitSlop={8}>
                        {showPassword ? (
                          <EyeOff size={18} color={theme.colors.textSecondary} />
                        ) : (
                          <Eye size={18} color={theme.colors.textSecondary} />
                        )}
                      </Pressable>
                    </View>

                    {mode === 'signup' && (
                      <Animated.View entering={FadeIn.duration(180)}>
                        <View style={styles.strengthRow}>
                          {[1, 2, 3, 4].map((seg) => (
                            <Animated.View
                              key={seg}
                              layout={LinearTransition.springify().damping(24).stiffness(260)}
                              style={[
                                styles.strengthSeg,
                                seg <= strength && {
                                  backgroundColor: STRENGTH_COLORS[strength],
                                  flexGrow: 1.35,
                                },
                              ]}
                            />
                          ))}
                        </View>
                        <Text style={styles.strengthLabel}>
                          {password
                            ? `Password strength: ${STRENGTH_LABELS[strength]}`
                            : 'Use 6+ characters with numbers and symbols.'}
                        </Text>
                      </Animated.View>
                    )}

                    {mode === 'login' && (
                      <View style={styles.forgotRow}>
                        {resetSent ? (
                          <Text style={styles.resetSent}>Reset link sent — check your inbox.</Text>
                        ) : (
                          <Pressable
                            onPress={() => setResetSent(true)}
                            accessibilityRole="button"
                            accessibilityLabel="Forgot password"
                            hitSlop={8}>
                            <Text style={styles.forgot}>Forgot password?</Text>
                          </Pressable>
                        )}
                      </View>
                    )}

                    {error && (
                      <Animated.Text entering={FadeIn.duration(160)} style={styles.error}>
                        {error}
                      </Animated.Text>
                    )}

                    <Animated.View style={btnStyle}>
                      <Pressable
                        onPress={submit}
                        onPressIn={() => setScale(btnScale, 0.97)}
                        onPressOut={() => setScale(btnScale, 1)}
                        disabled={busy}
                        accessibilityRole="button"
                        accessibilityLabel={mode === 'login' ? 'Sign in' : 'Create account'}
                        style={styles.primaryBtn}>
                        {status === 'loading' ? (
                          <ActivityIndicator color="#FFFFFF" />
                        ) : (
                          <>
                            <Text style={styles.primaryLabel}>
                              {mode === 'login' ? 'Sign In' : 'Create Account'}
                            </Text>
                            <ArrowRight size={17} color="#FFFFFF" />
                          </>
                        )}
                      </Pressable>
                    </Animated.View>
                  </>
                )}
                </View>
              </Animated.View>
            </Animated.View>
          </Animated.View>

          {status !== 'success' && (
            <Animated.View entering={FadeInDown.delay(260).springify().damping(17).stiffness(210).mass(0.72)}>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>
              <View style={styles.socialRow}>
                <Pressable
                  onPress={social}
                  accessibilityRole="button"
                  accessibilityLabel="Continue with Google"
                  style={({ pressed }) => [styles.socialBtn, pressed && styles.pressed]}>
                  <Text style={styles.googleGlyph}>G</Text>
                  <Text style={styles.socialLabel}>Google</Text>
                </Pressable>
                <Pressable
                  onPress={social}
                  accessibilityRole="button"
                  accessibilityLabel="Continue with Apple"
                  style={({ pressed }) => [styles.socialBtn, pressed && styles.pressed]}>
                  <Apple size={18} color={theme.colors.text} />
                  <Text style={styles.socialLabel}>Apple</Text>
                </Pressable>
              </View>
              <Pressable
                onPress={() => router.replace('/(tabs)')}
                accessibilityRole="button"
                accessibilityLabel="Continue as guest"
                style={styles.guestBtn}>
                <Text style={styles.guestLabel}>Continue as guest</Text>
              </Pressable>
              <Text style={styles.footnote}>
                Demo build — any valid email and a 6+ character password signs you in. Accounts
                are not stored yet.
              </Text>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.canvas, overflow: 'hidden' },
  flex: { flex: 1 },
  blob: { position: 'absolute', borderRadius: 999, backgroundColor: theme.colors.accentTint },
  blobTop: { width: 300, height: 300, top: -130, right: -110, opacity: 0.55 },
  blobBottom: { width: 240, height: 240, bottom: -110, left: -90, opacity: 0.4 },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
    paddingVertical: theme.spacing.xxxl,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  logoTile: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: { fontSize: 19, fontWeight: theme.fontWeight.extrabold, color: theme.colors.text, letterSpacing: -0.3 },
  brandKicker: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 1.8,
    color: theme.colors.rust,
    marginTop: 2,
  },
  h1: {
    fontSize: 30,
    fontWeight: theme.fontWeight.extrabold,
    color: theme.colors.text,
    letterSpacing: -0.5,
    marginTop: theme.spacing.xxxl,
  },
  sub: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
    lineHeight: 19,
    marginTop: theme.spacing.sm,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radii.pill,
    padding: 4,
    marginTop: theme.spacing.xxl,
    position: 'relative',
  },
  segIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.pill,
    shadowColor: '#141414',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  segBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    borderRadius: theme.radii.pill,
    zIndex: 1,
  },
  segLabel: { fontSize: theme.fontSize.body, fontWeight: theme.fontWeight.semibold, color: theme.colors.textSecondary },
  segLabelActive: { color: theme.colors.text, fontWeight: theme.fontWeight.bold },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.xl,
    marginTop: theme.spacing.xl,
    ...theme.shadow,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  firstLabel: { marginTop: 0 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 54,
    backgroundColor: theme.colors.surface,
  },
  fieldFocused: { borderColor: theme.colors.accent, backgroundColor: theme.colors.accentTint },
  input: { flex: 1, fontSize: theme.fontSize.body, color: theme.colors.text, minHeight: 50 },
  strengthRow: { flexDirection: 'row', gap: 6, marginTop: theme.spacing.lg },
  strengthSeg: {
    flexGrow: 1,
    flexBasis: 0,
    height: 5,
    borderRadius: 3,
    backgroundColor: theme.colors.surfaceAlt,
  },
  strengthLabel: { fontSize: 12, color: theme.colors.textSecondary, marginTop: theme.spacing.sm },
  forgotRow: { alignItems: 'flex-end', marginTop: theme.spacing.lg },
  forgot: { fontSize: theme.fontSize.caption, fontWeight: theme.fontWeight.semibold, color: theme.colors.accent },
  resetSent: { fontSize: theme.fontSize.caption, fontWeight: theme.fontWeight.semibold, color: theme.colors.success },
  error: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.danger,
    fontWeight: theme.fontWeight.semibold,
    marginTop: theme.spacing.lg,
    lineHeight: 17,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radii.pill,
    minHeight: 54,
    marginTop: theme.spacing.xxl,
  },
  primaryLabel: { color: '#FFFFFF', fontSize: theme.fontSize.body, fontWeight: theme.fontWeight.bold },
  successBox: { alignItems: 'center', paddingVertical: theme.spacing.xxl, gap: theme.spacing.md },
  successTitle: { fontSize: 20, fontWeight: theme.fontWeight.extrabold, color: theme.colors.text },
  successText: { fontSize: theme.fontSize.small, color: theme.colors.textSecondary },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xxl,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: theme.colors.border },
  dividerText: { fontSize: 12, color: theme.colors.textTertiary },
  socialRow: { flexDirection: 'row', gap: theme.spacing.md, marginTop: theme.spacing.lg },
  socialBtn: {
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
  socialLabel: { fontSize: theme.fontSize.small, fontWeight: theme.fontWeight.semibold, color: theme.colors.text },
  googleGlyph: { fontSize: 17, fontWeight: theme.fontWeight.extrabold, color: theme.colors.text },
  guestBtn: { alignItems: 'center', marginTop: theme.spacing.xl, paddingVertical: theme.spacing.sm },
  guestLabel: { fontSize: theme.fontSize.small, fontWeight: theme.fontWeight.semibold, color: theme.colors.textSecondary },
  footnote: {
    fontSize: 11,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  pressed: { opacity: 0.85 },
});
