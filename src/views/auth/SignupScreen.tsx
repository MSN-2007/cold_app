import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Colors, Border, FontSizes, Spacing } from '../../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

interface SignupScreenProps {
  onSwitchToLogin: () => void;
}

export const SignupScreen = ({ onSwitchToLogin }: SignupScreenProps) => {
  const { signup, getString } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('MANAGER'); // Default role
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!name || !email) {
      setError('Please fill in Name and Email');
      return;
    }
    const success = await signup(name, email, phone, role, password);
    if (!success) {
      setError('Sign up failed');
    }
  };

  const roles = ['OWNER', 'MANAGER', 'VIEWER', 'TECHNICIAN'];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="ac-unit" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.appName}>{getString('app_title')}</Text>
            <Text style={styles.tagline}>Create Account</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.welcomeText}>Sign Up</Text>
            
            {error ? (
              <View style={styles.errorContainer}>
                <MaterialIcons name="error-outline" size={16} color={Colors.critical} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputContainer}>
              <MaterialIcons name="person" size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={Colors.light.textHint}
                value={name}
                onChangeText={setName}
              />
            </View>

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
              <MaterialIcons name="phone" size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor={Colors.light.textHint}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <Text style={styles.dropdownLabel}>Role</Text>
            <View style={styles.roleSelectionRow}>
              {roles.map((r) => {
                const selected = role === r;
                return (
                  <TouchableOpacity
                    key={r}
                    style={[styles.roleChip, selected && styles.roleChipSelected]}
                    onPress={() => setRole(r)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.roleChipText, selected && styles.roleChipTextSelected]}>
                      {r}
                    </Text>
                  </TouchableOpacity>
                );
              })}
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

            <TouchableOpacity style={styles.button} onPress={handleSignup} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={onSwitchToLogin}>
                <Text style={styles.linkText}>Sign In</Text>
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
    marginBottom: Spacing.lg,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: Spacing.sm,
  },
  appName: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
    color: Colors.light.textPrimary,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    marginTop: 2,
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
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
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
    height: 44,
    fontSize: FontSizes.md,
    color: Colors.light.textPrimary,
  },
  dropdownLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  roleSelectionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Spacing.md,
  },
  roleChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Border.smallRadius,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#F9FAFB',
  },
  roleChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  roleChipText: {
    fontSize: FontSizes.sm,
    color: Colors.light.textPrimary,
    fontWeight: '500',
  },
  roleChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
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
    marginTop: Spacing.xs,
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
    marginTop: Spacing.xs,
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
