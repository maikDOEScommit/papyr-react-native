// app.config.js - Expo Configuration with Environment Variables
require('dotenv').config();

module.exports = {
  expo: {
    name: 'PAPYR',
    slug: 'papyr',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#F5F1E8',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.papyr.app',
      infoPlist: {
        NSCameraUsageDescription: 'PAPYR needs camera access to capture your daily commitments.',
        NSPhotoLibraryUsageDescription: 'PAPYR needs photo library access to select commitment images.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#F5F1E8',
      },
      package: 'com.papyr.app',
      permissions: [
        'CAMERA',
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE',
      ],
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
    },
    plugins: [
      [
        'expo-camera',
        {
          cameraPermission: 'Allow PAPYR to access your camera to capture daily commitments.',
        },
      ],
    ],
  },
};
