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
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '../components';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../types';
import { COLORS } from '../constants/colors';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Register'
>;

const RegisterScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { signUp } = useAuth();

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
        'Registrierung erfolgreich! Bitte bestätige deine E-Mail.'
      );
    } catch (error: any) {
      console.error('Register error:', error);
      Alert.alert(
        t('common.error'),
        error.message || t('auth.registerError')
      );
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
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Logo/Title */}
          <View style={styles.header}>
            <Text style={styles.title}>{t('common.appName')}</Text>
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
});

export default RegisterScreen;
