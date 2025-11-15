import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { COLORS } from '../constants/colors';

interface RulesScreenProps {
  onClose?: () => void;
}

interface Rule {
  number: number;
  title: string;
  description: string;
  icon: string;
}

const RULES: Rule[] = [
  {
    number: 1,
    title: 'Dein Zettel',
    description:
      'Lässt sich täglich nur von 20:00 - 02:00 Uhr hochladen. Wenn du es vergisst, kannst du deinen Tageserfolg nicht dokumentieren.\n\nDas ist das Spiel, das ist Disziplin.',
    icon: '📋',
  },
  {
    number: 2,
    title: 'Der Streak',
    description:
      'Wir zählen die Tage, die du durchhältst. Verpasst du das Zeitfenster, fällst du auf 0.\n\nDas ist nur eine Zahl. Scheiß drauf! Von vorne anfangen heißt weitermachen!\n\nDas ist das Spiel, das ist Disziplin.',
    icon: '🔥',
  },
  {
    number: 3,
    title: 'Die Joker',
    description:
      'Für jeden 7-Tage-Streak erhältst du automatisch einen Joker. 🃏\n\nWenn du einen Tag verpasst, wird automatisch ein Joker eingesetzt, um deinen Streak zu retten. Hast du keinen Joker mehr, beginnt dein Streak von vorne.\n\nVerdiene dir Joker durch Disziplin.',
    icon: '🃏',
  },
  {
    number: 4,
    title: 'Der Aktenschrank',
    description:
      'Wir speichern deine letzten 14 Zettel kostenlos.\n\nFür 0,99€ im Monat wird daraus das ewige Archiv deines Erfolgs. Alle deine Zettel, für immer gespeichert.\n\nDein digitaler Aktenschrank für deine Erfolge.',
    icon: '📁',
  },
];

export default function RulesScreen({ onClose }: RulesScreenProps) {
  return (
    <ImageBackground
      source={require('../../assets/PAPYR.jpg')}
      style={styles.backgroundImage}
      imageStyle={{ opacity: 0.08 }}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
        <Text style={styles.headerTitle}>Spielregeln</Text>
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>

        {/* Rules */}
        <View style={styles.rulesSection}>
          {RULES.map((rule) => (
            <View key={rule.number} style={styles.ruleCard}>
              <View style={styles.ruleHeader}>
                <View style={styles.ruleNumber}>
                  <Text style={styles.ruleNumberText}>{rule.number}</Text>
                </View>
                <Text style={styles.ruleIcon}>{rule.icon}</Text>
              </View>

              <Text style={styles.ruleTitle}>{rule.title}</Text>
              <Text style={styles.ruleDescription}>{rule.description}</Text>
            </View>
          ))}
        </View>

        {/* Philosophy Section */}
        <View style={styles.philosophySection}>
          <Text style={styles.philosophyTitle}>Die Philosophie</Text>
          <Text style={styles.philosophyQuote}>
            "Disziplin ist die Brücke zwischen Zielen und Erfolg."
          </Text>
          <Text style={styles.philosophyText}>
            PAPYR ist kein Produktivitäts-Tool. Es ist ein Ritual. Ein tägliches Versprechen an dich selbst, dass du deine Ziele ernst nimmst. Schreibe sie auf. Mit der Hand. Auf Papier. Jeden Abend.
          </Text>
        </View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#2d2e2e',
    backgroundColor: 'rgb(206, 205, 203)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2d2e2e',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
  },
  closeButtonText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2d2e2e',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  rulesSection: {
    marginBottom: 24,
  },
  ruleCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ruleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ruleNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2d2e2e',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ruleNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  ruleIcon: {
    fontSize: 28,
  },
  ruleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d2e2e',
    marginBottom: 8,
  },
  ruleDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  philosophySection: {
    backgroundColor: '#2d2e2e',
    borderRadius: 12,
    padding: 24,
  },
  philosophyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  philosophyQuote: {
    fontSize: 16,
    color: COLORS.white,
    lineHeight: 24,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  philosophyText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
    textAlign: 'center',
  },
});
