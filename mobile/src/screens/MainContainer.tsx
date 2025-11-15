import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { getAppState, hasAnsweredQuestion, saveAnswer, shouldShow7DayReflection, markReflectionShown, completeOnboarding } from '../lib/storage';
import { shouldShowPopup, getPopupForDay, markPopupAsShown } from '../lib/onboardingHelper';

// Import Screens
import DailyQuestionScreen from './DailyQuestionScreen';
import SevenDayReflectionScreen from './SevenDayReflectionScreen';
import OnboardingScreen from './OnboardingScreen';
import OnboardingPopup from '../components/OnboardingPopup';
import BottomTabNavigator from '../navigation/BottomTabNavigator';

export default function MainContainer() {
  const [currentView, setCurrentView] = useState<'onboarding' | 'tabs' | 'dailyQuestion' | 'sevenDayReflection'>('tabs');
  const [currentDay, setCurrentDay] = useState(1);
  const [onboardingPopup, setOnboardingPopup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      const appState = await getAppState();
      const currentStreak = appState.currentStreak;

      // Check for onboarding first (highest priority)
      if (!appState.hasCompletedOnboarding) {
        setCurrentView('onboarding');
        setLoading(false);
        return;
      }

      // Check for 7-day reflection
      const needsReflection = await shouldShow7DayReflection();
      if (needsReflection) {
        setCurrentView('sevenDayReflection');
        setLoading(false);
        return;
      }

      // Check for daily questions (Days 1-7)
      if (currentStreak >= 1 && currentStreak <= 7) {
        const answered = await hasAnsweredQuestion(currentStreak);
        if (!answered) {
          setCurrentDay(currentStreak);
          setCurrentView('dailyQuestion');
          setLoading(false);
          return;
        }
      }

      // Check for onboarding popup
      const shouldShowOnboardingPopup = await shouldShowPopup();
      if (shouldShowOnboardingPopup) {
        const popup = await getPopupForDay();
        if (popup) {
          setOnboardingPopup(popup);
        }
      }

      setCurrentView('tabs');
      setLoading(false);
    } catch (error) {
      console.error('Error checking app state:', error);
      setCurrentView('tabs');
      setLoading(false);
    }
  };

  const handleOnboardingComplete = async (userName: string) => {
    try {
      await completeOnboarding(userName);
      await checkAppState();
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const handleDailyQuestionComplete = async () => {
    // After answering question, check if we need to show 7-day reflection
    const needsReflection = await shouldShow7DayReflection();
    if (needsReflection) {
      setCurrentView('sevenDayReflection');
    } else {
      // Check for onboarding popup
      await checkAppState();
    }
  };

  const handleSevenDayReflectionComplete = async () => {
    await markReflectionShown();
    await checkAppState();
  };

  const handleOnboardingAction = async (action: string) => {
    if (action === 'close') {
      // Mark this popup as shown
      await markPopupAsShown();
      setOnboardingPopup(null);
    }
  };

  if (loading) {
    return <View style={styles.container} />;
  }

  // Show Onboarding Screen
  if (currentView === 'onboarding') {
    return (
      <OnboardingScreen
        onComplete={handleOnboardingComplete}
      />
    );
  }

  // Show Daily Question Screen
  if (currentView === 'dailyQuestion') {
    return (
      <DailyQuestionScreen
        day={currentDay}
        onComplete={handleDailyQuestionComplete}
      />
    );
  }

  // Show 7-Day Reflection Screen
  if (currentView === 'sevenDayReflection') {
    return (
      <SevenDayReflectionScreen
        onComplete={handleSevenDayReflectionComplete}
      />
    );
  }

  // Show Bottom Tab Navigation with Onboarding Popup overlay
  return (
    <View style={styles.container}>
      <BottomTabNavigator />

      {/* Onboarding Popup Overlay */}
      {onboardingPopup && (
        <OnboardingPopup
          title={onboardingPopup.title}
          text={onboardingPopup.text}
          buttons={onboardingPopup.buttons}
          onAction={handleOnboardingAction}
          isVisible={!!onboardingPopup}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
});
