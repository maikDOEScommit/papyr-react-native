import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../constants/colors';
import DashboardScreen from '../screens/DashboardScreen';
import ArchiveScreen from '../screens/ArchiveScreen';
import ShopScreen from '../screens/ShopScreen';
import RulesScreen from '../screens/RulesScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: Platform.OS === 'ios' ? 8 : 4,
          paddingTop: 8,
          paddingHorizontal: 4,
          height: Platform.OS === 'ios' ? 88 : 68,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarActiveTintColor: '#2d2e2e',
        tabBarInactiveTintColor: '#999',
        tabBarShowLabel: true,
        animation: 'none', // Disable animations to avoid reanimated dependency
      }}
    >
      <Tab.Screen
        name="Dashboard"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => null,
        }}
      >
        {() => <DashboardScreen onNavigateToCamera={() => {}} onNavigateToArchive={() => {}} />}
      </Tab.Screen>

      <Tab.Screen
        name="Archiv"
        component={ArchiveScreen}
        options={{
          tabBarLabel: 'Archiv',
          tabBarIcon: () => null,
        }}
      />

      <Tab.Screen
        name="Shop"
        component={ShopScreen}
        options={{
          tabBarLabel: 'Shop',
          tabBarIcon: () => null,
        }}
      />

      <Tab.Screen
        name="Rules"
        component={RulesScreen}
        options={{
          tabBarLabel: 'Regeln',
          tabBarIcon: () => null,
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: () => null,
        }}
      />
    </Tab.Navigator>
  );
}
