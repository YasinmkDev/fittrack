import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { CalendarDays, LayoutDashboard, UserPlus, Users, Wallet } from 'lucide-react-native';

import { theme } from '../../theme/theme';

const ICON_SIZE = 22;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.tabInactive,
        tabBarLabelStyle: { fontSize: 11, fontWeight: theme.fontWeight.medium, marginTop: 2 },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 62,
          paddingTop: 6,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <LayoutDashboard size={ICON_SIZE} color={color} />,
        }}
      />
      <Tabs.Screen
        name="members"
        options={{
          title: 'Members',
          tabBarIcon: ({ color }) => <Users size={ICON_SIZE} color={color} />,
        }}
      />
      <Tabs.Screen
        name="join"
        options={{
          title: 'Join',
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: focused ? theme.colors.accent : theme.colors.ink,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: -6,
              }}>
              <UserPlus size={20} color="#FFFFFF" />
            </View>
          ),
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: theme.fontWeight.medium,
            marginTop: 2,
            color: theme.colors.text,
          },
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Schedule',
          tabBarIcon: ({ color }) => <CalendarDays size={ICON_SIZE} color={color} />,
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: 'Payments',
          tabBarIcon: ({ color }) => <Wallet size={ICON_SIZE} color={color} />,
        }}
      />
    </Tabs>
  );
}
