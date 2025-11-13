// Archive Screen - Shows all past commitments
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card } from '../components';
import { COLORS } from '../constants/colors';

const ArchiveScreen = () => {
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <Text style={styles.title}>{t('navigation.archive')}</Text>
        <Text style={styles.subtitle}>
          Hier werden bald alle deine Commitments angezeigt
        </Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.darkBrown,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default ArchiveScreen;
