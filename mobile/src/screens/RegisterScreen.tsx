// Register Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/colors';
import { signInWithOAuth } from '../services/supabase';
import { Linking } from 'react-native';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Register'
>;

const RegisterScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { signUp, skipLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    // Reset errors
    setErrors({ email: '', password: '', confirmPassword: '' });

    // Validate
    let hasError = false;
    const newErrors = { email: '', password: '', confirmPassword: '' };

    if (!email) {
      newErrors.email = t('auth.invalidEmail');
      hasError = true;
    } else if (!validateEmail(email)) {
      newErrors.email = t('auth.invalidEmail');
      hasError = true;
    }

    if (!password) {
      newErrors.password = t('auth.weakPassword');
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = t('auth.weakPassword');
      hasError = true;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Bitte Passwort bestätigen';
      hasError = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwörter stimmen nicht überein';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password);
      Alert.alert(
        t('common.success'),
        'Registrierung erfolgreich! Bitte bestätige deine E-Mail-Adresse, um dich anmelden zu können. Überprüfe dein Postfach (auch Spam-Ordner).'
      );
    } catch (error: any) {
      console.error('Register error:', error);

      // Provide user-friendly error messages
      let errorMessage = error.message || t('auth.registerError');

      if (error.message?.includes('User already registered')) {
        errorMessage = 'Diese E-Mail-Adresse ist bereits registriert. Bitte melde dich an oder verwende eine andere E-Mail.';
      } else if (error.message?.includes('Password should be at least')) {
        errorMessage = 'Das Passwort muss mindestens 6 Zeichen lang sein.';
      }

      Alert.alert(
        t('common.error'),
        errorMessage
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setLoading(true);
      const { url } = await signInWithOAuth('google');
      if (url) {
        await Linking.openURL(url);
      }
    } catch (error: any) {
      console.error('Google register error:', error);
      Alert.alert(
        t('common.error'),
        error.message || 'Google-Registrierung fehlgeschlagen'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSkipLogin = async () => {
    if (Platform.OS === 'web') {
      // On web, skip directly without alert (web doesn't support Alert.alert well)
      await skipLogin();
    } else {
      // On mobile, show confirmation dialog
      Alert.alert(
        'Als Gast fortfahren',
        'Möchtest du die App ohne Anmeldung nutzen? Deine Daten werden nur lokal gespeichert.',
        [
          { text: 'Abbrechen', style: 'cancel' },
          {
            text: 'Fortfahren',
            onPress: async () => await skipLogin(),
          },
        ]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Skip Button - Top Right */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkipLogin}>
        <Text style={styles.skipButtonText}>Überspringen</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Logo/Title */}
          <View style={styles.header}>
            <Image
              source={require('../../assets/PAPYR.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.subtitle}>{t('auth.register')}</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label={t('auth.email')}
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              error={errors.email}
            />

            <Input
              label={t('auth.password')}
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password-new"
              error={errors.password}
            />

            <Input
              label="Passwort bestätigen"
              placeholder="Passwort erneut eingeben"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="password-new"
              error={errors.confirmPassword}
            />

            <Button
              title={t('auth.register')}
              onPress={handleRegister}
              loading={loading}
              fullWidth
            />

            {/* OAuth Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>oder</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Button */}
            <Button
              title="Mit Google registrieren"
              onPress={handleGoogleRegister}
              loading={loading}
              fullWidth
              variant="outline"
            />
          </View>

          {/* Login Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('auth.hasAccount')}</Text>
            <Button
              title={t('auth.login')}
              variant="outline"
              onPress={() => navigation.navigate('Login')}
              fullWidth
            />
          </View>
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
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.darkBrown,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.darkBrown,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  form: {
    marginBottom: 32,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.borderLight,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default RegisterScreen;
