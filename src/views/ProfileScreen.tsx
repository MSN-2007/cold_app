import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal, TextInput, Alert as RNAlert } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors, Border, FontSizes, Spacing } from '../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { timeAgo } from '../utils/date';

export const ProfileScreen = () => {
  const { currentUser, updateProfile, logout, logs, loadLogs, language, setLanguage, getString, navigateTo } = useApp();

  // Modals visibility states
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);

  // Edit Profile fields
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');

  const handleSaveProfile = () => {
    if (!name || !email) return;
    updateProfile({
      ...currentUser,
      name,
      email,
      phone,
    });
    setEditModalVisible(false);
  };

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang);
    setLangModalVisible(false);
  };

  const confirmLogout = () => {
    RNAlert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => logout() },
      ],
      { cancelable: true }
    );
  };

  const renderMenuItem = (icon: string, title: string, onPress: () => void, trailingText?: string) => {
    return (
      <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.menuIconContainer}>
          <MaterialIcons name={icon as any} size={20} color={Colors.light.textPrimary} />
        </View>
        <Text style={styles.menuTitle}>{title}</Text>
        {trailingText ? (
          <Text style={styles.menuTrailingText}>{trailingText}</Text>
        ) : (
          <MaterialIcons name="chevron-right" size={20} color={Colors.light.textHint} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{getString('tab_profile')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Info Card */}
        {currentUser ? (
          <View style={styles.profileHeaderCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarLetter}>
                {currentUser.name ? currentUser.name[0].toUpperCase() : '?'}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{currentUser.name}</Text>
              <Text style={styles.userEmail}>{currentUser.email}</Text>
              {currentUser.phone ? <Text style={styles.userPhone}>{currentUser.phone}</Text> : null}
            </View>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{currentUser.role}</Text>
            </View>
          </View>
        ) : null}

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {renderMenuItem('person-outline', getString('edit_profile'), () => {
            setName(currentUser?.name || '');
            setEmail(currentUser?.email || '');
            setPhone(currentUser?.phone || '');
            setEditModalVisible(true);
          })}
          {renderMenuItem('devices', getString('device_sharing'), () => navigateTo('device-share'))}
          {renderMenuItem('favorite-outline', getString('device_health'), () => navigateTo('device-health'))}
          {renderMenuItem('history', getString('activity_history'), async () => {
            await loadLogs();
            setHistoryModalVisible(true);
          })}
        </View>

        <View style={styles.menuSection}>
          {renderMenuItem('language', getString('language'), () => setLangModalVisible(true), language)}
          {renderMenuItem('notifications-none', getString('settings'), () => {})}
        </View>

        <View style={styles.menuSection}>
          {renderMenuItem('description', 'Privacy Policy', () => {})}
          {renderMenuItem('article', 'Terms of Service', () => {})}
          {renderMenuItem('info-outline', 'App Version', () => {}, '1.0.0')}
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={confirmLogout} activeOpacity={0.8}>
          <MaterialIcons name="logout" size={20} color={Colors.critical} />
          <Text style={styles.signOutText}>{getString('sign_out')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={Colors.light.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile} activeOpacity={0.8}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Language Selector Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={langModalVisible}
        onRequestClose={() => setLangModalVisible(false)}
      >
        <View style={styles.modalCenterBg}>
          <View style={styles.langDialogContainer}>
            <Text style={styles.langDialogTitle}>{getString('language')}</Text>
            
            {['English', 'Hindi', 'Telugu', 'Marathi'].map((langName) => {
              const nativeNames: Record<string, string> = {
                English: 'English',
                Hindi: 'हिन्दी',
                Telugu: 'తెలుగు',
                Marathi: 'मराठी',
              };
              const selected = language === langName;
              return (
                <TouchableOpacity 
                  key={langName} 
                  style={styles.langItem} 
                  onPress={() => handleLanguageSelect(langName)}
                  activeOpacity={0.8}
                >
                  <View>
                    <Text style={styles.langNativeName}>{nativeNames[langName]}</Text>
                    <Text style={styles.langEngName}>{langName}</Text>
                  </View>
                  {selected && (
                    <MaterialIcons name="check" size={24} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setLangModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Activity History Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={historyModalVisible}
        onRequestClose={() => setHistoryModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={[styles.modalContainer, { height: '80%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Activity History</Text>
              <TouchableOpacity onPress={() => setHistoryModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={Colors.light.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.historyList}>
              {logs.length === 0 ? (
                <Text style={styles.noHistoryText}>No activity yet</Text>
              ) : (
                logs.map(log => (
                  <View key={log.id} style={styles.historyItem}>
                    <View style={styles.historyIconCircle}>
                      <MaterialIcons name="history" size={16} color={Colors.light.textSecondary} />
                    </View>
                    <View style={styles.historyInfo}>
                      <Text style={styles.historyAction}>{log.action}</Text>
                      <Text style={styles.historyTime}>{timeAgo(log.timestamp)}</Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
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
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 80,
  },
  profileHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Border.cardRadius,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarLetter: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  userEmail: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  userPhone: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: Colors.primary,
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: Border.cardRadius,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingHorizontal: Spacing.sm,
  },
  menuIconContainer: {
    padding: 8,
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    marginRight: 12,
  },
  menuTitle: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.light.textPrimary,
  },
  menuTrailingText: {
    fontSize: FontSizes.md,
    color: Colors.light.textSecondary,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.critical,
    borderRadius: Border.buttonRadius,
    height: 48,
    gap: 8,
    marginTop: Spacing.sm,
  },
  signOutText: {
    color: Colors.critical,
    fontSize: FontSizes.md,
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
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Border.inputRadius,
    paddingHorizontal: Spacing.md,
    height: 48,
    fontSize: FontSizes.md,
    color: Colors.light.textPrimary,
    backgroundColor: '#F9FAFB',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: Border.buttonRadius,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  modalCenterBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  langDialogContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: Border.cardRadius,
    width: '100%',
    padding: Spacing.lg,
  },
  langDialogTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  langItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  langNativeName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  langEngName: {
    fontSize: FontSizes.xs,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  cancelButton: {
    marginTop: Spacing.md,
    alignItems: 'center',
    padding: 10,
  },
  cancelButtonText: {
    color: Colors.light.textSecondary,
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  historyList: {
    padding: Spacing.lg,
  },
  noHistoryText: {
    textAlign: 'center',
    color: Colors.light.textSecondary,
    fontSize: FontSizes.md,
    marginVertical: 40,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  historyIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  historyInfo: {
    flex: 1,
  },
  historyAction: {
    fontSize: FontSizes.sm,
    color: Colors.light.textPrimary,
    fontWeight: '500',
  },
  historyTime: {
    fontSize: FontSizes.xs,
    color: Colors.light.textHint,
    marginTop: 4,
  },
});
