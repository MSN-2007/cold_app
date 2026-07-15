import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors, Border, FontSizes, Spacing } from '../constants/theme';
import { StatusBadge } from '../components/StatusBadge';
import { HealthScore } from '../components/HealthScore';
import { MaterialIcons } from '@expo/vector-icons';
import { StorageChamber, CropBatch } from '../data/db';

export const DeviceDetailScreen = () => {
  const { currentScreen, storages, removeBatch, navigateTo, goBack } = useApp();
  const deviceId = currentScreen.params?.id;
  const device = storages.find(s => s.id === deviceId);

  // Remove Batch Modal states
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [selectedChamberId, setSelectedChamberId] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<CropBatch | null>(null);
  const [removalReason, setRemovalReason] = useState('');

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

  // Calculate statistics
  let activeBatchesCount = 0;
  let totalGoods = 0;
  device.chambers.forEach(c => {
    const active = c.batches.filter(b => b.status === 'Active');
    activeBatchesCount += active.length;
    active.forEach(b => {
      totalGoods += b.quantity;
    });
  });

  let totalUsed = 0;
  device.chambers.forEach(c => {
    totalUsed += c.usedCapacity;
  });
  const remainingPercent = Math.max(0, 100 - Math.round((totalUsed / device.totalCapacity) * 100));

  const triggerRemoveBatch = (chamberId: string, batch: CropBatch) => {
    setSelectedChamberId(chamberId);
    setSelectedBatch(batch);
    setRemovalReason('Sold'); // default reason
    setRemoveModalVisible(true);
  };

  const handleConfirmRemove = async () => {
    if (!selectedBatch) return;
    const success = await removeBatch(device.id, selectedChamberId, selectedBatch.id, removalReason);
    if (success) {
      setRemoveModalVisible(false);
      setSelectedBatch(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.headerBack}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Storage Details</Text>
        <TouchableOpacity 
          onPress={() => navigateTo('device-share', { id: device.id })} 
          style={styles.headerShare}
        >
          <MaterialIcons name="share" size={22} color={Colors.light.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Device Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconCircle}>
              <MaterialIcons name="ac-unit" size={24} color={Colors.primary} />
            </View>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={styles.deviceFirmware}>
                Firmware: {device.firmwareVersion || 'v1.0.0'}
              </Text>
            </View>
            <StatusBadge status={device.status} />
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsRow}>
          <View style={styles.metricTile}>
            <MaterialIcons name="inventory" size={18} color={Colors.light.textSecondary} style={styles.metricIcon} />
            <Text style={styles.metricValue}>{activeBatchesCount}</Text>
            <Text style={styles.metricLabel}>Batches</Text>
          </View>
          <View style={styles.metricTile}>
            <MaterialIcons name="category" size={18} color={Colors.light.textSecondary} style={styles.metricIcon} />
            <Text style={styles.metricValue}>{Math.round(totalGoods)}t</Text>
            <Text style={styles.metricLabel}>Goods</Text>
          </View>
          <View style={styles.metricTile}>
            <MaterialIcons name="percent" size={18} color={Colors.light.textSecondary} style={styles.metricIcon} />
            <Text style={styles.metricValue}>{remainingPercent}%</Text>
            <Text style={styles.metricLabel}>Free</Text>
          </View>
          <View style={[styles.metricTile, { backgroundColor: '#F9FAFB' }]}>
            <HealthScore score={device.healthScore} />
          </View>
        </View>

        {/* Chambers Section */}
        <View style={styles.chambersHeader}>
          <Text style={styles.chambersTitle}>Chambers</Text>
          {device.status !== 'Offline' && (
            <TouchableOpacity 
              style={styles.addBatchLink} 
              onPress={() => navigateTo('add-batch', { device: device.id })}
              activeOpacity={0.8}
            >
              <MaterialIcons name="add" size={16} color={Colors.primary} />
              <Text style={styles.addBatchLinkText}>Add Batch</Text>
            </TouchableOpacity>
          )}
        </View>

        {device.chambers.map((chamber) => {
          const activeBatches = chamber.batches.filter(b => b.status === 'Active');

          return (
            <View key={chamber.id} style={styles.chamberCard}>
              <View style={styles.chamberHeader}>
                <View style={styles.chamberTitleRow}>
                  <MaterialIcons name="kitchen" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.chamberName}>{chamber.name}</Text>
                </View>
                <StatusBadge status={chamber.status} />
              </View>

              <View style={styles.paramsRow}>
                <View style={styles.paramTag}>
                  <MaterialIcons name="thermostat" size={14} color={Colors.light.textSecondary} style={{ marginRight: 4 }} />
                  <Text style={styles.paramText}>{chamber.temperature.toFixed(1)}°C</Text>
                </View>
                <View style={styles.paramTag}>
                  <MaterialIcons name="water-drop" size={14} color={Colors.light.textSecondary} style={{ marginRight: 4 }} />
                  <Text style={styles.paramText}>{chamber.humidity.toFixed(0)}%</Text>
                </View>
              </View>

              {activeBatches.length > 0 ? (
                activeBatches.map(batch => (
                  <View key={batch.id} style={styles.batchItem}>
                    <Text style={styles.batchEmoji}>{batch.cropIcon}</Text>
                    <View style={styles.batchInfo}>
                      <Text style={styles.batchTitle}>
                        {batch.cropName} · {batch.batchId}
                      </Text>
                      <Text style={styles.batchDetails}>
                        {batch.stage} · {batch.quantity} {batch.unit}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.removeBatchButton} 
                      onPress={() => triggerRemoveBatch(chamber.id, batch)}
                    >
                      <MaterialIcons name="close" size={16} color={Colors.critical} />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <View style={styles.emptyChamber}>
                  <TouchableOpacity 
                    style={styles.emptyChamberButton} 
                    onPress={() => navigateTo('add-batch', { device: device.id, preselectedChamber: chamber.id })}
                  >
                    <MaterialIcons name="add" size={16} color={Colors.primary} />
                    <Text style={styles.emptyChamberButtonText}>Add Batch</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Remove Batch Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={removeModalVisible}
        onRequestClose={() => setRemoveModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Remove Batch</Text>
              <TouchableOpacity onPress={() => setRemoveModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={Colors.light.textPrimary} />
              </TouchableOpacity>
            </View>

            {selectedBatch && (
              <View style={styles.modalForm}>
                <Text style={styles.removalBatchText}>
                  Remove {selectedBatch.batchId} ({selectedBatch.cropName})
                </Text>

                <Text style={styles.reasonLabel}>Reason for removal:</Text>
                
                {['Sold', 'Transferred', 'Spoiled', 'Other'].map((reason) => {
                  const selected = removalReason === reason;
                  return (
                    <TouchableOpacity 
                      key={reason} 
                      style={styles.radioOption} 
                      onPress={() => setRemovalReason(reason)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.radioCircle, selected && styles.radioCircleSelected]}>
                        {selected && <View style={styles.radioDot} />}
                      </View>
                      <Text style={styles.radioLabel}>{reason}</Text>
                    </TouchableOpacity>
                  );
                })}

                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmRemove} activeOpacity={0.8}>
                  <Text style={styles.confirmButtonText}>Confirm Remove</Text>
                </TouchableOpacity>
              </View>
            )}
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
  headerBack: {
    padding: 4,
  },
  headerShare: {
    padding: 4,
  },
  title: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: FontSizes.lg,
    color: Colors.critical,
    marginBottom: Spacing.md,
    fontWeight: '600',
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
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Border.cardRadius,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  cardTitleContainer: {
    flex: 1,
  },
  deviceName: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  deviceFirmware: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.md,
  },
  metricTile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Border.cardRadius,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    justifyContent: 'center',
  },
  metricIcon: {
    marginBottom: 4,
  },
  metricValue: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  metricLabel: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  chambersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingHorizontal: 4,
  },
  chambersTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  addBatchLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  addBatchLinkText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
  chamberCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Border.cardRadius,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  chamberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  chamberTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chamberName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  paramsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.sm,
  },
  paramTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  paramText: {
    fontSize: FontSizes.sm,
    color: Colors.light.textPrimary,
  },
  batchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.healthyBg,
    borderRadius: Border.smallRadius,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.healthy + '33',
  },
  batchEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  batchInfo: {
    flex: 1,
  },
  batchTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  batchDetails: {
    fontSize: FontSizes.xs,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  removeBatchButton: {
    padding: 4,
    backgroundColor: Colors.criticalBg,
    borderRadius: 6,
  },
  emptyChamber: {
    paddingTop: Spacing.xs,
  },
  emptyChamberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingVertical: 4,
  },
  emptyChamberButtonText: {
    color: Colors.primary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
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
  removalBatchText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.md,
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.sm,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.light.textHint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioCircleSelected: {
    borderColor: Colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  radioLabel: {
    fontSize: 14,
    color: Colors.light.textPrimary,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    borderRadius: Border.buttonRadius,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});
