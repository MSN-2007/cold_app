import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors, Border, FontSizes, Spacing } from '../constants/theme';
import { EmptyState } from '../components/EmptyState';
import { timeAgo } from '../utils/date';
import { MaterialIcons } from '@expo/vector-icons';
import { Alert } from '../data/db';

export const AlertsScreen = () => {
  const { alerts, markAlertRead, markAllAlertsRead } = useApp();

  const hasUnread = alerts.some(a => !a.isRead);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return Colors.critical;
      case 'warning':
        return Colors.warning;
      default:
        return Colors.light.textSecondary;
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return Colors.criticalBg;
      case 'warning':
        return Colors.warningBg;
      default:
        return '#F3F4F6';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'dangerous';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Alerts</Text>
        {hasUnread && (
          <TouchableOpacity onPress={markAllAlertsRead} activeOpacity={0.8}>
            <Text style={styles.markReadText}>Mark All Read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {alerts.length === 0 ? (
          <EmptyState
            icon="check-circle-outline"
            title="No Alerts"
            subtitle="Everything is running smoothly"
          />
        ) : (
          alerts.map(item => {
            const severityColor = getSeverityColor(item.severity);
            const severityBg = getSeverityBg(item.severity);
            const iconName = getSeverityIcon(item.severity);

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.alertCard,
                  item.isRead ? styles.cardRead : { backgroundColor: severityBg + '4D' } // 30% alpha for background
                ]}
                onPress={() => {
                  if (!item.isRead) {
                    markAlertRead(item.id);
                  }
                }}
                activeOpacity={item.isRead ? 1.0 : 0.8}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.iconCircle, { backgroundColor: severityBg }]}>
                    <MaterialIcons name={iconName as any} size={20} color={severityColor} />
                  </View>
                  <View style={styles.titleRow}>
                    <Text style={[styles.alertTitle, item.isRead && styles.textRead]}>
                      {item.title}
                    </Text>
                    <View style={[styles.severityTag, { backgroundColor: severityBg }]}>
                      <Text style={[styles.severityTagText, { color: severityColor }]}>
                        {item.severity}
                      </Text>
                    </View>
                  </View>
                  {!item.isRead && <View style={styles.unreadDot} />}
                </View>

                <Text style={styles.messageText}>{item.message}</Text>

                <View style={styles.recommendationContainer}>
                  <MaterialIcons name="lightbulb-outline" size={16} color={Colors.primary} />
                  <Text style={styles.recommendationText}>
                    {item.recommendedAction}
                  </Text>
                </View>

                <Text style={styles.timeText}>{timeAgo(item.timestamp)}</Text>
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
  markReadText: {
    color: Colors.primary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  scrollContent: {
    paddingVertical: Spacing.sm,
    paddingBottom: 80,
  },
  alertCard: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
    borderRadius: Border.cardRadius,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cardRead: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.light.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 8,
  },
  alertTitle: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  textRead: {
    color: Colors.light.textSecondary,
  },
  severityTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  severityTagText: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  messageText: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  recommendationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 6,
    padding: 8,
    marginBottom: Spacing.xs,
    gap: 6,
  },
  recommendationText: {
    flex: 1,
    fontSize: FontSizes.xs,
    color: Colors.primary,
    fontWeight: '500',
  },
  timeText: {
    fontSize: FontSizes.xs,
    color: Colors.light.textHint,
    marginTop: Spacing.xs,
  },
});
