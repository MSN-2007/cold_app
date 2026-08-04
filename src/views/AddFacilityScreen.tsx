import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput,
  Animated,
  ActivityIndicator,
  Modal
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Colors, Border, FontSizes, Spacing } from '../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export const AddFacilityScreen = () => {
  const { addFacility, goBack, navigateTo } = useApp();

  // Wizard Steps: 1 = Pairing Method, 2 = Facility Details, 3 = Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [connectionMethod, setConnectionMethod] = useState<'QR Code' | 'Bluetooth' | 'WiFi' | 'Unique Code'>('QR Code');

  // Facility Form State
  const [name, setName] = useState('');
  const [facilityCode, setFacilityCode] = useState('');
  const [type, setType] = useState('Cold Warehouse');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(500);
  const [climateZone, setClimateZone] = useState('0°C to 4°C Cold Storage');
  const [managerName, setManagerName] = useState('');

  // Simulation states
  const [isScanning, setIsScanning] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [btScanning, setBtScanning] = useState(false);
  const [selectedBtDevice, setSelectedBtDevice] = useState<string | null>(null);
  const [wifiSsid, setWifiSsid] = useState('Facility_Mesh_5G');
  const [wifiPassword, setWifiPassword] = useState('');
  const [isWifiConnecting, setIsWifiConnecting] = useState(false);

  // Validation / Modal
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // QR laser animation
  const scanAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (connectionMethod === 'QR Code') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
          Animated.timing(scanAnim, { toValue: 0, duration: 1800, useNativeDriver: true })
        ])
      ).start();
    }
  }, [connectionMethod]);

  // Bluetooth scanning trigger
  useEffect(() => {
    if (connectionMethod === 'Bluetooth') {
      setBtScanning(true);
      const timer = setTimeout(() => {
        setBtScanning(false);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [connectionMethod]);

  const connectionMethods: Array<'QR Code' | 'Bluetooth' | 'WiFi' | 'Unique Code'> = [
    'QR Code',
    'Bluetooth',
    'WiFi',
    'Unique Code'
  ];

  const facilityTypes = [
    'Cold Warehouse',
    'Packhouse',
    'Distribution Center',
    'Refrigerated Transit'
  ];

  const climateZones = [
    '0°C to 4°C Cold Storage',
    '-20°C Deep Freeze',
    '10°C to 15°C Ambient Control'
  ];

  // Helper for QR sample scan
  const handleScanSampleQR = (facilityName: string, code: string) => {
    setIsScanning(true);
    setTimeout(() => {
      setName(facilityName);
      setFacilityCode(code);
      setIsScanning(false);
      setError('');
      setStep(2);
    }, 800);
  };

  // Helper for BLE pair
  const handlePairBtGateway = (gatewayName: string, code: string) => {
    setSelectedBtDevice(code);
    setName(gatewayName);
    setFacilityCode(code);
    setError('');
    setTimeout(() => {
      setStep(2);
    }, 600);
  };

  // Helper for WiFi connect
  const handleConnectWifi = () => {
    if (!wifiSsid) {
      setError('Please select a Facility WiFi Network');
      return;
    }
    setIsWifiConnecting(true);
    setTimeout(() => {
      setIsWifiConnecting(false);
      setName(wifiSsid.replace('_', ' ') + ' Facility');
      setFacilityCode('FAC-' + Math.floor(1000 + Math.random() * 9000) + '-W');
      setError('');
      setStep(2);
    }, 1200);
  };

  const handleProceedToConfig = () => {
    if (connectionMethod === 'Unique Code' && !facilityCode.trim()) {
      setError('Please enter a Unique Facility Code');
      return;
    }
    if (!name.trim()) {
      setName(facilityCode ? `Facility (${facilityCode})` : 'New Storage Facility');
    }
    setError('');
    setStep(2);
  };

  const handleFinalSubmit = async () => {
    const finalName = name.trim() || 'New Storage Facility';
    const finalCode = facilityCode.trim() || 'FAC-' + Math.floor(1000 + Math.random() * 9000) + '-X';

    await addFacility(
      finalName,
      connectionMethod,
      finalCode,
      {
        type,
        location: location.trim() || 'Primary Industrial Sector',
        totalCapacity: capacity,
        climateZone,
        managerName: managerName.trim() || 'Facility Operator'
      }
    );

    setShowSuccessModal(true);
  };

  const renderStepIndicator = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepRow}>
        <View style={[styles.stepBadge, step >= 1 && styles.stepBadgeActive]}>
          <Text style={[styles.stepBadgeText, step >= 1 && styles.stepBadgeTextActive]}>1</Text>
        </View>
        <Text style={[styles.stepLabel, step >= 1 && styles.stepLabelActive]}>Method</Text>

        <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />

        <View style={[styles.stepBadge, step >= 2 && styles.stepBadgeActive]}>
          <Text style={[styles.stepBadgeText, step >= 2 && styles.stepBadgeTextActive]}>2</Text>
        </View>
        <Text style={[styles.stepLabel, step >= 2 && styles.stepLabelActive]}>Details</Text>

        <View style={[styles.stepLine, step >= 3 && styles.stepLineActive]} />

        <View style={[styles.stepBadge, step >= 3 && styles.stepBadgeActive]}>
          <Text style={[styles.stepBadgeText, step >= 3 && styles.stepBadgeTextActive]}>3</Text>
        </View>
        <Text style={[styles.stepLabel, step >= 3 && styles.stepLabelActive]}>Review</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={step === 1 ? goBack : () => setStep((step - 1) as any)} style={styles.headerBack}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.light.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Add New Facility</Text>
        <View style={{ width: 32 }} />
      </View>

      {renderStepIndicator()}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {error ? (
          <View style={styles.errorBanner}>
            <MaterialIcons name="error-outline" size={20} color={Colors.critical} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* STEP 1: PAIRING METHOD */}
        {step === 1 && (
          <View style={styles.stepBox}>
            <Text style={styles.sectionTitle}>Facility Registration Method</Text>
            <Text style={styles.sectionSubtitle}>
              Pair your new warehouse, packhouse, or cold storage facility via QR code, Bluetooth BLE, WiFi gateway, or Unique Code.
            </Text>

            <View style={styles.methodTabRow}>
              {connectionMethods.map(m => {
                const selected = connectionMethod === m;
                let iconName: any = 'qr-code-scanner';
                if (m === 'Bluetooth') iconName = 'bluetooth-searching';
                if (m === 'WiFi') iconName = 'wifi';
                if (m === 'Unique Code') iconName = 'pin';

                return (
                  <TouchableOpacity
                    key={m}
                    style={[styles.methodTab, selected && styles.methodTabSelected]}
                    onPress={() => {
                      setConnectionMethod(m);
                      setError('');
                    }}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons 
                      name={iconName} 
                      size={20} 
                      color={selected ? '#FFFFFF' : Colors.light.textSecondary} 
                    />
                    <Text style={[styles.methodTabText, selected && styles.methodTabTextSelected]}>
                      {m}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* QR CODE METHOD */}
            {connectionMethod === 'QR Code' && (
              <View style={styles.qrSection}>
                <View style={styles.viewfinderFrame}>
                  <View style={styles.viewfinderWindow}>
                    <Animated.View 
                      style={[
                        styles.scannerLaser, 
                        {
                          transform: [
                            {
                              translateY: scanAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 140]
                              })
                            }
                          ]
                        }
                      ]} 
                    />
                    <MaterialIcons name="qr-code-2" size={80} color="rgba(255,255,255,0.25)" />
                  </View>

                  <View style={styles.scannerControls}>
                    <TouchableOpacity 
                      style={[styles.scannerBtn, flashOn && styles.scannerBtnActive]}
                      onPress={() => setFlashOn(!flashOn)}
                    >
                      <MaterialIcons name={flashOn ? "flash-on" : "flash-off"} size={20} color="#FFFFFF" />
                      <Text style={styles.scannerBtnText}>Flash</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.sampleScanTitle}>Discovered Facility QR Badges:</Text>
                <View style={styles.sampleScanContainer}>
                  <TouchableOpacity 
                    style={styles.sampleScanCard}
                    onPress={() => handleScanSampleQR('Greenfield Logistics Park', 'FAC-QR-901')}
                  >
                    <MaterialIcons name="apartment" size={24} color={Colors.primary} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.sampleScanName}>Greenfield Logistics Park</Text>
                      <Text style={styles.sampleScanId}>Code: FAC-QR-901 · Cold Warehouse</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={20} color={Colors.light.textHint} />
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.sampleScanCard}
                    onPress={() => handleScanSampleQR('Harvest Valley Processing Center', 'FAC-QR-884')}
                  >
                    <MaterialIcons name="apartment" size={24} color={Colors.primary} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.sampleScanName}>Harvest Valley Processing Center</Text>
                      <Text style={styles.sampleScanId}>Code: FAC-QR-884 · Packhouse</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={20} color={Colors.light.textHint} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* BLUETOOTH BLE METHOD */}
            {connectionMethod === 'Bluetooth' && (
              <View style={styles.btSection}>
                {btScanning ? (
                  <View style={styles.scanningBox}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.scanningText}>Searching for nearby BLE Facility Beacons...</Text>
                  </View>
                ) : (
                  <View style={styles.btListContainer}>
                    <View style={styles.btListHeader}>
                      <Text style={styles.sampleScanTitle}>Discovered Facility Gateways:</Text>
                      <TouchableOpacity onPress={() => setBtScanning(true)}>
                        <Text style={styles.rescanText}>Refresh</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity 
                      style={[styles.btCard, selectedBtDevice === 'FAC-BLE-801' && styles.btCardSelected]}
                      onPress={() => handlePairBtGateway('Delta Port Warehouse Beacon', 'FAC-BLE-801')}
                    >
                      <MaterialIcons name="bluetooth" size={24} color={Colors.primary} />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.sampleScanName}>Delta Port Warehouse Beacon</Text>
                        <Text style={styles.sampleScanId}>Signal: Strong (-48 dBm) · Code: FAC-BLE-801</Text>
                      </View>
                      <TouchableOpacity style={styles.pairChip}>
                        <Text style={styles.pairChipText}>Pair</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.btCard, selectedBtDevice === 'FAC-BLE-402' && styles.btCardSelected]}
                      onPress={() => handlePairBtGateway('AgriHub Transit Hub Beacon', 'FAC-BLE-402')}
                    >
                      <MaterialIcons name="bluetooth" size={24} color={Colors.primary} />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.sampleScanName}>AgriHub Transit Hub Beacon</Text>
                        <Text style={styles.sampleScanId}>Signal: Good (-65 dBm) · Code: FAC-BLE-402</Text>
                      </View>
                      <TouchableOpacity style={styles.pairChip}>
                        <Text style={styles.pairChipText}>Pair</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {/* WIFI GATEWAY METHOD */}
            {connectionMethod === 'WiFi' && (
              <View style={styles.wifiSection}>
                <Text style={styles.inputLabel}>Facility WiFi Network</Text>
                <View style={styles.wifiSelectBox}>
                  {['Facility_Mesh_5G', 'AgriWarehouse_Guest', 'ColdPack_Secure'].map(ssid => (
                    <TouchableOpacity 
                      key={ssid} 
                      style={[styles.wifiOption, wifiSsid === ssid && styles.wifiOptionSelected]}
                      onPress={() => setWifiSsid(ssid)}
                    >
                      <MaterialIcons name="wifi" size={20} color={wifiSsid === ssid ? Colors.primary : Colors.light.textSecondary} />
                      <Text style={[styles.wifiOptionText, wifiSsid === ssid && styles.wifiOptionTextSelected]}>{ssid}</Text>
                      {wifiSsid === ssid && <MaterialIcons name="check" size={18} color={Colors.primary} />}
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Facility Gateway WPA2 Password</Text>
                  <View style={styles.inputContainer}>
                    <MaterialIcons name="lock-outline" size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter facility password"
                      placeholderTextColor={Colors.light.textHint}
                      secureTextEntry
                      value={wifiPassword}
                      onChangeText={setWifiPassword}
                    />
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.wifiConnectBtn} 
                  onPress={handleConnectWifi}
                  disabled={isWifiConnecting}
                >
                  {isWifiConnecting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <MaterialIcons name="wifi-tethering" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.wifiConnectBtnText}>Verify Gateway & Connect</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* UNIQUE CODE METHOD */}
            {connectionMethod === 'Unique Code' && (
              <View style={styles.manualSection}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Unique Facility Access Code</Text>
                  <View style={styles.inputContainer}>
                    <MaterialIcons name="vpn-key" size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. FAC-7742-X"
                      placeholderTextColor={Colors.light.textHint}
                      value={facilityCode}
                      onChangeText={setFacilityCode}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Facility Name (Optional)</Text>
                  <View style={styles.inputContainer}>
                    <MaterialIcons name="business" size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Greenfield North Facility"
                      placeholderTextColor={Colors.light.textHint}
                      value={name}
                      onChangeText={setName}
                    />
                  </View>
                </View>
              </View>
            )}

            <TouchableOpacity 
              style={styles.nextButton} 
              onPress={handleProceedToConfig}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>Continue to Facility Setup</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: FACILITY DETAILS */}
        {step === 2 && (
          <View style={styles.stepBox}>
            <Text style={styles.sectionTitle}>Configure Facility Parameters</Text>
            <Text style={styles.sectionSubtitle}>
              Specify facility type, storage capacity, location address, and climate control zones.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Facility Name</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="business" size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Central Cold Warehouse"
                  placeholderTextColor={Colors.light.textHint}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Facility Type</Text>
              <View style={styles.typeRow}>
                {facilityTypes.map(t => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typeChip, type === t && styles.typeChipSelected]}
                    onPress={() => setType(t)}
                  >
                    <Text style={[styles.typeChipText, type === t && styles.typeChipTextSelected]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location / Street Address</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="place" size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Sector 4 Industrial Park, Bay A"
                  placeholderTextColor={Colors.light.textHint}
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Total Facility Capacity (Tons)</Text>
              <View style={styles.capacityChipRow}>
                {[250, 500, 1000, 2500].map(cap => (
                  <TouchableOpacity 
                    key={cap}
                    style={[styles.capacityChip, capacity === cap && styles.capacityChipSelected]}
                    onPress={() => setCapacity(cap)}
                  >
                    <Text style={[styles.capacityChipText, capacity === cap && styles.capacityChipTextSelected]}>
                      {cap} Tons
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Climate Control Zone</Text>
              <View style={styles.climateRow}>
                {climateZones.map(cz => (
                  <TouchableOpacity
                    key={cz}
                    style={[styles.climateCard, climateZone === cz && styles.climateCardSelected]}
                    onPress={() => setClimateZone(cz)}
                  >
                    <Text style={[styles.climateTitle, climateZone === cz && styles.climateTitleSelected]}>{cz}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Facility Manager Name</Text>
              <View style={styles.inputContainer}>
                <MaterialIcons name="person-outline" size={20} color={Colors.light.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Robert Vance"
                  placeholderTextColor={Colors.light.textHint}
                  value={managerName}
                  onChangeText={setManagerName}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.nextButton} 
              onPress={() => setStep(3)}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>Review Facility Summary</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 3: REVIEW & CONFIRM */}
        {step === 3 && (
          <View style={styles.stepBox}>
            <Text style={styles.sectionTitle}>Review Facility Information</Text>
            <Text style={styles.sectionSubtitle}>
              Please verify the facility details before saving it to your inventory network.
            </Text>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Facility Name:</Text>
                <Text style={styles.summaryValue}>{name || 'Storage Facility'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Facility Code:</Text>
                <Text style={styles.summaryValue}>{facilityCode || 'Auto-generated'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Pairing Method:</Text>
                <Text style={styles.summaryValue}>{connectionMethod}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Facility Type:</Text>
                <Text style={styles.summaryValue}>{type}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Location:</Text>
                <Text style={styles.summaryValue}>{location || 'Industrial Zone'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Capacity:</Text>
                <Text style={styles.summaryValue}>{capacity} Tons</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Climate Zone:</Text>
                <Text style={styles.summaryValue}>{climateZone}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Manager:</Text>
                <Text style={styles.summaryValue}>{managerName || 'Operator'}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleFinalSubmit} 
              activeOpacity={0.8}
            >
              <MaterialIcons name="check-circle" size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.submitButtonText}>Confirm & Register Facility</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* SUCCESS MODAL */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.successIconCircle}>
              <MaterialIcons name="apartment" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.modalTitle}>Facility Added Successfully!</Text>
            <Text style={styles.modalSubtitle}>
              {name || 'Storage Facility'} has been added to your inventory facility network.
            </Text>

            <TouchableOpacity 
              style={styles.modalPrimaryBtn}
              onPress={() => {
                setShowSuccessModal(false);
                navigateTo('main');
              }}
            >
              <Text style={styles.modalPrimaryBtnText}>Go to Inventory & Facilities</Text>
            </TouchableOpacity>
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
  stepContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderColor: Colors.light.border,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeActive: {
    backgroundColor: Colors.primary,
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.textSecondary,
  },
  stepBadgeTextActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginLeft: 6,
  },
  stepLabelActive: {
    color: Colors.primary,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  stepBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: Border.cardRadius,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDE8E8',
    borderRadius: Border.smallRadius,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: 8,
  },
  errorText: {
    color: Colors.critical,
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  methodTabRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.md,
  },
  methodTab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: Border.smallRadius,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#F9FAFB',
    gap: 4,
  },
  methodTabSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  methodTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  methodTabTextSelected: {
    color: '#FFFFFF',
  },
  qrSection: {
    marginVertical: Spacing.sm,
  },
  viewfinderFrame: {
    height: 200,
    backgroundColor: '#1E293B',
    borderRadius: Border.cardRadius,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  viewfinderWindow: {
    width: 140,
    height: 140,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  scannerLaser: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowRadius: 6,
    shadowOpacity: 0.8,
  },
  scannerControls: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  scannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  scannerBtnActive: {
    backgroundColor: Colors.primary,
  },
  scannerBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  sampleScanTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    marginBottom: Spacing.xs,
  },
  sampleScanContainer: {
    gap: 8,
  },
  sampleScanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: Border.smallRadius,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  sampleScanName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  sampleScanId: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  btSection: {
    marginVertical: Spacing.sm,
  },
  scanningBox: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanningText: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    marginTop: Spacing.md,
  },
  btListContainer: {
    gap: 8,
  },
  btListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rescanText: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  btCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: Border.smallRadius,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  btCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#F0F9FF',
  },
  pairChip: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  pairChipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  wifiSection: {
    marginVertical: Spacing.sm,
  },
  wifiSelectBox: {
    gap: 6,
    marginBottom: Spacing.md,
  },
  wifiOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: Border.smallRadius,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 10,
  },
  wifiOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#F0F9FF',
  },
  wifiOptionText: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: '500',
    color: Colors.light.textPrimary,
  },
  wifiOptionTextSelected: {
    fontWeight: '600',
    color: Colors.primary,
  },
  wifiConnectBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: Border.buttonRadius,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  wifiConnectBtnText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  manualSection: {
    marginVertical: Spacing.sm,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: Border.inputRadius,
    paddingHorizontal: Spacing.md,
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: FontSizes.md,
    color: Colors.light.textPrimary,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Border.smallRadius,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#F9FAFB',
  },
  typeChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  typeChipTextSelected: {
    color: '#FFFFFF',
  },
  capacityChipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  capacityChip: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: Border.smallRadius,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#F9FAFB',
  },
  capacityChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  capacityChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  capacityChipTextSelected: {
    color: '#FFFFFF',
  },
  climateRow: {
    gap: 6,
  },
  climateCard: {
    padding: Spacing.sm,
    borderRadius: Border.smallRadius,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#F9FAFB',
  },
  climateCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#F0F9FF',
  },
  climateTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  climateTitleSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: Border.buttonRadius,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    gap: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: Border.cardRadius,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Spacing.md,
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
  },
  summaryValue: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.light.textPrimary,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: Colors.healthy,
    borderRadius: Border.buttonRadius,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: Border.cardRadius,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.healthy,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  modalSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  modalPrimaryBtn: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: Border.buttonRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});
