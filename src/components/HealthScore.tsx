import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSizes } from '../constants/theme';

interface HealthScoreProps {
  score: number;
}

export const HealthScore = ({ score }: HealthScoreProps) => {
  const getColor = () => {
    if (score >= 80) return Colors.healthy;
    if (score >= 60) return Colors.warning;
    return Colors.critical;
  };

  const color = getColor();

  return (
    <View style={styles.container}>
      <View style={[styles.circle, { borderColor: color }]}>
        <Text style={[styles.scoreText, { color }]}>
          {Math.round(score)}
        </Text>
      </View>
      <Text style={styles.labelText}>Health</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  scoreText: {
    fontSize: 10,
    fontWeight: '700',
  },
  labelText: {
    marginLeft: 6,
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
});
