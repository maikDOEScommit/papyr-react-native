import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ImageBackground,
} from 'react-native';
import { COLORS } from '../constants/colors';

interface ShopScreenProps {
  onClose?: () => void;
}

interface JokerPackage {
  id: string;
  jokers: number;
  price: string;
  popular?: boolean;
}

const JOKER_PACKAGES: JokerPackage[] = [
  {
    id: 'small',
    jokers: 3,
    price: '2,99€',
  },
  {
    id: 'medium',
    jokers: 7,
    price: '4,99€',
    popular: true,
  },
  {
    id: 'large',
    jokers: 15,
    price: '8,99€',
  },
];

export default function ShopScreen({ onClose }: ShopScreenProps) {
  const handlePurchase = (pkg: JokerPackage) => {
    Alert.alert(
      'Funktion nicht verfügbar',
      'In-App-Käufe sind in dieser Version noch nicht implementiert.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/PAPYR.jpg')}
      style={styles.backgroundImage}
      imageStyle={{ opacity: 0.08 }}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
        <Text style={styles.headerTitle}>PAPYR SHOP</Text>
        {onClose && (
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoIcon}>🃏</Text>
          <Text style={styles.infoTitle}>Was sind Joker?</Text>
          <Text style={styles.infoText}>
            Joker schützen deinen Streak! Wenn du einen Tag verpasst, wird automatisch
            ein Joker verwendet und dein Streak bleibt erhalten.
          </Text>
          <Text style={styles.infoTextSecondary}>
            Du verdienst automatisch 1 Joker für jede 7-Tage-Streak.
          </Text>
        </View>

        {/* Packages */}
        <View style={styles.packagesSection}>
          <Text style={styles.sectionTitle}>Joker-Pakete</Text>

          {JOKER_PACKAGES.map((pkg) => (
            <View
              key={pkg.id}
              style={[
                styles.packageCard,
                pkg.popular && styles.packageCardPopular,
              ]}
            >
              {pkg.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>⭐ Beliebt</Text>
                </View>
              )}

              <View style={styles.packageContent}>
                <View style={styles.packageInfo}>
                  <Text style={styles.packageJokers}>{pkg.jokers} Joker</Text>
                  <Text style={styles.packagePrice}>{pkg.price}</Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.purchaseButton,
                    pkg.popular && styles.purchaseButtonPopular,
                  ]}
                  onPress={() => handlePurchase(pkg)}
                >
                  <Text style={styles.purchaseButtonText}>Kaufen</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Benefits */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Warum Joker?</Text>

          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🛡️</Text>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Streak-Schutz</Text>
              <Text style={styles.benefitText}>
                Verhindert automatisch den Verlust deiner Streak
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🎯</Text>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Flexibilität</Text>
              <Text style={styles.benefitText}>
                Bleib im Flow, auch an hektischen Tagen
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>📈</Text>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Langfristiger Erfolg</Text>
              <Text style={styles.benefitText}>
                Halte deine Motivation auch über Wochen und Monate
              </Text>
            </View>
          </View>
        </View>

        {/* Footer Note */}
        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            💡 Tipp: Verdiene kostenlose Joker durch eine 7-Tage-Streak!
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
  infoSection: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d2e2e',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  infoTextSecondary: {
    fontSize: 13,
    color: '#10B981',
    textAlign: 'center',
    fontWeight: '600',
  },
  packagesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d2e2e',
    marginBottom: 16,
  },
  packageCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  packageCardPopular: {
    borderColor: '#2d2e2e',
    borderWidth: 3,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: '#2d2e2e',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  packageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  packageInfo: {
    flex: 1,
  },
  packageJokers: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2d2e2e',
    marginBottom: 4,
  },
  packagePrice: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  purchaseButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2d2e2e',
  },
  purchaseButtonPopular: {
    backgroundColor: '#2d2e2e',
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d2e2e',
  },
  benefitsSection: {
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    padding: 16,
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d2e2e',
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  footerNote: {
    backgroundColor: '#10B981' + '20',
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  footerNoteText: {
    fontSize: 14,
    color: '#2d2e2e',
    textAlign: 'center',
    fontWeight: '600',
  },
});
