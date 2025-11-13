// Main App Navigator
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList, MainTabParamList } from '../types';
import { COLORS } from '../constants/colors';

// Import Screens (we'll create these next)
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ArchiveScreen from '../screens/ArchiveScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CameraScreen from '../screens/CameraScreen';
import CommitmentUploadScreen from '../screens/CommitmentUploadScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Main Tab Navigator for authenticated users
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.darkBrown,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.borderLight,
        },
        headerStyle: {
          backgroundColor: COLORS.backgroundPrimary,
        },
        headerTintColor: COLORS.darkBrown,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'PAPYR',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Archive"
        component={ArchiveScreen}
        options={{
          title: 'Archiv',
          tabBarLabel: 'Archiv',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarLabel: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
};

// Root Navigator
export const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // You can add a splash screen component here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.backgroundPrimary,
          },
          headerTintColor: COLORS.darkBrown,
          contentStyle: {
            backgroundColor: COLORS.backgroundPrimary,
          },
        }}
      >
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          // Main App Stack
          <>
            <Stack.Screen
              name="Main"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Camera"
              component={CameraScreen}
              options={{
                title: 'Foto aufnehmen',
                presentation: 'modal',
              }}
            />
            <Stack.Screen
              name="CommitmentUpload"
              component={CommitmentUploadScreen}
              options={{
                title: 'Commitment hochladen',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
