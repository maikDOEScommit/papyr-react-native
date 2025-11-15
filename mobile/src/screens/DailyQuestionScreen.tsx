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
import { getDailyQuestion, saveAnswer } from '../lib/dailyQuestions';
import { COLORS } from '../constants/colors';

interface DailyQuestionScreenProps {
  day: number;
  onComplete: () => void;
}

export default function DailyQuestionScreen({ day, onComplete }: DailyQuestionScreenProps) {
  const [answer, setAnswer] = useState('');
  const [question, setQuestion] = useState<any>(null);

  useEffect(() => {
    const q = getDailyQuestion(day);
    if (!q) {
      onComplete();
      return;
    }
    setQuestion(q);
  }, [day]);

  if (!question) {
    return null;
  }

  const handleSubmit = async () => {
    if (!answer.trim()) {
      Alert.alert('⚠️ Nimm dir einen Moment', 'Beantworte die Frage ehrlich.');
      return;
    }

    await saveAnswer(day, question.question, answer);
    onComplete();
  };

  const handleSkip = async () => {
    await saveAnswer(day, question.question, '(übersprungen)');
    onComplete();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.subtitle}>{question.subtitle}</Text>
            <Text style={styles.question}>{question.question}</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={answer}
              onChangeText={setAnswer}
              placeholder="Deine ehrliche Antwort..."
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              autoFocus
            />
            <Text style={styles.hint}>
              Niemand wird deine Antwort sehen. Außer du selbst. Sei ehrlich.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.submitButton, !answer.trim() && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!answer.trim()}
            >
              <Text style={styles.submitButtonText}>Bekenntnis siegeln</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Später beantworten</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressDots}>
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <View
                  key={d}
                  style={[
                    styles.dot,
                    d === day && styles.dotActive,
                    d < day && styles.dotCompleted,
                  ]}
                />
              ))}
            </View>
            <Text style={styles.progressText}>Frage {day} von 7</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 2,
    marginBottom: 16,
    textAlign: 'center',
  },
  question: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.darkBrown,
    lineHeight: 36,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 32,
  },
  input: {
    borderWidth: 3,
    borderColor: COLORS.darkBrown,
    padding: 16,
    fontSize: 16,
    backgroundColor: COLORS.white,
    minHeight: 150,
    textAlignVertical: 'top',
    color: COLORS.darkBrown,
  },
  hint: {
    marginTop: 12,
    fontSize: 13,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginBottom: 32,
  },
  submitButton: {
    backgroundColor: COLORS.darkBrown,
    padding: 20,
    borderWidth: 3,
    borderColor: COLORS.darkBrown,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: COLORS.backgroundPrimary,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  skipButton: {
    backgroundColor: COLORS.backgroundPrimary,
    padding: 16,
    borderWidth: 2,
    borderColor: `${COLORS.darkBrown}30`,
  },
  skipButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressDots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: `${COLORS.darkBrown}10`,
  },
  dotActive: {
    backgroundColor: COLORS.darkBrown,
  },
  dotCompleted: {
    backgroundColor: `${COLORS.darkBrown}40`,
  },
  progressText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
