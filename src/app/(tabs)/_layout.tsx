import { Tabs } from 'expo-router';

import { FluidTabBar } from '../../components/FluidTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <FluidTabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'Hub' }} />
      <Tabs.Screen name="roster" options={{ title: 'Roster' }} />
      <Tabs.Screen name="schedule" options={{ title: 'Schedule' }} />
      <Tabs.Screen name="leaderboard" options={{ title: 'Leaderboard' }} />
      {/* Kept from the FitTrack build; reachable from Hub/Roster actions, not tabs. */}
      <Tabs.Screen name="join" options={{ href: null }} />
      <Tabs.Screen name="payments" options={{ href: null }} />
    </Tabs>
  );
}
