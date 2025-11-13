// Profile Screen - User settings and profile
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Card } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../constants/colors';
import { changeLanguage } from '../i18n';

const ProfileScreen = () => {
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert(
      t('auth.logout'),
      'Möchtest du dich wirklich abmelden?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('auth.logout'),
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert(t('common.error'), 'Fehler beim Abmelden');
            }
          },
        },
      ]
    );
  };

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'de' ? 'en' : 'de';
    await changeLanguage(newLang);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Info */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Profil</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.subscription}>
          {t('subscription.current')}: {t(`subscription.${user?.subscription || 'free'}`)}
        </Text>
      </Card>

      {/* Settings */}
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>{t('settings.title')}</Text>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>{t('settings.language')}</Text>
          <Button
            title={i18n.language === 'de' ? '🇩🇪 DE' : '🇬🇧 EN'}
            onPress={toggleLanguage}
            variant="outline"
          />
        </View>
      </Card>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title={t('auth.logout')}
          onPress={handleSignOut}
          variant="outline"
          fullWidth
        />
      </View>

      {/* Version */}
      <Text style={styles.version}>Version 1.0.0</Text>
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
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.darkBrown,
    marginBottom: 12,
  },
  email: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  subscription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  actions: {
    marginTop: 32,
  },
  version: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 24,
  },
});

export default ProfileScreen;
