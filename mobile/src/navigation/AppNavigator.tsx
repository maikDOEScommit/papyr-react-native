// Main App Navigator
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/colors';

// Import Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainContainer from '../screens/MainContainer';
import CameraScreen from '../screens/CameraScreen';
import CommitmentUploadScreen from '../screens/CommitmentUploadScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

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
              component={MainContainer}
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
