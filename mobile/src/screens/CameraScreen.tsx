// Camera Screen for taking commitment photos
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button } from '../components';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/colors';

type CameraScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Camera'
>;

const CameraScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<CameraScreenNavigationProp>();
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Kamera-Berechtigung wird benötigt
        </Text>
        <Button
          title="Berechtigung erteilen"
          onPress={requestPermission}
        />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });

        if (photo) {
          // Navigate to upload screen with photo
          navigation.navigate('CommitmentUpload', {
            imageUri: photo.uri,
          } as any);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert(t('common.error'), 'Fehler beim Aufnehmen des Fotos');
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
      >
        <View style={styles.overlay}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.flipButtonText}>🔄</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <View style={styles.placeholder} />
          </View>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.backgroundPrimary,
  },
  permissionText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  topBar: {
    padding: 20,
    alignItems: 'flex-end',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 24,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButtonText: {
    fontSize: 24,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.cream,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
  },
  placeholder: {
    width: 50,
    height: 50,
  },
});

export default CameraScreen;
