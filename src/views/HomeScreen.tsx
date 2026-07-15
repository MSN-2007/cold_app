import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors, Border, FontSizes, Spacing } from '../constants/theme';
import { StatusBadge } from '../components/StatusBadge';
import { HealthScore } from '../components/HealthScore';
import { EmptyState } from '../components/EmptyState';
import { MaterialIcons } from '@expo/vector-icons';

export const HomeScreen = () => {
  const { storages, alerts, getString, navigateTo } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');

  // Filter crops icons
  const cropIcons: Record<string, string> = {
    Tomato: '🍅',
    Potato: '🥔',
    Banana: '🍌',
    Apple: '🍎',
    Mango: '🥭',
    Onion: '🧅',
    Garlic: '🧄',
    Ginger: '🫚',
    Carrot: '🥕',
    'Leafy Vegetables': '🥬',
  };

  const urgentAlerts = alerts.filter(a => !a.isRead && (a.severity === 'Critical' || a.severity === 'Warning'));

  // Filter storages
  const getFilteredStorages = () => {
    switch (activeFilter) {
      case 'Online':
        return storages.filter(s => s.status !== 'Offline');
      case 'Offline':
        return storages.filter(s => s.status === 'Offline');
      case 'Warning':
        return storages.filter(s => s.status === 'Warning');
      case 'Critical':
        return storages.filter(s => s.status === 'Critical');
      default:
        return storages;
    }
  };

  const filteredStorages = getFilteredStorages();

  const getStats = () => {
    const total = storages.length;
    const healthy = storages.filter(s => s.status === 'Healthy').length;
    const warning = storages.filter(s => s.status === 'Warning').length;
    const critical = storages.filter(s => s.status === 'Critical').length;
    const offline = storages.filter(s => s.status === 'Offline').length;
    return { total, healthy, warning, critical, offline };
  };

  const stats = getStats();
  const filters = ['All', 'Online', 'Offline', 'Warning', 'Critical'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{getString('app_title')}</Text>
          <Text style={styles.subtitle}>
            {storages.length} storage{storages.length === 1 ? '' : 's'}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => navigateTo('add-device')}
          activeOpacity={0.8}
        >
          <MaterialIcons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statTile}>
            <Text style={[styles.statValue, { color: Colors.light.textPrimary }]}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={[styles.statValue, { color: Colors.healthy }]}>{stats.healthy}</Text>
            <Text style={styles.statLabel}>Healthy</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={[styles.statValue, { color: Colors.warning }]}>{stats.warning}</Text>
            <Text style={styles.statLabel}>Warning</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={[styles.statValue, { color: Colors.critical }]}>{stats.critical}</Text>
            <Text style={styles.statLabel}>Critical</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={[styles.statValue, { color: Colors.offline }]}>{stats.offline}</Text>
            <Text style={styles.statLabel}>Offline</Text>
          </View>
        </View>

        {/* Warning Alert Banner */}
        {urgentAlerts.length > 0 ? (
          <TouchableOpacity 
            style={styles.alertBanner} 
            onPress={() => navigateTo('alerts')}
            activeOpacity={0.9}
          >
            <View style={styles.alertIconCircle}>
              <MaterialIcons name="warning" size={24} color={Colors.warning} />
            </View>
            <View style={styles.alertTextContainer}>
              <Text style={styles.alertTitle}>{urgentAlerts[0].title}</Text>
              <Text style={styles.alertMessage} numberOfLines={2}>
                {urgentAlerts[0].message}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={Colors.light.textHint} />
          </TouchableOpacity>
        ) : null}

        {/* Filter Chips */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filterRow}
        >
          {filters.map(f => {
            const selected = activeFilter === f;
            return (
              <TouchableOpacity 
                key={f} 
                style={[styles.filterChip, selected && styles.filterChipSelected]}
                onPress={() => setActiveFilter(f)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterChipText, selected && styles.filterChipTextSelected]}>
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Devices list */}
        {storages.length === 0 ? (
          <EmptyState
            icon="ac-unit"
            title="No Cold Storages Yet"
            subtitle="Add your first cold storage to start monitoring"
            actionLabel="Add Storage"
            onAction={() => navigateTo('add-device')}
          />
        ) : filteredStorages.length === 0 ? (
          <EmptyState
            icon="search-off"
            title="No Matching Devices"
            subtitle={`No cold storages found with status: ${activeFilter}`}
          />
        ) : (
          filteredStorages.map(item => {
            // Find all crop names stored in this device
            const cropsSet = new Set<string>();
            item.chambers.forEach(c => {
              c.batches.forEach(b => {
                if (b.status === 'Active') {
                  cropsSet.add(b.cropName);
                }
              });
            });
            const cropList = Array.from(cropsSet);

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
                <View style={styles.cardHeader}>
                  <View style={styles.cardIconCircle}>
                    <MaterialIcons name="ac-unit" size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.cardTitleContainer}>
                    <Text style={styles.deviceName}>{item.name}</Text>
                    <Text style={styles.deviceChamberCount}>
                      {item.chambers.length} chamber{item.chambers.length === 1 ? '' : 's'}
                    </Text>
                  </View>
                  <StatusBadge status={item.status} />
                </View>

                {cropList.length > 0 ? (
                  <View style={styles.cropTagsRow}>
                    {cropList.map(crop => (
                      <View key={crop} style={styles.cropTag}>
                        <Text style={styles.cropTagText}>
                          {cropIcons[crop] || '🌾'} {crop}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : null}

                <View style={styles.cardFooter}>
                  <HealthScore score={item.healthScore} />
                  <View style={styles.capacityContainer}>
                    <Text style={styles.capacityText}>{remainingPercent}% free</Text>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${100 - remainingPercent}%`, backgroundColor: Colors.primary }]} />
                    </View>
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
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    fontWeight: '400',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 80,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  statTile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: Border.smallRadius,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  statValue: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F6',
    borderWidth: 1,
    borderColor: '#FFEBE6',
    borderRadius: Border.cardRadius,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  alertIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  alertTextContainer: {
    flex: 1,
    marginRight: Spacing.xs,
  },
  alertTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  alertMessage: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    paddingBottom: 4,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  filterChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.light.textPrimary,
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
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
  cardHeader: {
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
  cropTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.md,
  },
  cropTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  cropTagText: {
    fontSize: 12,
    color: Colors.light.textPrimary,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    paddingTop: Spacing.sm,
  },
  capacityContainer: {
    alignItems: 'flex-end',
  },
  capacityText: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  progressBarBg: {
    width: 100,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
});
