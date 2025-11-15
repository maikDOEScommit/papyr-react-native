import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { getAppState } from '../lib/storage';
import { COLORS } from '../constants/colors';

interface UploadFlowScreenProps {
  imageData: string;
  onSubmit: (goals: string, signWithInitials: boolean) => void;
  onCancel: () => void;
}

export default function UploadFlowScreen({
  imageData,
  onSubmit,
  onCancel,
}: UploadFlowScreenProps) {
  const [goals, setGoals] = useState('');
  const [signWithInitials, setSignWithInitials] = useState(false);
  const [initials, setInitials] = useState('');

  useEffect(() => {
    loadUserInitials();
  }, []);

  const loadUserInitials = async () => {
    const appState = await getAppState();
    const userInitials = appState.userName
      ? appState.userName
          .split(' ')
          .map(name => name.charAt(0).toUpperCase())
          .join('')
      : '';
    setInitials(userInitials);
  };

  const handleSubmit = () => {
    if (!goals.trim()) {
      Alert.alert('⚠️', 'Bitte tippe deine Ziele ab.');
      return;
    }

    const goalLines = goals.split('\n').filter(g => g.trim());
    if (goalLines.length > 2) {
      Alert.alert('⚠️', 'Maximal 2 Ziele. Fokussiere dich!');
      return;
    }

    onSubmit(goals, signWithInitials);
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
          <Text style={styles.title}>Dein Bekenntnis</Text>

          {/* Image Preview */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageData }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* Goals Input */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Tippe deine 1-2 Ziele ab:</Text>
            <TextInput
              style={styles.textInput}
              value={goals}
              onChangeText={setGoals}
              placeholder={'Ziel 1\nZiel 2'}
              placeholderTextColor={COLORS.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              autoFocus
            />
            <Text style={styles.hint}>
              Jede Zeile = ein Ziel. Maximal 2. Das ist der Fokus.
            </Text>
          </View>

          {/* Signature Checkbox */}
          {initials && (
            <View style={styles.signatureContainer}>
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setSignWithInitials(!signWithInitials)}
              >
                <View style={[styles.checkbox, signWithInitials && styles.checkboxChecked]}>
                  {signWithInitials && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>
                  Mit meinen Initialen signieren ({initials})
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Actions */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.submitButton, !goals.trim() && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!goals.trim()}
            >
              <Text style={styles.submitButtonText}>Bekenntnis siegeln</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Abbrechen</Text>
            </TouchableOpacity>
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
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.darkBrown,
    marginBottom: 32,
    textAlign: 'center',
  },
  imageContainer: {
    borderWidth: 8,
    borderColor: COLORS.darkBrown,
    backgroundColor: COLORS.white,
    padding: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  inputSection: {
    marginBottom: 32,
  },
  label: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.darkBrown,
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 4,
    borderColor: COLORS.darkBrown,
    padding: 20,
    fontSize: 18,
    backgroundColor: COLORS.white,
    minHeight: 120,
    textAlignVertical: 'top',
    color: COLORS.darkBrown,
  },
  hint: {
    marginTop: 12,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  signatureContainer: {
    borderWidth: 4,
    borderColor: `${COLORS.darkBrown}30`,
    padding: 24,
    backgroundColor: COLORS.white,
    marginBottom: 32,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 4,
    borderColor: COLORS.darkBrown,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  checkboxChecked: {
    backgroundColor: COLORS.darkBrown,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkBrown,
    flex: 1,
  },
  buttonContainer: {
    gap: 16,
  },
  submitButton: {
    backgroundColor: COLORS.darkBrown,
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderWidth: 4,
    borderColor: COLORS.darkBrown,
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
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.backgroundPrimary,
    paddingVertical: 16,
    borderWidth: 4,
    borderColor: COLORS.darkBrown,
  },
  cancelButtonText: {
    color: COLORS.darkBrown,
    fontSize: 18,
    textAlign: 'center',
  },
});
