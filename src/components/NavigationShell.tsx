import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors, Border, FontSizes, Spacing } from '../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { HomeScreen } from '../views/HomeScreen';
import { DevicesScreen } from '../views/DevicesScreen';
import { LibraryScreen } from '../views/LibraryScreen';
import { AlertsScreen } from '../views/AlertsScreen';
import { ProfileScreen } from '../views/ProfileScreen';

export const NavigationShell = () => {
  const { language, getString, unreadAlertsCount } = useApp();
  const [activeTab, setActiveTab] = useState(0);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 0:
        return <HomeScreen />;
      case 1:
        return <DevicesScreen />;
      case 2:
        return <LibraryScreen />;
      case 3:
        return <AlertsScreen />;
      case 4:
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const getTabLabel = (index: number) => {
    switch (index) {
      case 0:
        return language === 'English' ? 'Home' : (language === 'Hindi' ? 'होम' : (language === 'Telugu' ? 'హోమ్' : 'होम'));
      case 1:
        return getString('tab_devices');
      case 2:
        return getString('tab_library');
      case 3:
        return getString('tab_alerts');
      case 4:
        return getString('tab_profile');
      default:
        return 'Home';
    }
  };

  const renderTabItem = (index: number, iconName: string) => {
    const selected = activeTab === index;
    const color = selected ? Colors.primary : Colors.light.textSecondary;
    const label = getTabLabel(index);

    return (
      <TouchableOpacity 
        style={styles.tabItem} 
        onPress={() => setActiveTab(index)}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons name={iconName as any} size={24} color={color} />
          {index === 3 && unreadAlertsCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadAlertsCount}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.tabLabel, { color }, selected && styles.tabLabelSelected]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderActiveTab()}
      </View>
      <View style={styles.tabBar}>
        {renderTabItem(0, 'home')}
        {renderTabItem(1, 'devices')}
        {renderTabItem(2, 'menu-book')}
        {renderTabItem(3, 'notifications')}
        {renderTabItem(4, 'person')}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'relative',
    height: 28,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: Colors.critical,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  tabLabelSelected: {
    fontWeight: '700',
  },
});
