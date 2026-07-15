import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors, Border, FontSizes, Spacing } from '../constants/theme';
import { StatusBadge } from '../components/StatusBadge';
import { HealthScore } from '../components/HealthScore';
import { EmptyState } from '../components/EmptyState';
import { MaterialIcons } from '@expo/vector-icons';

export const DevicesScreen = () => {
  const { storages, navigateTo } = useApp();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Devices</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => navigateTo('add-device')}
          activeOpacity={0.8}
        >
          <MaterialIcons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {storages.length === 0 ? (
          <EmptyState
            icon="devices"
            title="No Devices"
            subtitle="Add your first cold storage device"
            actionLabel="Add Device"
            onAction={() => navigateTo('add-device')}
          />
        ) : (
          storages.map(item => {
            // Count total active batches
            let totalBatches = 0;
            item.chambers.forEach(c => {
              totalBatches += c.batches.filter(b => b.status === 'Active').length;
            });

            // Compute free capacity
            let totalUsed = 0;
            item.chambers.forEach(c => {
              totalUsed += c.usedCapacity;
            });
            const remainingPercent = Math.max(0, 100 - Math.round((totalUsed / item.totalCapacity) * 100));

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.deviceCard}
                onPress={() => navigateTo('device-detail', { id: item.id })}
                activeOpacity={0.9}
              >
                <View style={styles.cardRow}>
                  <View style={styles.cardIconCircle}>
                    <MaterialIcons name="ac-unit" size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.cardTitleContainer}>
                    <Text style={styles.deviceName}>{item.name}</Text>
                    <Text style={styles.deviceChamberCount}>
                      {item.chambers.length} chambers · {totalBatches} active batch{totalBatches === 1 ? '' : 'es'}
                    </Text>
                  </View>
                  <StatusBadge status={item.status} />
                </View>

                <View style={styles.cardFooter}>
                  <HealthScore score={item.healthScore} />
                  <View style={styles.infoRow}>
                    <MaterialIcons 
                      name="wifi" 
                      size={18} 
                      color={item.status === 'Offline' ? Colors.offline : Colors.healthy} 
                    />
                    <Text style={styles.capacityText}>
                      {remainingPercent > 0 ? `${remainingPercent}% free` : 'Full'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
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
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
    color: Colors.light.textPrimary,
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 80,
  },
  deviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Border.cardRadius,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 12,
    elevation: 1,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  cardTitleContainer: {
    flex: 1,
  },
  deviceName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  deviceChamberCount: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    paddingTop: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  capacityText: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
  },
});
