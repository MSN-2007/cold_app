import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors, Border, FontSizes, Spacing } from '../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { ColdStorage } from '../data/db';

export const DeviceHealthScreen = () => {
  const { storages, goBack } = useApp();

  const getHealthColor = (score: number) => {
    if (score >= 80) return Colors.healthy;
    if (score >= 60) return Colors.warning;
    return Colors.critical;
  };

  const getHealthBg = (score: number) => {
    if (score >= 80) return Colors.healthyBg;
    return Colors.warningBg;
  };

  const getMetricColor = (val: number) => {
    if (val >= 85) return Colors.healthy;
    if (val >= 70) return Colors.warning;
    return Colors.critical;
  };

  const renderHealthCheckItem = (label: string, value: number) => {
    const color = getMetricColor(value);
    return (
      <View key={label} style={styles.checkItem}>
        <MaterialIcons name="check-circle" size={16} color={color} style={{ marginRight: 8 }} />
        <Text style={styles.checkLabel}>{label}</Text>
        <Text style={[styles.checkValue, { color }]}>{Math.round(value)}%</Text>
      </View>
    );
  };

  const renderDeviceHealthCard = (device: ColdStorage) => {
    const checks = [
      { label: 'Temperature Sensor', val: 95 },
      { label: 'Humidity Sensor', val: 92 },
      { label: 'Gas Sensors', val: 88 },
      { label: 'Fan', val: 100 },
      { label: 'Door', val: 100 },
      { label: 'Controller', val: 96 },
      { label: 'WiFi', val: device.healthScore >= 80 ? 95 : 70 },
      { label: 'Bluetooth', val: 90 }
    ];

    const scoreColor = getHealthColor(device.healthScore);
    const scoreBg = getHealthBg(device.healthScore);

    return (
      <View key={device.id} style={styles.deviceCard}>
        <View style={styles.cardHeader}>
          <MaterialIcons name="ac-unit" size={20} color={Colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.deviceName} numberOfLines={1}>{device.name}</Text>
          <View style={[styles.scoreBadge, { backgroundColor: scoreBg }]}>
            <Text style={[styles.scoreText, { color: scoreColor }]}>
              {Math.round(device.healthScore)}%
            </Text>
          </View>
        </View>

        <View style={styles.checksList}>
          {checks.map(item => renderHealthCheckItem(item.label, item.val))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.headerBack}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Device Health</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {storages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No devices to check health</Text>
          </View>
        ) : (
          storages.map(renderDeviceHealthCard)
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
  headerBack: {
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    marginTop: 40,
  },
  emptyText: {
    color: Colors.light.textSecondary,
    fontSize: FontSizes.md,
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
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: Spacing.sm,
    marginBottom: Spacing.md,
  },
  deviceName: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
  },
  checksList: {
    gap: 8,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkLabel: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.light.textPrimary,
  },
  checkValue: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
});
