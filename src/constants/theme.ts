import { Platform } from 'react-native';

export const Colors = {
  primary: '#1B5E20',
  primaryLight: '#4CAF50',
  primaryDark: '#0D3311',
  accent: '#0D47A1',
  accentLight: '#1976D2',
  
  healthy: '#4CAF50',
  warning: '#FFA726',
  critical: '#EF5350',
  offline: '#9E9E9E',
  
  healthyBg: '#E8F5E9',
  warningBg: '#FFF3E0',
  criticalBg: '#FFEBEE',
  
  light: {
    text: '#1A1A2E',
    textPrimary: '#1A1A2E',
    background: '#F5F7FA',
    card: '#FFFFFF',
    border: '#E5E7EB',
    textSecondary: '#6B7280',
    textHint: '#9CA3AF',
    divider: '#E5E7EB',
  },
  dark: {
    text: '#FFFFFF',
    textPrimary: '#FFFFFF',
    background: '#121212',
    card: '#1E1E1E',
    border: '#2A2A2A',
    textSecondary: '#9CA3AF',
    textHint: '#6B7280',
    divider: '#2A2A2A',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Border = {
  cardRadius: 16,
  buttonRadius: 12,
  inputRadius: 12,
  smallRadius: 8,
};

export const FontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 36,
};

export const statusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'healthy':
    case 'online':
      return Colors.healthy;
    case 'warning':
      return Colors.warning;
    case 'critical':
      return Colors.critical;
    case 'offline':
      return Colors.offline;
    default:
      return Colors.light.textSecondary;
  }
};

export const statusBg = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'healthy':
    case 'online':
      return Colors.healthyBg;
    case 'warning':
      return Colors.warningBg;
    case 'critical':
      return Colors.criticalBg;
    default:
      return '#F3F4F6';
  }
};
