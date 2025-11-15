import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { COLORS } from '../constants/colors';
import inspirationData from '../lib/inspirationData.json';

interface InspirationBrowserProps {
  isVisible: boolean;
  onClose: () => void;
}

interface Category {
  name: string;
  icon: string;
  items: string[];
}

export default function InspirationBrowser({
  isVisible,
  onClose,
}: InspirationBrowserProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    return Object.entries(inspirationData.categories).map(([key, value]) => ({
      id: key,
      ...(value as Category),
    }));
  }, []);

  const selectedCategoryData = useMemo(() => {
    if (!selectedCategory) return null;
    return categories.find(cat => cat.id === selectedCategory);
  }, [selectedCategory, categories]);

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  const handleClose = () => {
    setSelectedCategory(null);
    onClose();
  };

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={handleClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Inspiration</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Category View */}
        {!selectedCategory ? (
          <ScrollView style={styles.content} contentContainerStyle={styles.categoriesGrid}>
            <Text style={styles.subtitle}>
              Entdecke Ideen, die dein Leben bereichern.
            </Text>
            <View style={styles.grid}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryCard}
                  onPress={() => handleCategoryPress(category.id)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryCount}>
                    {category.items.length} Ideen
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        ) : (
          // Items View
          <View style={styles.content}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>← Zurück</Text>
            </TouchableOpacity>

            {/* Category Header */}
            {selectedCategoryData && (
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryHeaderIcon}>
                  {selectedCategoryData.icon}
                </Text>
                <Text style={styles.categoryHeaderName}>
                  {selectedCategoryData.name}
                </Text>
                <Text style={styles.categoryHeaderCount}>
                  {selectedCategoryData.items.length} Ideen
                </Text>
              </View>
            )}

            {/* Items List */}
            <ScrollView
              style={styles.itemsList}
              contentContainerStyle={styles.itemsListContent}
            >
              {selectedCategoryData?.items.map((item, index) => (
                <View key={index} style={styles.itemCard}>
                  <View style={styles.itemNumber}>
                    <Text style={styles.itemNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.itemText}>{item}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
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
    top: 16,
  },
  closeButtonText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2d2e2e',
  },
  content: {
    flex: 1,
  },
  categoriesGrid: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d2e2e',
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 12,
    color: '#666',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d2e2e',
  },
  categoryHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
  },
  categoryHeaderIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  categoryHeaderName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2d2e2e',
    marginBottom: 4,
  },
  categoryHeaderCount: {
    fontSize: 14,
    color: '#666',
  },
  itemsList: {
    flex: 1,
  },
  itemsListContent: {
    padding: 20,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  itemNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2d2e2e',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  itemNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: '#2d2e2e',
    lineHeight: 20,
  },
});
