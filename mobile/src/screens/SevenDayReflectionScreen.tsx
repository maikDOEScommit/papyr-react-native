import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAnswers } from '../lib/dailyQuestions';
import { COLORS } from '../constants/colors';

interface SevenDayReflectionScreenProps {
  onComplete: (tenYearVision: string) => void;
}

export default function SevenDayReflectionScreen({ onComplete }: SevenDayReflectionScreenProps) {
  const [vision, setVision] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [answersCount, setAnswersCount] = useState(0);

  useEffect(() => {
    loadAnswers();
  }, []);

  const loadAnswers = async () => {
    const answers = await getAnswers();
    setAnswersCount(answers.length);
  };

  const saveVision = async () => {
    await AsyncStorage.setItem('papyr_ten_year_vision', vision);
  };

  const resetStreak = async () => {
    const stateStr = await AsyncStorage.getItem('papyr_state');
    if (stateStr) {
      const state = JSON.parse(stateStr);
      state.currentStreak = 0;
      state.commitments = [];
      state.lastCommitmentDate = null;
      await AsyncStorage.setItem('papyr_state', JSON.stringify(state));
    }
  };

  // Step 1: Celebration
  if (currentStep === 1) {
    return (
      <SafeAreaView style={styles.containerBlack}>
        <View style={styles.centerContent}>
          <View style={styles.celebration}>
            <Text style={styles.bigTitle}>7 TAGE</Text>
            <Text style={styles.celebrationSubtitle}>
              Ohne Ausnahme. Durchgezogen.
            </Text>
          </View>

          <View style={styles.boxLight}>
            <Text style={styles.boxText}>
              Du hast dir in den letzten 7 Tagen {answersCount} Fragen gestellt.
            </Text>
            <Text style={styles.boxSubtext}>
              Jetzt ist der Moment, ehrlich zu sein.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.buttonLight}
            onPress={() => setCurrentStep(2)}
          >
            <Text style={styles.buttonLightText}>Ich bin bereit</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Step 2: 10-Year Vision
  if (currentStep === 2) {
    return (
      <SafeAreaView style={styles.containerLight}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.visionHeader}>
              <Text style={styles.visionLabel}>DIE ENTSCHEIDENDE FRAGE</Text>
              <Text style={styles.visionQuestion}>
                Wo willst du in 10 Jahren sein?
              </Text>
              <Text style={styles.visionSubtitle}>
                Nicht träumen. Beschreiben.
              </Text>
            </View>

            <View style={styles.visionInputContainer}>
              <TextInput
                style={styles.visionInput}
                value={vision}
                onChangeText={setVision}
                placeholder="In 10 Jahren bin ich..."
                placeholderTextColor={COLORS.textSecondary}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                autoFocus
              />
              <Text style={styles.visionHint}>
                Nimm dir Zeit. Das ist dein Nordstern für die nächsten 3.650 Tage.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.buttonDark, !vision.trim() && styles.buttonDisabled]}
              onPress={async () => {
                if (!vision.trim()) {
                  Alert.alert('⚠️', 'Du kannst nicht weitergehen ohne zu wissen wohin.');
                  return;
                }
                await saveVision();
                setCurrentStep(3);
              }}
              disabled={!vision.trim()}
            >
              <Text style={styles.buttonDarkText}>Das ist mein Ziel</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Step 3: Commitment (without payment)
  return (
    <SafeAreaView style={styles.containerBlack}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.centerContent}>
          <Text style={styles.finalTitle}>
            Jetzt die Frage, die zählt:
          </Text>

          <View style={styles.boxDark}>
            <Text style={styles.finalQuestion}>
              Bist du bereit, die nächsten 7 Tage genauso durchzuziehen?
            </Text>

            <View style={styles.finalTextContainer}>
              <Text style={styles.finalText}>
                Du weißt jetzt, wo du in 10 Jahren sein willst.
              </Text>
              <Text style={styles.finalText}>
                Du hast 7 Tage durchgezogen. Jeden Abend. Ohne Ausnahme.
              </Text>
              <Text style={styles.finalTextBold}>
                Das hier funktioniert. Du weißt es. Du spürst es.
              </Text>
              <Text style={styles.finalTextBigBold}>
                Also: Warum nicht weitermachen?
              </Text>
            </View>
          </View>

          <View style={styles.finalButtonContainer}>
            <TouchableOpacity
              style={styles.buttonLight}
              onPress={() => onComplete(vision)}
            >
              <Text style={styles.buttonLightText}>
                Ich mache weiter!
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonTransparent}
              onPress={async () => {
                Alert.alert(
                  'Streak zurücksetzen?',
                  'Bist du sicher? Dein gesamter Fortschritt geht verloren.',
                  [
                    { text: 'Abbrechen', style: 'cancel' },
                    {
                      text: 'Zurücksetzen',
                      style: 'destructive',
                      onPress: async () => {
                        await resetStreak();
                        // Trigger app reload or navigate back
                        onComplete(vision);
                      },
                    },
                  ]
                );
              }}
            >
              <Text style={styles.buttonTransparentText}>
                Ich meinte es nicht ernst. (Streak zurücksetzen)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerBlack: {
    flex: 1,
    backgroundColor: '#000',
  },
  containerLight: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  celebration: {
    marginBottom: 48,
    alignItems: 'center',
  },
  bigTitle: {
    fontSize: 56,
    fontWeight: '700',
    color: COLORS.backgroundPrimary,
    letterSpacing: 8,
    marginBottom: 24,
  },
  celebrationSubtitle: {
    fontSize: 24,
    color: `${COLORS.backgroundPrimary}CC`,
  },
  boxLight: {
    borderWidth: 4,
    borderColor: COLORS.backgroundPrimary,
    padding: 32,
    marginBottom: 48,
  },
  boxText: {
    fontSize: 20,
    color: COLORS.backgroundPrimary,
    lineHeight: 30,
    marginBottom: 24,
  },
  boxSubtext: {
    fontSize: 18,
    color: `${COLORS.backgroundPrimary}B3`,
    fontStyle: 'italic',
  },
  buttonLight: {
    backgroundColor: COLORS.backgroundPrimary,
    padding: 24,
    borderWidth: 4,
    borderColor: COLORS.backgroundPrimary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonLightText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  visionHeader: {
    marginBottom: 40,
    alignItems: 'center',
  },
  visionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 2,
    marginBottom: 24,
  },
  visionQuestion: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.darkBrown,
    lineHeight: 42,
    textAlign: 'center',
    marginBottom: 24,
  },
  visionSubtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  visionInputContainer: {
    marginBottom: 40,
  },
  visionInput: {
    borderWidth: 4,
    borderColor: COLORS.darkBrown,
    padding: 20,
    fontSize: 16,
    backgroundColor: COLORS.white,
    minHeight: 200,
    textAlignVertical: 'top',
    color: COLORS.darkBrown,
  },
  visionHint: {
    marginTop: 16,
    fontSize: 13,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  buttonDark: {
    backgroundColor: COLORS.darkBrown,
    padding: 20,
    borderWidth: 4,
    borderColor: COLORS.darkBrown,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonDarkText: {
    color: COLORS.backgroundPrimary,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  finalTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.backgroundPrimary,
    lineHeight: 42,
    textAlign: 'center',
    marginBottom: 32,
  },
  boxDark: {
    borderWidth: 4,
    borderColor: COLORS.backgroundPrimary,
    padding: 40,
    marginBottom: 40,
  },
  finalQuestion: {
    fontSize: 26,
    color: COLORS.backgroundPrimary,
    fontWeight: '700',
    lineHeight: 36,
    marginBottom: 32,
  },
  finalTextContainer: {
    borderTopWidth: 2,
    borderColor: `${COLORS.backgroundPrimary}30`,
    paddingTop: 32,
  },
  finalText: {
    fontSize: 16,
    color: `${COLORS.backgroundPrimary}CC`,
    lineHeight: 24,
    marginBottom: 24,
  },
  finalTextBold: {
    fontSize: 18,
    color: COLORS.backgroundPrimary,
    fontWeight: '700',
    lineHeight: 26,
    marginBottom: 16,
  },
  finalTextBigBold: {
    fontSize: 20,
    color: COLORS.backgroundPrimary,
    fontWeight: '700',
    lineHeight: 28,
    marginTop: 16,
  },
  finalButtonContainer: {
    gap: 16,
  },
  buttonTransparent: {
    backgroundColor: 'transparent',
    padding: 12,
    borderWidth: 2,
    borderColor: `${COLORS.backgroundPrimary}33`,
  },
  buttonTransparentText: {
    color: `${COLORS.backgroundPrimary}66`,
    fontSize: 13,
    textAlign: 'center',
  },
});
