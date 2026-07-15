import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, statusColor, statusBg, Border, FontSizes, Spacing } from '../constants/theme';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const textColor = statusColor(status);
  const bgColor = statusBg(status);

  return (
    <View style={[styles.badge, { backgroundColor: bgColor, borderColor: textColor + '33' }]}>
      <Text style={[styles.text, { color: textColor }]}>
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Border.smallRadius,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
});
