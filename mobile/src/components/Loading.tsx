// Loading Component
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export const Loading: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.darkBrown} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundPrimary,
  },
});
