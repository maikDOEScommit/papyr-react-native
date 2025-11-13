// Commitment Upload Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/colors';
import { isWolfHour } from '../utils/wolfHour';
import { uploadImage, createCommitment } from '../services/supabase';

type CommitmentUploadScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CommitmentUpload'
>;

type CommitmentUploadScreenRouteProp = RouteProp<
  RootStackParamList,
  'CommitmentUpload'
>;

const CommitmentUploadScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<CommitmentUploadScreenNavigationProp>();
  const route = useRoute<CommitmentUploadScreenRouteProp>();
  const { user } = useAuth();

  const imageUri = (route.params as any)?.imageUri;

  const [goalText, setGoalText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!goalText.trim()) {
      Alert.alert(t('common.error'), t('commitment.noGoalText'));
      return;
    }

    if (!imageUri) {
      Alert.alert(t('common.error'), t('commitment.noImage'));
      return;
    }

    if (!user) {
      Alert.alert(t('common.error'), t('errors.unauthorized'));
      return;
    }

    try {
      setLoading(true);

      // Upload image to Supabase Storage
      const imageUrl = await uploadImage(imageUri, user.id);

      // Create commitment record
      await createCommitment({
        userId: user.id,
        imageUrl,
        goalText: goalText.trim(),
        isDuringWolfHour: isWolfHour(),
      });

      Alert.alert(
        t('common.success'),
        t('commitment.uploadSuccess'),
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back to home
              navigation.navigate('Main');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert(t('common.error'), t('commitment.uploadError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Image Preview */}
        {imageUri && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Goal Input */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>
            {t('commitment.goalPlaceholder')}
          </Text>
          <Input
            placeholder={t('commitment.goalPlaceholder')}
            value={goalText}
            onChangeText={setGoalText}
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          <Button
            title={t('commitment.upload')}
            onPress={handleUpload}
            loading={loading}
            fullWidth
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundPrimary,
  },
  content: {
    padding: 20,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: COLORS.white,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkBrown,
    marginBottom: 12,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
});

export default CommitmentUploadScreen;
