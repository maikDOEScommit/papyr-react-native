// Login Screen
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

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const LoginScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { signIn, resetPassword, skipLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // Reset errors
    setErrors({ email: '', password: '' });

    // Validate
    let hasError = false;
    const newErrors = { email: '', password: '' };

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

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
    } catch (error: any) {
      console.error('Login error:', error);

      // Provide user-friendly error messages
      let errorMessage = error.message || t('auth.loginError');

      if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Bitte bestätige zuerst deine E-Mail-Adresse. Überprüfe dein Postfach (auch Spam-Ordner).';
      } else if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'E-Mail oder Passwort ist falsch. Bitte überprüfe deine Eingaben.';
      } else if (error.message?.includes('User not found')) {
        errorMessage = 'Kein Konto mit dieser E-Mail gefunden. Bitte registriere dich zuerst.';
      }

      Alert.alert(
        t('common.error'),
        errorMessage
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { url } = await signInWithOAuth('google');
      if (url) {
        await Linking.openURL(url);
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      Alert.alert(
        t('common.error'),
        error.message || 'Google-Anmeldung fehlgeschlagen'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email || !validateEmail(email)) {
      Alert.alert(
        'E-Mail erforderlich',
        'Bitte gib deine E-Mail-Adresse ein, um das Passwort zurückzusetzen.'
      );
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      Alert.alert(
        'E-Mail gesendet',
        'Wir haben dir eine E-Mail zum Zurücksetzen deines Passworts geschickt. Bitte überprüfe dein Postfach.'
      );
    } catch (error: any) {
      console.error('Reset password error:', error);
      Alert.alert(
        t('common.error'),
        error.message || 'Fehler beim Zurücksetzen des Passworts'
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
            <Text style={styles.subtitle}>{t('auth.login')}</Text>
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
              autoComplete="password"
              error={errors.password}
            />

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Passwort vergessen?</Text>
            </TouchableOpacity>

            <Button
              title={t('auth.login')}
              onPress={handleLogin}
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
              title="Mit Google anmelden"
              onPress={handleGoogleLogin}
              loading={loading}
              fullWidth
              variant="outline"
            />
          </View>

          {/* Register Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('auth.noAccount')}</Text>
            <Button
              title={t('auth.register')}
              variant="outline"
              onPress={() => navigation.navigate('Register')}
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.darkBrown,
    fontWeight: '600',
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

export default LoginScreen;
