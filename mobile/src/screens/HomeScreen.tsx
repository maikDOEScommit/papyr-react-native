// Home Screen - Main Dashboard
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button, Card } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/colors';
import {
  getWolfHourStatus,
  formatTimeRemaining,
} from '../utils/wolfHour';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Main'
>;

const HomeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();

  const [wolfHourStatus, setWolfHourStatus] = useState(getWolfHourStatus());
  const [refreshing, setRefreshing] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  // Update Wolf Hour status every second
  useEffect(() => {
    const interval = setInterval(() => {
      setWolfHourStatus(getWolfHourStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch latest data from Supabase
    setWolfHourStatus(getWolfHourStatus());
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleUploadPress = () => {
    if (wolfHourStatus.isWolfHour) {
      navigation.navigate('Camera');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Section */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {t('common.appName')}
        </Text>
        <Text style={styles.subGreeting}>
          Hallo, {user?.email?.split('@')[0] || 'Wolf'}! 🐺
        </Text>
      </View>

      {/* Wolf Hour Status Card */}
      <Card style={styles.wolfHourCard}>
        <Text style={styles.cardTitle}>{t('wolfHour.title')}</Text>

        {wolfHourStatus.isWolfHour ? (
          <View style={styles.wolfHourActive}>
            <Text style={styles.wolfHourStatusText}>
              {t('wolfHour.active')}
            </Text>
            <View style={styles.timerContainer}>
              <Text style={styles.timerLabel}>{t('wolfHour.timeUntilEnd')}</Text>
              <Text style={styles.timerText}>
                {formatTimeRemaining(wolfHourStatus.timeUntilEnd || 0)}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.wolfHourInactive}>
            <Text style={styles.wolfHourStatusText}>
              {t('wolfHour.inactive')}
            </Text>
            <View style={styles.timerContainer}>
              <Text style={styles.timerLabel}>{t('wolfHour.timeUntilStart')}</Text>
              <Text style={styles.timerText}>
                {formatTimeRemaining(wolfHourStatus.timeUntilStart || 0)}
              </Text>
            </View>
          </View>
        )}

        <Text style={styles.wolfHourDescription}>
          {t('wolfHour.description')}
        </Text>
      </Card>

      {/* Streak Card */}
      <Card style={styles.streakCard}>
        <Text style={styles.cardTitle}>{t('streak.title')}</Text>
        <View style={styles.streakContent}>
          <View style={styles.streakItem}>
            <Text style={styles.streakNumber}>{currentStreak}</Text>
            <Text style={styles.streakLabel}>{t('streak.current')}</Text>
          </View>
          <View style={styles.streakDivider} />
          <View style={styles.streakItem}>
            <Text style={styles.streakNumber}>{currentStreak}</Text>
            <Text style={styles.streakLabel}>{t('streak.longest')}</Text>
          </View>
        </View>
        {currentStreak > 0 && (
          <Text style={styles.streakMessage}>{t('streak.keepGoing')}</Text>
        )}
      </Card>

      {/* Upload Button */}
      <Button
        title={
          wolfHourStatus.isWolfHour
            ? t('wolfHour.uploadNow')
            : t('wolfHour.cannotUpload')
        }
        onPress={handleUploadPress}
        disabled={!wolfHourStatus.isWolfHour}
        fullWidth
        style={styles.uploadButton}
      />

      {/* Today's Commitment (if uploaded) */}
      {/* TODO: Show today's commitment if already uploaded */}
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
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.darkBrown,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  wolfHourCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.darkBrown,
    marginBottom: 12,
  },
  wolfHourActive: {
    backgroundColor: COLORS.success + '20',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  wolfHourInactive: {
    backgroundColor: COLORS.brown + '20',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  wolfHourStatusText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.darkBrown,
    marginBottom: 8,
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.darkBrown,
    fontVariant: ['tabular-nums'],
  },
  wolfHourDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  streakCard: {
    marginBottom: 16,
  },
  streakContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
  },
  streakItem: {
    alignItems: 'center',
    flex: 1,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.darkBrown,
    marginBottom: 4,
  },
  streakLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  streakDivider: {
    width: 1,
    height: 60,
    backgroundColor: COLORS.border,
  },
  streakMessage: {
    fontSize: 14,
    color: COLORS.success,
    textAlign: 'center',
    marginTop: 8,
  },
  uploadButton: {
    marginBottom: 16,
  },
});

export default HomeScreen;
