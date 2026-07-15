import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal, TextInput } from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors, Border, FontSizes, Spacing } from '../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { DeviceShare } from '../data/db';

export const DeviceShareScreen = () => {
  const { currentScreen, shares, loadShares, shareDevice, removeShare, goBack } = useApp();
  const deviceId = currentScreen.params?.id || '';

  const [dialogVisible, setDialogVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('VIEWER');

  useEffect(() => {
    loadShares(deviceId);
  }, [deviceId]);

  const handleShare = async () => {
    if (!userName.trim()) return;

    const newShare: DeviceShare = {
      id: 'share-' + Date.now(),
      deviceId,
      userId: 'user-shared-' + Date.now(),
      userName: userName.trim(),
      role
    };

    await shareDevice(newShare);
    setUserName('');
    setRole('VIEWER');
    setDialogVisible(false);
  };

  const handleRemove = async (shareId: string) => {
    await removeShare(shareId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.headerBack}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Device Sharing</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setDialogVisible(true)}
          activeOpacity={0.8}
        >
          <MaterialIcons name="add" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {shares.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <MaterialIcons name="share" size={48} color={Colors.light.textHint} />
            </View>
            <Text style={styles.emptyTitle}>No shares yet</Text>
            <Text style={styles.emptySubtitle}>Share access to this device with managers, technicians, or viewers</Text>
            <TouchableOpacity 
              style={styles.emptyButton} 
              onPress={() => setDialogVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyButtonText}>Share Device</Text>
            </TouchableOpacity>
          </View>
        ) : (
          shares.map(item => (
            <View key={item.id} style={styles.shareItem}>
              <View style={styles.avatarCircle}>
                <MaterialIcons name="person" size={20} color={Colors.primary} />
              </View>
              <View style={styles.shareInfo}>
                <Text style={styles.shareName}>{item.userName}</Text>
                <Text style={styles.shareRole}>{item.role}</Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => handleRemove(item.id)}
              >
                <MaterialIcons name="delete-outline" size={22} color={Colors.critical} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Share Dialog Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={dialogVisible}
        onRequestClose={() => setDialogVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.dialogContainer}>
            <Text style={styles.dialogTitle}>Share Device</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>User Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter user name"
                placeholderTextColor={Colors.light.textHint}
                value={userName}
                onChangeText={setUserName}
              />
            </View>

            <Text style={styles.inputLabel}>Role</Text>
            <View style={styles.roleChipsRow}>
              {['MANAGER', 'VIEWER', 'TECHNICIAN'].map(r => {
                const selected = role === r;
                return (
                  <TouchableOpacity
                    key={r}
                    style={[styles.roleChip, selected && styles.roleChipSelected]}
                    onPress={() => setRole(r)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.roleChipText, selected && styles.roleChipTextSelected]}>
                      {r}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.dialogActions}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setDialogVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.shareButton, !userName.trim() && styles.shareButtonDisabled]} 
                onPress={handleShare}
                disabled={!userName.trim()}
                activeOpacity={0.8}
              >
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
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
  addButton: {
    padding: 4,
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
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    borderRadius: Border.buttonRadius,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: FontSizes.md,
  },
  shareItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Border.cardRadius,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  shareInfo: {
    flex: 1,
  },
  shareName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  shareRole: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    marginTop: 2,
    textTransform: 'lowercase',
  },
  deleteButton: {
    padding: 6,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  dialogContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: Border.cardRadius,
    width: '100%',
    padding: Spacing.lg,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  dialogTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
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
  roleChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.lg,
  },
  roleChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Border.smallRadius,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },
  roleChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  roleChipText: {
    fontSize: FontSizes.xs,
    color: Colors.light.textPrimary,
    fontWeight: '600',
  },
  roleChipTextSelected: {
    color: '#FFFFFF',
  },
  dialogActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    color: Colors.light.textSecondary,
    fontWeight: '600',
    fontSize: FontSizes.md,
  },
  shareButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: Border.buttonRadius,
  },
  shareButtonDisabled: {
    backgroundColor: Colors.offline,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: FontSizes.md,
  },
});
