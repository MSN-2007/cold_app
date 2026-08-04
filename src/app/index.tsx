import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors } from '../constants/theme';
import { LoginScreen } from '../views/auth/LoginScreen';
import { SignupScreen } from '../views/auth/SignupScreen';
import { NavigationShell } from '../components/NavigationShell';
import { DeviceDetailScreen } from '../views/DeviceDetailScreen';
import { AddDeviceScreen } from '../views/AddDeviceScreen';
import { AddBatchScreen } from '../views/AddBatchScreen';
import { DeviceShareScreen } from '../views/DeviceShareScreen';
import { DeviceHealthScreen } from '../views/DeviceHealthScreen';

export default function AppEntry() {
  const { currentUser, currentScreen } = useApp();
  const [isLoginView, setIsLoginView] = useState(true);

  // Auth check bypassed temporarily for product testing
  // if (!currentUser) {
  //   return isLoginView ? (
  //     <LoginScreen onSwitchToSignup={() => setIsLoginView(false)} />
  //   ) : (
  //     <SignupScreen onSwitchToLogin={() => setIsLoginView(true)} />
  //   );
  // }

  // Render authenticated screens based on custom state router
  const renderScreen = () => {
    switch (currentScreen.name) {
      case 'main':
        return <NavigationShell />;
      case 'device-detail':
        return <DeviceDetailScreen />;
      case 'add-device':
        return <AddDeviceScreen />;
      case 'add-batch':
        return <AddBatchScreen />;
      case 'device-share':
        return <DeviceShareScreen />;
      case 'device-health':
        return <DeviceHealthScreen />;
      default:
        return <NavigationShell />;
    }
  };

  return <View style={styles.container}>{renderScreen()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
