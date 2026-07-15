import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Colors, Border, FontSizes, Spacing } from '../../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

interface LoginScreenProps {
  onSwitchToSignup: () => void;
}

export const LoginScreen = ({ onSwitchToSignup }: LoginScreenProps) => {
  const { login, getString } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }
    const success = await login(email, password);
    if (!success) {
      setError('Invalid email or password');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="ac-unit" size={48} color="#FFFFFF" />
            </View>
            <Text style={styles.appName}>{getString('app_title')}</Text>
            <Text style={styles.tagline}>Intelligent Cold Storage</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.welcomeText}>Sign In</Text>
            
            {error ? (
              <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={16} color={Colors.critical} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor={Colors.light.textHint}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={Colors.light.textHint}
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={onSwitchToSignup}>
                <Text style={styles.linkText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: Spacing.md,
  },
  appName: {
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    color: Colors.light.textPrimary,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: Border.cardRadius,
    padding: Spacing.lg,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  welcomeText: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.lg,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.criticalBg,
    padding: 10,
    borderRadius: Border.smallRadius,
    marginBottom: Spacing.md,
  },
  errorText: {
    color: Colors.critical,
    fontSize: FontSizes.sm,
    marginLeft: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Border.inputRadius,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: '#FAFAFA',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: FontSizes.md,
    color: Colors.light.textPrimary,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Border.buttonRadius,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  footerText: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
  },
  linkText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
});
