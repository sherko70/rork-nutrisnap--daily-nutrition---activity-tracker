import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const { t, isRTL } = useLanguage();

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await signup({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, isRTL && styles.rtlText]}>{t('appName')}</Text>
        <Text style={[styles.subtitle, isRTL && styles.rtlText]}>Create your account</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <View style={[styles.inputWrapper, isRTL && styles.rtlInputWrapper]}>
            <User size={20} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, isRTL && styles.rtlInput]}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={[styles.inputWrapper, isRTL && styles.rtlInputWrapper]}>
            <Mail size={20} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, isRTL && styles.rtlInput]}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={[styles.inputWrapper, isRTL && styles.rtlInputWrapper]}>
            <Lock size={20} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, isRTL && styles.rtlInput]}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? (
                <EyeOff size={20} color={Colors.textLight} />
              ) : (
                <Eye size={20} color={Colors.textLight} />
              )}
            </Pressable>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={[styles.inputWrapper, isRTL && styles.rtlInputWrapper]}>
            <Lock size={20} color={Colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, isRTL && styles.rtlInput]}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color={Colors.textLight} />
              ) : (
                <Eye size={20} color={Colors.textLight} />
              )}
            </Pressable>
          </View>
        </View>

        <Pressable
          style={[styles.signupButton, isLoading && styles.disabledButton]}
          onPress={handleSignup}
          disabled={isLoading}
        >
          <Text style={styles.signupButtonText}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </Pressable>

        <View style={[styles.loginContainer, isRTL && styles.rtlLoginContainer]}>
          <Text style={[styles.loginText, isRTL && styles.rtlText]}>
            Already have an account?{' '}
          </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text style={styles.loginLink}>Sign In</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
  },
  rtlText: {
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  rtlInputWrapper: {
    flexDirection: 'row-reverse',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: Colors.textDark,
  },
  rtlInput: {
    textAlign: 'right',
  },
  eyeIcon: {
    padding: 4,
  },
  signupButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: Colors.mediumGray,
  },
  signupButtonText: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  rtlLoginContainer: {
    flexDirection: 'row-reverse',
  },
  loginText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  loginLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
});