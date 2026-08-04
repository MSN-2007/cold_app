import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal, TextInput } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors, Border, FontSizes, Spacing } from '../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { CropProfile, Facility } from '../data/db';

export const LibraryScreen = () => {
  const { crops, facilities, addCustomCrop, removeCrop, removeFacility, navigateTo, getString } = useApp();
  const [activeTab, setActiveTab] = useState<'crops' | 'facilities'>('facilities');
  const [modalVisible, setModalVisible] = useState(false);

  // Custom Crop fields
  const [name, setName] = useState('');
  const [minTemp, setMinTemp] = useState('');
  const [maxTemp, setMaxTemp] = useState('');
  const [minHum, setMinHum] = useState('');
  const [maxHum, setMaxHum] = useState('');
  const [maxDays, setMaxDays] = useState('');

  const companyCrops = crops.filter(c => !c.isCustom);
  const customCrops = crops.filter(c => c.isCustom);

  const handleSaveCrop = () => {
    if (!name) return;

    const newCrop: CropProfile = {
      id: 'crop-custom-' + Date.now(),
      name,
      icon: '🌾',
      minTemp: parseFloat(minTemp) || 10,
      maxTemp: parseFloat(maxTemp) || 15,
      minHumidity: parseFloat(minHum) || 80,
      maxHumidity: parseFloat(maxHum) || 90,
      minCo2: 300,
      maxCo2: 800,
      minO2: 19,
      maxO2: 21,
      maxEthylene: 1.0,
      maxStorageDays: parseInt(maxDays, 10) || 30,
      stages: [],
      isCustom: true
    };

    addCustomCrop(newCrop);

    // Reset fields and close modal
    setName('');
    setMinTemp('');
    setMaxTemp('');
    setMinHum('');
    setMaxHum('');
    setMaxDays('');
    setModalVisible(false);
  };

  const renderCropCard = (profile: CropProfile) => {
    return (
      <View key={profile.id} style={styles.cropCard}>
        <View style={styles.cardHeader}>
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>{profile.icon}</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.cropName}>{profile.name}</Text>
            <Text style={styles.cropStorage}>
              Storage: {profile.maxStorageDays} days
            </Text>
          </View>
          {profile.isCustom && (
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={() => removeCrop(profile.id)}
            >
              <MaterialIcons name="delete-outline" size={20} color={Colors.critical} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.paramsRow}>
          <View style={styles.paramTag}>
            <Text style={styles.paramText}>Temp: {profile.minTemp}-{profile.maxTemp}°C</Text>
          </View>
          <View style={styles.paramTag}>
            <Text style={styles.paramText}>Humidity: {profile.minHumidity}-{profile.maxHumidity}%</Text>
          </View>
          <View style={styles.paramTag}>
            <Text style={styles.paramText}>CO₂: {profile.minCo2}-{profile.maxCo2} ppm</Text>
          </View>
          <View style={styles.paramTag}>
            <Text style={styles.paramText}>O₂: {profile.minO2}-{profile.maxO2}%</Text>
          </View>
          <View style={styles.paramTag}>
            <Text style={styles.paramText}>Ethylene: &lt;{profile.maxEthylene} ppm</Text>
          </View>
        </View>

        {profile.stages.length > 0 && (
          <View style={styles.stagesRow}>
            {profile.stages.map(s => (
              <View key={s.id} style={styles.stageTag}>
                <Text style={styles.stageText}>{s.name}</Text>
              </View>
            ))}
          </View>
        )}

        {profile.notes ? (
          <Text style={styles.notesText}>{profile.notes}</Text>
        ) : null}
      </View>
    );
  };

  const renderFacilityCard = (fac: Facility) => {
    return (
      <View key={fac.id} style={styles.facilityCard}>
        <View style={styles.cardHeader}>
          <View style={styles.facIconBox}>
            <MaterialIcons name="apartment" size={24} color={Colors.primary} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.cropName}>{fac.name}</Text>
            <Text style={styles.facCode}>
              Code: {fac.facilityCode} · {fac.type}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={() => removeFacility(fac.id)}
          >
            <MaterialIcons name="delete-outline" size={20} color={Colors.critical} />
          </TouchableOpacity>
        </View>

        <View style={styles.facDetailsBox}>
          <View style={styles.facDetailRow}>
            <MaterialIcons name="place" size={16} color={Colors.light.textSecondary} />
            <Text style={styles.facDetailText}>{fac.location}</Text>
          </View>
          <View style={styles.facDetailRow}>
            <MaterialIcons name="storage" size={16} color={Colors.light.textSecondary} />
            <Text style={styles.facDetailText}>Total Capacity: {fac.totalCapacity} Tons</Text>
          </View>
          <View style={styles.facDetailRow}>
            <MaterialIcons name="ac-unit" size={16} color={Colors.light.textSecondary} />
            <Text style={styles.facDetailText}>{fac.climateZone}</Text>
          </View>
          <View style={styles.facDetailRow}>
            <MaterialIcons name="person" size={16} color={Colors.light.textSecondary} />
            <Text style={styles.facDetailText}>Manager: {fac.managerName || 'Staff'}</Text>
          </View>
        </View>

        <View style={styles.facFooter}>
          <View style={styles.methodBadge}>
            <MaterialIcons name="qr-code-scanner" size={14} color={Colors.primary} />
            <Text style={styles.methodBadgeText}>Via {fac.connectionMethod}</Text>
          </View>
          <View style={styles.statusActiveBadge}>
            <Text style={styles.statusActiveText}>{fac.status}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Inventory & Library</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => {
            if (activeTab === 'facilities') {
              navigateTo('add-facility');
            } else {
              setModalVisible(true);
            }
          }}
          activeOpacity={0.8}
        >
          <MaterialIcons name="add" size={18} color="#FFFFFF" style={{ marginRight: 4 }} />
          <Text style={styles.addButtonText}>
            {activeTab === 'facilities' ? 'Add Facility' : 'Add Crop'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Segment Switcher */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity 
          style={[styles.segmentBtn, activeTab === 'facilities' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('facilities')}
        >
          <MaterialIcons name="apartment" size={18} color={activeTab === 'facilities' ? Colors.primary : Colors.light.textSecondary} />
          <Text style={[styles.segmentBtnText, activeTab === 'facilities' && styles.segmentBtnTextActive]}>
            Facilities Network ({facilities.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.segmentBtn, activeTab === 'crops' && styles.segmentBtnActive]}
          onPress={() => setActiveTab('crops')}
        >
          <MaterialIcons name="menu-book" size={18} color={activeTab === 'crops' ? Colors.primary : Colors.light.textSecondary} />
          <Text style={[styles.segmentBtnText, activeTab === 'crops' && styles.segmentBtnTextActive]}>
            Crop Profiles ({crops.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'facilities' ? (
          <>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Registered Facilities</Text>
              <TouchableOpacity onPress={() => navigateTo('add-facility')}>
                <Text style={styles.linkText}>+ Add New Facility</Text>
              </TouchableOpacity>
            </View>

            {facilities.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="apartment" size={48} color={Colors.light.textHint} />
                <Text style={styles.emptyTitle}>No Facilities Registered</Text>
                <Text style={styles.emptySubtitle}>Register physical cold warehouses, packhouses, or transit hubs using QR, BLE, WiFi, or Unique Code.</Text>
                <TouchableOpacity 
                  style={styles.emptyBtn} 
                  onPress={() => navigateTo('add-facility')}
                >
                  <Text style={styles.emptyBtnText}>+ Add Facility</Text>
                </TouchableOpacity>
              </View>
            ) : (
              facilities.map(fac => renderFacilityCard(fac))
            )}
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Company Standard Library</Text>
            {companyCrops.map(c => renderCropCard(c))}

            {customCrops.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: Spacing.md }]}>Custom Crops</Text>
                {customCrops.map(c => renderCropCard(c))}
              </>
            )}
          </>
        )}
      </ScrollView>

      {/* Add Custom Crop Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Custom Crop Profile</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={Colors.light.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Crop Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Avocado"
                  placeholderTextColor={Colors.light.textHint}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Min Temp (°C)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 10"
                    placeholderTextColor={Colors.light.textHint}
                    keyboardType="numeric"
                    value={minTemp}
                    onChangeText={setMinTemp}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                  <Text style={styles.inputLabel}>Max Temp (°C)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 15"
                    placeholderTextColor={Colors.light.textHint}
                    keyboardType="numeric"
                    value={maxTemp}
                    onChangeText={setMaxTemp}
                  />
                </View>
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Min Humidity (%)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 80"
                    placeholderTextColor={Colors.light.textHint}
                    keyboardType="numeric"
                    value={minHum}
                    onChangeText={setMinHum}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                  <Text style={styles.inputLabel}>Max Humidity (%)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 90"
                    placeholderTextColor={Colors.light.textHint}
                    keyboardType="numeric"
                    value={maxHum}
                    onChangeText={setMaxHum}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Max Storage Days</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 30"
                  placeholderTextColor={Colors.light.textHint}
                  keyboardType="numeric"
                  value={maxDays}
                  onChangeText={setMaxDays}
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveCrop} activeOpacity={0.8}>
                <Text style={styles.saveButtonText}>Save Crop Profile</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
    color: Colors.light.textPrimary,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderColor: Colors.light.border,
    gap: 8,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: Border.smallRadius,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#F9FAFB',
    gap: 6,
  },
  segmentBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: '#F0F9FF',
  },
  segmentBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  segmentBtnTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 80,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginLeft: 4,
  },
  linkText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
  cropCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Border.cardRadius,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  facilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Border.cardRadius,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  facIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  iconText: {
    fontSize: 22,
  },
  titleContainer: {
    flex: 1,
  },
  cropName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  facCode: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  cropStorage: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  deleteButton: {
    padding: 6,
  },
  facDetailsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: Border.smallRadius,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    gap: 6,
  },
  facDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  facDetailText: {
    fontSize: 12,
    color: Colors.light.textPrimary,
  },
  facFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  methodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  methodBadgeText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  statusActiveBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusActiveText: {
    color: Colors.healthy,
    fontSize: 11,
    fontWeight: '700',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: Border.cardRadius,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginTop: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
    lineHeight: 18,
  },
  emptyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Border.buttonRadius,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  paramsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  paramTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.light.background,
    borderRadius: 6,
  },
  paramText: {
    fontSize: 11,
    color: Colors.light.textPrimary,
  },
  stagesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  stageTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
  },
  stageText: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  notesText: {
    fontSize: FontSizes.xs,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: Spacing.md,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  modalForm: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Border.inputRadius,
    paddingHorizontal: Spacing.md,
    height: 48,
    fontSize: FontSizes.md,
    color: Colors.light.textPrimary,
    backgroundColor: '#F9FAFB',
  },
  rowInputs: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: Border.buttonRadius,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});
