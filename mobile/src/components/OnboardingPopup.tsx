import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { COLORS } from '../constants/colors';

interface PopupButton {
  text: string;
  action: string;
}

interface OnboardingPopupProps {
  title: string;
  text: string;
  buttons: PopupButton[];
  onAction: (action: string) => void;
  isVisible: boolean;
}

export default function OnboardingPopup({
  title,
  text,
  buttons,
  onAction,
  isVisible,
}: OnboardingPopupProps) {
  const handleAction = (action: string) => {
    onAction(action);
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={() => handleAction('close')}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>{title}</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.contentText}>{text}</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.button, index === 0 && styles.buttonPrimary]}
                onPress={() => handleAction(button.action)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    index === 0 && styles.buttonPrimaryText,
                  ]}
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
  popup: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#000',
  },
  header: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
  },
  content: {
    backgroundColor: 'rgb(206, 205, 203)',
    padding: 32,
  },
  contentText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#2d2e2e',
  },
  buttonContainer: {
    backgroundColor: 'rgb(206, 205, 203)',
    padding: 24,
    paddingTop: 0,
    gap: 12,
  },
  button: {
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonPrimary: {
    backgroundColor: '#000',
    borderColor: 'transparent',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d2e2e',
    textAlign: 'center',
  },
  buttonPrimaryText: {
    color: COLORS.white,
  },
});
