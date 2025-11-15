import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS } from '../constants/colors';

interface GoalsInputPopupProps {
  isOpen: boolean;
  imageUrl: string;
  onSubmit: (goals: string, signWithInitials: boolean) => void;
  onClose: () => void;
}

export default function GoalsInputPopup({
  isOpen,
  imageUrl,
  onSubmit,
  onClose,
}: GoalsInputPopupProps) {
  const [goals, setGoals] = useState('');
  const [signWithInitials, setSignWithInitials] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setGoals('');
      setSignWithInitials(false);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (goals.trim()) {
      onSubmit(goals.trim(), signWithInitials);
      onClose();
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.popup}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerText}>Deine Ziele für morgen</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView style={styles.content}>
              {/* Image Preview */}
              <View style={styles.imageSection}>
                <Text style={styles.sectionTitle}>Dein Zettel</Text>
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
              </View>

              {/* Goals Input */}
              <View style={styles.goalsSection}>
                <Text style={styles.sectionTitle}>
                  Was willst du morgen erreichen?
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={goals}
                  onChangeText={setGoals}
                  placeholder="Schreibe deine Ziele für morgen..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  autoFocus
                />
                <Text style={styles.hint}>
                  💡 Tipp: Schreibe konkrete, erreichbare Ziele. Was willst du morgen wirklich schaffen?
                </Text>
              </View>

              {/* Signature Option */}
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setSignWithInitials(!signWithInitials)}
              >
                <View style={[styles.checkbox, signWithInitials && styles.checkboxChecked]}>
                  {signWithInitials && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>
                  Mit meinen Initialen signieren
                </Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={onClose}
              >
                <Text style={styles.buttonSecondaryText}>Abbrechen</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary, !goals.trim() && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={!goals.trim()}
              >
                <Text style={styles.buttonPrimaryText}>Ziele speichern</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  keyboardView: {
    width: '100%',
    maxWidth: 900,
    maxHeight: '90%',
  },
  popup: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#2d2e2e',
    flex: 1,
  },
  header: {
    backgroundColor: 'rgb(206, 205, 203)',
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#2d2e2e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2d2e2e',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 24,
  },
  closeButtonText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2d2e2e',
  },
  content: {
    flex: 1,
    backgroundColor: 'rgb(206, 205, 203)',
  },
  imageSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d2e2e',
    marginBottom: 12,
  },
  imageContainer: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: '#2d2e2e',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  goalsSection: {
    padding: 24,
    paddingTop: 0,
  },
  textInput: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2d2e2e',
    minHeight: 150,
    textAlignVertical: 'top',
  },
  hint: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#2d2e2e',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  checkboxChecked: {
    backgroundColor: '#2d2e2e',
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#2d2e2e',
    flex: 1,
  },
  footer: {
    backgroundColor: 'rgb(206, 205, 203)',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 2,
    borderTopColor: '#2d2e2e',
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonSecondary: {
    backgroundColor: COLORS.white,
    borderColor: '#2d2e2e',
  },
  buttonPrimary: {
    backgroundColor: '#000',
    borderColor: '#2d2e2e',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonSecondaryText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d2e2e',
  },
  buttonPrimaryText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
});
