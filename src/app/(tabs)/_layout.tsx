import React from 'react';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing } from '@/core/theme';
import {
  LayoutDashboard,
  Layers,
  TrendingUp,
  GitCommit,
  Sparkles,
} from 'lucide-react-native';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 10);
  const tabHeight = 52 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.borderHairline,
          borderTopWidth: Spacing.hairlineWidth,
          height: tabHeight,
          paddingTop: 8,
          paddingBottom: bottomPadding,
        },
        tabBarLabelStyle: {
          ...Typography.caption,
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Panel',
          tabBarLabel: 'Özet Panel',
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: 'Geliştirme',
          tabBarLabel: 'Projeler',
          tabBarIcon: ({ color, size }) => (
            <Layers size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analitik',
          tabBarLabel: 'SEO & GEO',
          tabBarIcon: ({ color, size }) => (
            <TrendingUp size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="changelog"
        options={{
          title: 'Değişiklikler',
          tabBarLabel: 'Canlı Akış',
          tabBarIcon: ({ color, size }) => (
            <GitCommit size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Hizmetler',
          tabBarLabel: 'Mağaza',
          tabBarIcon: ({ color, size }) => (
            <Sparkles size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
