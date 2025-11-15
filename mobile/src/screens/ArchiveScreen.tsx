import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { getAppState, deleteCommitment, markCommitmentCompleted, Commitment } from '../lib/storage';
import { COLORS } from '../constants/colors';

interface ArchiveScreenProps {
  onBack?: () => void;
}

export default function ArchiveScreen({ onBack }: ArchiveScreenProps = {}) {
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'developed'>('all');

  useEffect(() => {
    loadCommitments();
  }, []);

  const loadCommitments = async () => {
    try {
      setLoading(true);
      const state = await getAppState();
      setCommitments(state.commitments);
    } catch (error) {
      console.error('Error loading commitments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Zettel löschen?',
      'Möchtest du diesen Zettel wirklich löschen? Das kann nicht rückgängig gemacht werden!',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            await deleteCommitment(id);
            await loadCommitments();
          },
        },
      ]
    );
  };

  const handleMarkCompleted = async (id: string) => {
    await markCommitmentCompleted(id);
    await loadCommitments();
  };

  const canMarkAsCompleted = (commitmentDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    const commitDate = new Date(commitmentDate);
    const currentDate = new Date(today);
    const diffDays = Math.floor((currentDate.getTime() - commitDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 1;
  };

  const filteredCommitments = filter === 'all'
    ? commitments
    : commitments.filter(c => !c.isDeveloping);

  const renderCommitmentCard = ({ item }: { item: Commitment }) => {
    return (
      <View style={styles.card}>
        {item.isDeveloping ? (
          // Developing State (Polaroid Effect)
          <View style={styles.developingContainer}>
            <View style={styles.developingPlaceholder}>
              <Text style={styles.developingText}>Entwickelt sich...</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.buttonText}>🗑</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Developed State
          <View>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.imageData }}
                style={styles.image}
                resizeMode="cover"
              />
              {item.signatureInitials && (
                <View style={styles.signatureBadge}>
                  <Text style={styles.signatureText}>{item.signatureInitials}</Text>
                </View>
              )}
              {item.completed && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedText}>✓ Erledigt</Text>
                </View>
              )}
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.dateText}>{item.date}</Text>
              <Text style={styles.goalsText} numberOfLines={3}>
                {item.goals}
              </Text>
            </View>

            <View style={styles.actionsContainer}>
              {canMarkAsCompleted(item.date) && !item.completed && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.completedButton]}
                  onPress={() => handleMarkCompleted(item.id)}
                >
                  <Text style={styles.buttonText}>✓ Als erledigt markieren</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.buttonText}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/last-papyr.png')}
      style={styles.backgroundImage}
      resizeMode="contain"
      imageStyle={{ alignSelf: 'center' }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Dein Archiv</Text>
          <Text style={styles.subtitle}>
            {commitments.length} {commitments.length === 1 ? 'Bekenntnis' : 'Bekenntnisse'} gesiegelt
          </Text>
        </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterButtonText, filter === 'all' && styles.filterButtonTextActive]}>
            Alle ({commitments.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'developed' && styles.filterButtonActive]}
          onPress={() => setFilter('developed')}
        >
          <Text style={[styles.filterButtonText, filter === 'developed' && styles.filterButtonTextActive]}>
            Entwickelt ({commitments.filter(c => !c.isDeveloping).length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Grid */}
      <FlatList
        data={filteredCommitments}
        renderItem={renderCommitmentCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadCommitments} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Noch keine Bekenntnisse vorhanden.</Text>
          </View>
        }
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2d2e2e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2d2e2e',
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },
  listContent: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  developingContainer: {
    alignItems: 'center',
  },
  developingPlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 4,
  },
  developingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#999',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 4,
  },
  signatureBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  signatureText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2d2e2e',
  },
  completedBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  completedText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
  },
  cardInfo: {
    marginBottom: 8,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
    marginBottom: 4,
  },
  goalsText: {
    fontSize: 11,
    color: '#666',
    lineHeight: 16,
  },
  actionsContainer: {
    gap: 4,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  completedButton: {
    backgroundColor: '#10B981',
  },
  deleteButton: {
    backgroundColor: '#000',
  },
  buttonText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
