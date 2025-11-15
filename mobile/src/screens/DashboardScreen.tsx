import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  RefreshControl,
  Platform,
  ImageBackground,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAppState, addCommitment, isWithinWolfHour, Commitment } from '../lib/storage';
import { getTimeUntilNextWindow, formatCountdown } from '../lib/countdown';
import { COLORS } from '../constants/colors';
import GoalsInputPopup from '../components/GoalsInputPopup';

interface DashboardScreenProps {
  onNavigateToCamera: () => void;
  onNavigateToArchive: () => void;
}

export default function DashboardScreen({
  onNavigateToCamera,
  onNavigateToArchive,
}: DashboardScreenProps) {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [jokers, setJokers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [showGoalsPopup, setShowGoalsPopup] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string>('');
  const [weekDaysToShow] = useState(7);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
    requestPermissions();
  }, []);

  // Update countdown every second
  useEffect(() => {
    const updateCountdown = () => {
      const time = getTimeUntilNextWindow();
      setCountdown(time);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        Alert.alert(
          'Berechtigung erforderlich',
          'Kamera- und Galerie-Zugriff werden benötigt, um Zettel hochzuladen.'
        );
      }
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const state = await getAppState();
      setCommitments(state.commitments);
      setCurrentStreak(state.currentStreak);
      setJokers(state.jokers || 0);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCameraPress = async () => {
    // Check if today already has commitment
    const today = new Date().toISOString().split('T')[0];
    const todayCommitment = commitments.find(c => c.date === today);
    
    if (todayCommitment) {
      Alert.alert('Bereits eingereicht', 'Du hast heute bereits ein Bekenntnis eingereicht!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImageUri(result.assets[0].uri);
      setShowGoalsPopup(true);
    }
  };

  const handleGalleryPress = async () => {
    const today = new Date().toISOString().split('T')[0];
    const todayCommitment = commitments.find(c => c.date === today);
    
    if (todayCommitment) {
      Alert.alert('Bereits eingereicht', 'Du hast heute bereits ein Bekenntnis eingereicht!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImageUri(result.assets[0].uri);
      setShowGoalsPopup(true);
    }
  };

  const handleGoalsSubmit = async (goals: string, signWithInitials: boolean) => {
    if (!selectedImageUri) return;

    try {
      setUploading(true);
      await addCommitment(selectedImageUri, goals, signWithInitials);
      await loadData();
      setSelectedImageUri('');
      Alert.alert('Erfolg!', 'Dein Bekenntnis wurde gesiegelt! 🔥');
    } catch (error) {
      console.error('Error submitting commitment:', error);
      Alert.alert('Fehler', 'Beim Hochladen ist ein Fehler aufgetreten.');
    } finally {
      setUploading(false);
    }
  };

  const renderWeekBar = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    const diff = currentDay === 0 ? -6 : 1 - currentDay;
    monday.setDate(today.getDate() + diff);

    const commitmentDates = new Set(
      commitments.filter(c => !c.isDeveloping).map(c => c.date)
    );

    const weekDays = ['M', 'D', 'M', 'D', 'F', 'S', 'S'];
    const cells = [];

    for (let i = 0; i < weekDaysToShow; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const isToday = dateStr === today.toISOString().split('T')[0];
      const hasCommitment = commitmentDates.has(dateStr);
      const dayNumber = date.getDate();

      cells.push(
        <View
          key={i}
          style={[
            styles.weekCell,
            isToday && styles.weekCellToday,
          ]}
        >
          <Text style={[styles.weekDayLabel, isToday && styles.weekDayLabelToday]}>
            {weekDays[i]}
          </Text>
          <Text style={[styles.weekDayNumber, isToday && styles.weekDayNumberToday]}>
            {dayNumber}
          </Text>
          {hasCommitment && !isToday && <Text style={styles.weekStar}>⭐</Text>}
          {isToday && <Text style={styles.weekFire}>🔥</Text>}
        </View>
      );
    }

    return <View style={styles.weekBar}>{cells}</View>;
  };

  const recentCommitments = commitments
    .filter(c => !c.isDeveloping)
    .slice(0, 3);

  const today = new Date().toISOString().split('T')[0];
  const canCommitToday = !commitments.some(c => c.date === today);

  const todayCommitmentsCount = 1247; // TODO: Get from API/database

  return (
    <ImageBackground
      source={require('../../assets/last-papyr.png')}
      style={styles.backgroundImage}
      resizeMode="contain"
      imageStyle={{ alignSelf: 'center' }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
        >
        {/* Week Bar */}
        <View style={styles.weekBarContainer}>{renderWeekBar()}</View>

        {/* Streak Display */}
        {!isWithinWolfHour() && (
          <View style={styles.streakContainer}>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {currentStreak}</Text>
            </View>
            <Text style={styles.streakSubtext}>
              So viele Tage hast du durchgezogen
            </Text>
          </View>
        )}

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.welcomeText}>Willkommen bei PAPYR.</Text>

          {/* Today's Commitments Count */}
          <Text style={styles.todayCount}>
            Heute wurden {todayCommitmentsCount} Zettel abgegeben
          </Text>

          {/* Status Message */}
          {canCommitToday ? (
            <Text style={styles.statusText}>Dein Zettel fehlt</Text>
          ) : (
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>Dein Zettel ist Zettel {commitments.length}</Text>
              <Text style={styles.statusText}>Danke für dein commitment.</Text>
            </View>
          )}

          {/* Countdown (when not in Wolf Hour) */}
          {!isWithinWolfHour() && (
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownLabel}>Nächstes Upload-Fenster:</Text>
              <Text style={styles.countdownTime}>
                {formatCountdown(countdown.hours, countdown.minutes, countdown.seconds)}
              </Text>
            </View>
          )}
        </View>

        {/* Spacer to push button to bottom */}
        <View style={styles.spacer} />

        {/* Single Upload Button at Bottom */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={[styles.papyrButton, (!canCommitToday || uploading) && styles.papyrButtonDisabled]}
            onPress={() => {
              if (Platform.OS === 'ios') {
                Alert.alert(
                  'Zettel hochladen',
                  'Wähle eine Option',
                  [
                    { text: 'Abbrechen', style: 'cancel' },
                    { text: 'Kamera', onPress: handleCameraPress },
                    { text: 'Galerie', onPress: handleGalleryPress },
                  ]
                );
              } else {
                Alert.alert(
                  'Zettel hochladen',
                  'Wähle eine Option',
                  [
                    { text: 'Abbrechen', style: 'cancel' },
                    { text: 'Kamera', onPress: handleCameraPress },
                    { text: 'Galerie', onPress: handleGalleryPress },
                  ]
                );
              }
            }}
            disabled={uploading || !canCommitToday}
          >
            <Text style={styles.papyrButtonText}>Schreibe deinen PAPYR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

        {/* Goals Input Popup */}
        <GoalsInputPopup
          isOpen={showGoalsPopup}
          imageUrl={selectedImageUri}
          onSubmit={handleGoalsSubmit}
          onClose={() => {
            setShowGoalsPopup(false);
            setSelectedImageUri('');
          }}
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  spacer: {
    flex: 1,
    minHeight: 100,
  },
  weekBarContainer: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  weekBar: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  weekCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    minHeight: 48,
  },
  weekCellToday: {
    backgroundColor: '#2d2e2e',
    borderColor: '#2d2e2e',
  },
  weekDayLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2d2e2e',
  },
  weekDayLabelToday: {
    color: COLORS.white,
  },
  weekDayNumber: {
    fontSize: 14,
    color: '#2d2e2e',
  },
  weekDayNumberToday: {
    color: COLORS.white,
  },
  weekStar: {
    fontSize: 10,
  },
  weekFire: {
    fontSize: 10,
  },
  streakContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  streakBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  streakText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#2d2e2e',
  },
  streakSubtext: {
    marginTop: 12,
    fontSize: 14,
    color: '#2d2e2e',
    opacity: 0.6,
    fontStyle: 'italic',
  },
  mainContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2d2e2e',
    marginBottom: 16,
    textAlign: 'center',
  },
  todayCount: {
    fontSize: 18,
    color: '#2d2e2e',
    marginBottom: 16,
    textAlign: 'center',
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 20,
    color: '#2d2e2e',
    marginBottom: 8,
    textAlign: 'center',
  },
  countdownContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  countdownLabel: {
    fontSize: 16,
    color: '#2d2e2e',
    marginBottom: 8,
  },
  countdownTime: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2d2e2e',
  },
  bottomButtonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  papyrButton: {
    backgroundColor: '#2d2e2e',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  papyrButtonDisabled: {
    opacity: 0.5,
  },
  papyrButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  recentSection: {
    marginTop: 40,
    paddingHorizontal: 16,
  },
  recentTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2d2e2e',
    marginBottom: 16,
  },
  recentCard: {
    width: 150,
    marginRight: 16,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  recentImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 4,
    marginBottom: 8,
  },
  recentDate: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    textAlign: 'center',
  },
  viewAllButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d2e2e',
  },
});
