import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors, Border, FontSizes, Spacing } from '../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { CropProfile, StorageChamber } from '../data/db';

export const AddBatchScreen = () => {
  const { currentScreen, storages, crops, addBatch, goBack } = useApp();

  const deviceId = currentScreen.params?.device;
  const preselectedChamberId = currentScreen.params?.preselectedChamber;
  const device = storages.find(s => s.id === deviceId);

  // States
  const [selectedChamberId, setSelectedChamberId] = useState(preselectedChamberId || device?.chambers[0]?.id || '');
  const [selectedCrop, setSelectedCrop] = useState<CropProfile | null>(crops[0] || null);
  const [selectedStage, setSelectedStage] = useState(crops[0]?.stages[0]?.name || 'Green');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  if (!device) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Device not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleCropSelect = (crop: CropProfile) => {
    setSelectedCrop(crop);
    setSelectedStage(crop.stages[0]?.name || 'Fresh');
  };

  const handleSubmit = async () => {
    if (!selectedCrop || !selectedChamberId || !quantity) {
      setError('Please fill in all fields');
      return;
    }

    const qtyVal = parseFloat(quantity);
    if (isNaN(qtyVal) || qtyVal <= 0) {
      setError('Please enter a valid positive quantity');
      return;
    }

    const success = await addBatch(
      device.id,
      selectedChamberId,
      selectedCrop,
      selectedStage,
      qtyVal,
      'tons' // Matching default seeded mock units
    );

    if (success) {
      goBack();
    } else {
      setError('Failed to add batch');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.headerBack}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Batch</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>New Batch Details</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Chamber Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Chamber</Text>
          <View style={styles.chipsRow}>
            {device.chambers.map(c => {
              const selected = selectedChamberId === c.id;
              return (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => setSelectedChamberId(c.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {c.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Crop Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Select Crop</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cropsRow}>
            {crops.map(crop => {
              const selected = selectedCrop?.id === crop.id;
              return (
                <TouchableOpacity
                  key={crop.id}
                  style={[styles.cropSelectCard, selected && styles.cropSelectCardSelected]}
                  onPress={() => handleCropSelect(crop)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cropIcon}>{crop.icon}</Text>
                  <Text style={[styles.cropSelectName, selected && styles.cropSelectNameSelected]}>
                    {crop.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Stage Selection */}
        {selectedCrop && selectedCrop.stages.length > 0 && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Stage</Text>
            <View style={styles.chipsRow}>
              {selectedCrop.stages.map(s => {
                const selected = selectedStage === s.name;
                return (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => setSelectedStage(s.name)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                      {s.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Quantity Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Quantity (tons)</Text>
          <View style={styles.inputContainer}>
            <MaterialIcons name="scale" size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. 50"
              placeholderTextColor={Colors.light.textHint}
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />
          </View>
        </View>

        {/* Optimal Parameters Info Box */}
        {selectedCrop && (
          <View style={styles.infoBox}>
            <MaterialIcons name="info-outline" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.infoText}>
              Optimal: {selectedCrop.minTemp}-{selectedCrop.maxTemp}°C,{' '}
              {selectedCrop.minHumidity}-{selectedCrop.maxHumidity}% humidity
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
          <MaterialIcons name="add" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.submitButtonText}>Add Batch</Text>
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: FontSizes.sm,
    color: Colors.critical,
    fontWeight: '500',
    marginBottom: Spacing.md,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: Border.buttonRadius,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
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
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#FFFFFF',
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: FontSizes.sm,
    color: Colors.light.textPrimary,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  cropsRow: {
    gap: 12,
    paddingBottom: 4,
  },
  cropSelectCard: {
    width: 80,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Border.cardRadius,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  cropSelectCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.healthyBg,
  },
  cropIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  cropSelectName: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  cropSelectNameSelected: {
    color: Colors.primary,
    fontWeight: '700',
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.healthyBg,
    borderRadius: Border.smallRadius,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  infoText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: '500',
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
