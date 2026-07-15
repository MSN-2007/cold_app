import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors, Border, FontSizes, Spacing } from '../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export const AddDeviceScreen = () => {
  const { addStorage, goBack } = useApp();
  const [name, setName] = useState('');
  const [connectionMethod, setConnectionMethod] = useState('Device ID');
  const [deviceIdInput, setDeviceIdInput] = useState('');
  const [chamberCount, setChamberCount] = useState(1);
  const [error, setError] = useState('');

  const connectionMethods = ['QR Code', 'Bluetooth', 'WiFi', 'Device ID'];

  const handleAdd = async () => {
    if (!name.trim()) {
      setError('Please enter a storage name');
      return;
    }

    await addStorage(
      name.trim(),
      connectionMethod,
      chamberCount,
      deviceIdInput.trim() || undefined
    );
    
    goBack();
  };

  const incrementChambers = () => {
    if (chamberCount < 10) setChamberCount(chamberCount + 1);
  };

  const decrementChambers = () => {
    if (chamberCount > 1) setChamberCount(chamberCount - 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.headerBack}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Storage</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Connect your cold storage</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Storage Name</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="ac-unit" size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. Cold Storage 01"
              placeholderTextColor={Colors.light.textHint}
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Connection Method</Text>
          <View style={styles.methodRow}>
            {connectionMethods.map(m => {
              const selected = connectionMethod === m;
              return (
                <TouchableOpacity
                  key={m}
                  style={[styles.methodChip, selected && styles.methodChipSelected]}
                  onPress={() => setConnectionMethod(m)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.methodChipText, selected && styles.methodChipTextSelected]}>
                    {m}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Device ID</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="qr-code" size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Leave blank for auto-generate"
              placeholderTextColor={Colors.light.textHint}
              value={deviceIdInput}
              onChangeText={setDeviceIdInput}
            />
          </View>
        </View>

        <View style={styles.chambersRow}>
          <Text style={styles.chambersLabel}>Number of Chambers</Text>
          <View style={styles.adjusterRow}>
            <TouchableOpacity 
              style={[styles.adjusterButton, chamberCount <= 1 && styles.adjusterButtonDisabled]} 
              onPress={decrementChambers}
              disabled={chamberCount <= 1}
            >
              <MaterialIcons name="remove" size={20} color={chamberCount <= 1 ? Colors.light.textHint : Colors.light.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.chamberCountText}>{chamberCount}</Text>
            <TouchableOpacity 
              style={[styles.adjusterButton, chamberCount >= 10 && styles.adjusterButtonDisabled]} 
              onPress={incrementChambers}
              disabled={chamberCount >= 10}
            >
              <MaterialIcons name="add" size={20} color={chamberCount >= 10 ? Colors.light.textHint : Colors.light.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleAdd} activeOpacity={0.8}>
          <MaterialIcons name="add" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.submitButtonText}>Add Storage</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: Colors.light.border,
  },
  headerBack: {
    padding: 4,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.lg,
  },
  errorText: {
    color: Colors.critical,
    fontSize: FontSizes.sm,
    fontWeight: '500',
    marginBottom: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Border.inputRadius,
    paddingHorizontal: Spacing.md,
    backgroundColor: '#FFFFFF',
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
  methodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  methodChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#FFFFFF',
  },
  methodChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  methodChipText: {
    fontSize: FontSizes.sm,
    color: Colors.light.textPrimary,
    fontWeight: '500',
  },
  methodChipTextSelected: {
    color: '#FFFFFF',
  },
  chambersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Border.cardRadius,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  chambersLabel: {
    fontSize: FontSizes.md,
    color: Colors.light.textPrimary,
    fontWeight: '500',
  },
  adjusterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  adjusterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjusterButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  chamberCountText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    minWidth: 16,
    textAlign: 'center',
  },
  submitButton: {
    flexDirection: 'row',
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
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});
