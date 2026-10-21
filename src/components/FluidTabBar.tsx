import { Pressable, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BarChart3, Calendar, LayoutGrid, Users, type LucideIcon } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '../theme/theme';

/** Minimal shape of the props Expo Router hands a custom tab bar. */
export interface FluidTabBarProps {
  state: {
    index: number;
    routes: { key: string; name: string; params?: object }[];
  };
  navigation: {
    emit(options: {
      type: 'tabPress';
      target: string;
      canPreventDefault: true;
    }): { defaultPrevented: boolean };
    navigate(name: string, params?: object): void;
  };
}

interface TabDef {
  routeName: string;
  label: string;
  Icon: LucideIcon;
}

const TABS: TabDef[] = [
  { routeName: 'index', label: 'Hub', Icon: LayoutGrid },
  { routeName: 'roster', label: 'Roster', Icon: Users },
  { routeName: 'schedule', label: 'Schedule', Icon: Calendar },
  { routeName: 'leaderboard', label: 'Leaderboard', Icon: BarChart3 },
];

const FLUID = LinearTransition.springify().damping(26).stiffness(260).mass(0.9);

/**
 * Floating tab bar: sits raised off the bottom edge, and the active tab
 * expands into a solid blue pill with its label, gliding between tabs on
 * a spring. Inactive tabs stay icon-only so the active one dominates.
 */
export function FluidTabBar({ state, navigation }: FluidTabBarProps) {
  const insets = useSafeAreaInsets();
  const focusedRouteName = state.routes[state.index]?.name;

  return (
    <View
      style={[styles.wrap, { bottom: Math.max(insets.bottom, 10) + 10 }]}
      pointerEvents="box-none">
      <View style={styles.bar}>
        {TABS.map(({ routeName, label, Icon }) => {
          const route = state.routes.find((r) => r.name === routeName);
          if (!route) return null;
          const focused = focusedRouteName === routeName;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              Haptics.selectionAsync().catch(() => undefined);
              navigation.navigate(route.name, route.params);
            }
          };
          return (
            <Animated.View
              key={route.key}
              layout={FLUID}
              style={[styles.item, focused && styles.itemActive]}>
              <Pressable
                onPress={onPress}
                accessibilityRole="tab"
                accessibilityState={{ selected: focused }}
                accessibilityLabel={label}
                style={[styles.pressable, focused && styles.pressableActive]}>
                <Icon
                  size={22}
                  color={focused ? '#FFFFFF' : theme.colors.tabInactive}
                  strokeWidth={focused ? 2.4 : 2}
                />
                {focused && (
                  <Animated.Text
                    entering={FadeIn.duration(180)}
                    exiting={FadeOut.duration(100)}
                    numberOfLines={1}
                    style={styles.label}>
                    {label}
                  </Animated.Text>
                )}
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: theme.spacing.lg,
    right: theme.spacing.lg,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 32,
    padding: theme.spacing.sm,
    shadowColor: '#141414',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 12,
  },
  item: {
    borderRadius: theme.radii.pill,
    overflow: 'hidden',
  },
  itemActive: { backgroundColor: theme.colors.accent },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: 15,
    minHeight: 46,
  },
  pressableActive: { paddingHorizontal: 20 },
  label: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: theme.fontWeight.bold,
    letterSpacing: 0.1,
  },
});
