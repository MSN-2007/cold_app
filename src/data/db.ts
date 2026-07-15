import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys
const USERS_KEY = 'coldsmart_users';
const STORAGES_KEY = 'coldsmart_storages';
const CROPS_KEY = 'coldsmart_crops';
const ALERTS_KEY = 'coldsmart_alerts';
const LOGS_KEY = 'coldsmart_logs';
const SHARES_KEY = 'coldsmart_shares';
const CURRENT_USER_KEY = 'coldsmart_current_user';
const BATCH_SEQUENCE_KEY = 'coldsmart_batch_seq';
const SEED_VERSION_KEY = 'coldsmart_seed_version';

const SEED_VERSION = 2;

export interface CropStage {
  id: string;
  name: string;
  minTemp: number;
  maxTemp: number;
  minHumidity: number;
  maxHumidity: number;
  maxStorageDays: number;
}

export interface CropProfile {
  id: string;
  name: string;
  icon: string;
  minTemp: number;
  maxTemp: number;
  minHumidity: number;
  maxHumidity: number;
  minCo2: number;
  maxCo2: number;
  minO2: number;
  maxO2: number;
  maxEthylene: number;
  maxStorageDays: number;
  notes?: string;
  stages: CropStage[];
  isCustom?: boolean;
}

export interface CropBatch {
  id: string;
  batchId: string;
  cropId: string;
  cropName: string;
  cropIcon: string;
  stage: string;
  quantity: number;
  unit: string;
  harvestDate: string;
  storageDate: string;
  expectedEndDate: string;
  status: string;
}

export interface StorageChamber {
  id: string;
  name: string;
  temperature: number;
  humidity: number;
  co2Level: number;
  o2Level: number;
  ethyleneLevel: number;
  status: string;
  usedCapacity: number;
  batches: CropBatch[];
}

export interface ColdStorage {
  id: string;
  name: string;
  status: string;
  healthScore: number;
  firmwareVersion: string;
  hardwareVersion: string;
  connectionType: string;
  totalCapacity: number;
  chambers: StorageChamber[];
}

export interface Alert {
  id: string;
  deviceId: string;
  chamberId: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  recommendedAction: string;
  timestamp: string;
  isRead: boolean;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  oldValue?: string;
  newValue?: string;
}

export interface DeviceShare {
  id: string;
  deviceId: string;
  userId: string;
  userName: string;
  role: string;
}

export const defaultCrops: CropProfile[] = [
  {
    id: 'crop-tomato',
    name: 'Tomato',
    icon: '🍅',
    minTemp: 12,
    maxTemp: 15,
    minHumidity: 85,
    maxHumidity: 90,
    minCo2: 300,
    maxCo2: 800,
    minO2: 19,
    maxO2: 21,
    maxEthylene: 1.0,
    maxStorageDays: 21,
    notes: 'Sensitive to ethylene. Store away from ethylene-producing crops.',
    stages: [
      { id: 'tomato-green', name: 'Green', minTemp: 13, maxTemp: 15, minHumidity: 85, maxHumidity: 90, maxStorageDays: 21 },
      { id: 'tomato-semi-ripe', name: 'Semi Ripe', minTemp: 12, maxTemp: 14, minHumidity: 85, maxHumidity: 90, maxStorageDays: 14 },
      { id: 'tomato-ripe', name: 'Ripe', minTemp: 10, maxTemp: 12, minHumidity: 85, maxHumidity: 90, maxStorageDays: 7 },
    ],
  },
  {
    id: 'crop-potato',
    name: 'Potato',
    icon: '🥔',
    minTemp: 4,
    maxTemp: 8,
    minHumidity: 85,
    maxHumidity: 90,
    minCo2: 300,
    maxCo2: 1000,
    minO2: 18,
    maxO2: 21,
    maxEthylene: 2.0,
    maxStorageDays: 180,
    notes: 'Keep in dark. Light causes greening and solanine production.',
    stages: [
      { id: 'potato-green', name: 'Green', minTemp: 7, maxTemp: 8, minHumidity: 85, maxHumidity: 90, maxStorageDays: 180 },
      { id: 'potato-semi-ripe', name: 'Semi Ripe', minTemp: 5, maxTemp: 7, minHumidity: 85, maxHumidity: 90, maxStorageDays: 150 },
      { id: 'potato-ripe', name: 'Ripe', minTemp: 4, maxTemp: 6, minHumidity: 85, maxHumidity: 90, maxStorageDays: 120 },
    ],
  },
  {
    id: 'crop-banana',
    name: 'Banana',
    icon: '🍌',
    minTemp: 13,
    maxTemp: 14,
    minHumidity: 85,
    maxHumidity: 90,
    minCo2: 300,
    maxCo2: 800,
    minO2: 19,
    maxO2: 21,
    maxEthylene: 3.0,
    maxStorageDays: 14,
    notes: 'High ethylene producer. Do not store with ethylene-sensitive crops.',
    stages: [
      { id: 'banana-green', name: 'Green', minTemp: 13, maxTemp: 14, minHumidity: 85, maxHumidity: 90, maxStorageDays: 14 },
      { id: 'banana-semi-ripe', name: 'Semi Ripe', minTemp: 13, maxTemp: 14, minHumidity: 85, maxHumidity: 90, maxStorageDays: 7 },
      { id: 'banana-ripe', name: 'Ripe', minTemp: 12, maxTemp: 13, minHumidity: 85, maxHumidity: 90, maxStorageDays: 4 },
    ],
  },
  {
    id: 'crop-apple',
    name: 'Apple',
    icon: '🍎',
    minTemp: 1,
    maxTemp: 3,
    minHumidity: 90,
    maxHumidity: 95,
    minCo2: 300,
    maxCo2: 800,
    minO2: 18,
    maxO2: 21,
    maxEthylene: 2.0,
    maxStorageDays: 240,
    notes: 'High ethylene producer. Store separately from other fruits and vegetables.',
    stages: [
      { id: 'apple-green', name: 'Green', minTemp: 2, maxTemp: 3, minHumidity: 90, maxHumidity: 95, maxStorageDays: 240 },
      { id: 'apple-semi-ripe', name: 'Semi Ripe', minTemp: 1, maxTemp: 3, minHumidity: 90, maxHumidity: 95, maxStorageDays: 180 },
      { id: 'apple-ripe', name: 'Ripe', minTemp: 1, maxTemp: 2, minHumidity: 90, maxHumidity: 95, maxStorageDays: 90 },
    ],
  },
  {
    id: 'crop-mango',
    name: 'Mango',
    icon: '🥭',
    minTemp: 12,
    maxTemp: 14,
    minHumidity: 85,
    maxHumidity: 90,
    minCo2: 300,
    maxCo2: 700,
    minO2: 19,
    maxO2: 21,
    maxEthylene: 2.0,
    maxStorageDays: 21,
    notes: 'Chilling injury below 10°C. Ripen at room temperature before storage.',
    stages: [
      { id: 'mango-green', name: 'Green', minTemp: 13, maxTemp: 14, minHumidity: 85, maxHumidity: 90, maxStorageDays: 21 },
      { id: 'mango-semi-ripe', name: 'Semi Ripe', minTemp: 12, maxTemp: 14, minHumidity: 85, maxHumidity: 90, maxStorageDays: 14 },
      { id: 'mango-ripe', name: 'Ripe', minTemp: 10, maxTemp: 12, minHumidity: 85, maxHumidity: 90, maxStorageDays: 7 },
    ],
  },
  {
    id: 'crop-onion',
    name: 'Onion',
    icon: '🧅',
    minTemp: 0,
    maxTemp: 2,
    minHumidity: 65,
    maxHumidity: 70,
    minCo2: 300,
    maxCo2: 1000,
    minO2: 18,
    maxO2: 21,
    maxEthylene: 1.0,
    maxStorageDays: 240,
    notes: 'Low humidity required. Good ventilation essential to prevent sprouting.',
    stages: [
      { id: 'onion-green', name: 'Green', minTemp: 0, maxTemp: 2, minHumidity: 65, maxHumidity: 70, maxStorageDays: 240 },
      { id: 'onion-ripe', name: 'Ripe', minTemp: 0, maxTemp: 2, minHumidity: 65, maxHumidity: 70, maxStorageDays: 180 },
    ],
  },
  {
    id: 'crop-leafy-veg',
    name: 'Leafy Vegetables',
    icon: '🥬',
    minTemp: 0,
    maxTemp: 2,
    minHumidity: 90,
    maxHumidity: 95,
    minCo2: 300,
    maxCo2: 600,
    minO2: 19,
    maxO2: 21,
    maxEthylene: 0.1,
    maxStorageDays: 14,
    notes: 'Extremely ethylene sensitive. Wilting occurs quickly if humidity drops.',
    stages: [
      { id: 'leafy-fresh', name: 'Fresh', minTemp: 0, maxTemp: 2, minHumidity: 90, maxHumidity: 95, maxStorageDays: 14 },
    ],
  },
  {
    id: 'crop-carrot',
    name: 'Carrot',
    icon: '🥕',
    minTemp: 0,
    maxTemp: 2,
    minHumidity: 90,
    maxHumidity: 95,
    minCo2: 300,
    maxCo2: 800,
    minO2: 19,
    maxO2: 21,
    maxEthylene: 1.0,
    maxStorageDays: 180,
    notes: 'High humidity essential. Will become limp and lose quality if dry.',
    stages: [
      { id: 'carrot-fresh', name: 'Fresh', minTemp: 0, maxTemp: 2, minHumidity: 90, maxHumidity: 95, maxStorageDays: 180 },
    ],
  },
  {
    id: 'crop-garlic',
    name: 'Garlic',
    icon: '🧄',
    minTemp: 0,
    maxTemp: 2,
    minHumidity: 60,
    maxHumidity: 65,
    minCo2: 300,
    maxCo2: 1000,
    minO2: 18,
    maxO2: 21,
    maxEthylene: 1.0,
    maxStorageDays: 240,
    notes: 'Very low humidity. High humidity causes mold and sprouting.',
    stages: [
      { id: 'garlic-cured', name: 'Cured', minTemp: 0, maxTemp: 2, minHumidity: 60, maxHumidity: 65, maxStorageDays: 240 },
    ],
  },
  {
    id: 'crop-ginger',
    name: 'Ginger',
    icon: '🫚',
    minTemp: 12,
    maxTemp: 14,
    minHumidity: 85,
    maxHumidity: 90,
    minCo2: 300,
    maxCo2: 800,
    minO2: 19,
    maxO2: 21,
    maxEthylene: 1.0,
    maxStorageDays: 90,
    notes: 'Susceptible to chilling injury below 10°C. Store in well-ventilated area.',
    stages: [
      { id: 'ginger-fresh', name: 'Fresh', minTemp: 12, maxTemp: 14, minHumidity: 85, maxHumidity: 90, maxStorageDays: 90 },
    ],
  },
];

export const initDb = async () => {
  try {
    const currentVersionStr = await AsyncStorage.getItem(SEED_VERSION_KEY);
    const currentVersion = currentVersionStr ? parseInt(currentVersionStr, 10) : 0;

    if (currentVersion < SEED_VERSION) {
      await AsyncStorage.removeItem(STORAGES_KEY);
      await AsyncStorage.removeItem(ALERTS_KEY);
      await AsyncStorage.removeItem(CROPS_KEY);
      await AsyncStorage.removeItem(LOGS_KEY);
      await AsyncStorage.setItem(SEED_VERSION_KEY, SEED_VERSION.toString());
    }

    const storagesStr = await AsyncStorage.getItem(STORAGES_KEY);
    if (!storagesStr) {
      await seedMockData();
    }
  } catch (error) {
    console.error('Failed to initialize database', error);
  }
};

const seedMockData = async () => {
  // 1. Seed crops
  await AsyncStorage.setItem(CROPS_KEY, JSON.stringify(defaultCrops));

  const now = new Date();
  
  const subDays = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
  const addDays = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

  // 2. Define mock devices, chambers, and batches
  const device1: ColdStorage = {
    id: 'dev-greenfield',
    name: 'Greenfield Multi-Temp Storage',
    status: 'Healthy',
    healthScore: 98,
    firmwareVersion: 'v2.1.4',
    hardwareVersion: 'HW-V2-EXP',
    connectionType: 'WiFi',
    totalCapacity: 500,
    chambers: [
      {
        id: 'greenfield-ch-1',
        name: 'Chamber A - Fruits (Apple/Tomato)',
        temperature: 2.5,
        humidity: 92.0,
        co2Level: 600,
        o2Level: 19.5,
        ethyleneLevel: 0.15,
        status: 'Healthy',
        usedCapacity: 230,
        batches: [
          {
            id: 'batch-app-091',
            batchId: 'APP-091',
            cropId: 'crop-apple',
            cropName: 'Apple',
            cropIcon: '🍎',
            stage: 'Ripe',
            quantity: 150.0,
            unit: 'tons',
            harvestDate: subDays(10),
            storageDate: subDays(8),
            expectedEndDate: addDays(90),
            status: 'Active',
          },
          {
            id: 'batch-tom-042',
            batchId: 'TOM-042',
            cropId: 'crop-tomato',
            cropName: 'Tomato',
            cropIcon: '🍅',
            stage: 'Semi Ripe',
            quantity: 80.0,
            unit: 'tons',
            harvestDate: subDays(8),
            storageDate: subDays(6),
            expectedEndDate: addDays(14),
            status: 'Active',
          },
        ],
      },
      {
        id: 'greenfield-ch-2',
        name: 'Chamber B - Roots (Ginger)',
        temperature: 12.5,
        humidity: 88.0,
        co2Level: 500,
        o2Level: 20.8,
        ethyleneLevel: 0.05,
        status: 'Healthy',
        usedCapacity: 50,
        batches: [
          {
            id: 'batch-gin-112',
            batchId: 'GIN-112',
            cropId: 'crop-ginger',
            cropName: 'Ginger',
            cropIcon: '🫚',
            stage: 'Fresh',
            quantity: 50.0,
            unit: 'tons',
            harvestDate: subDays(15),
            storageDate: subDays(12),
            expectedEndDate: addDays(78),
            status: 'Active',
          },
        ],
      },
    ],
  };

  // Wait! In ginger batch, the icon in the database was '𫚚' or '𫆵' or ginger emoji. Let's make sure it is 𫚚 or 𫆵. The original string in database was 𫚚 (actually it is '𫚚' which is ginger).
  // Let's use 𫚚 ginger emoji or the standard one from defaultCrops. Let's just use '𫚚'.
  // Wait, let's copy the ginger emoji character from defaultCrops: '𫚚' is '𫚚' or '𫆵'. Let's write '𫚚' as '𫚚'.

  const device2: ColdStorage = {
    id: 'dev-harvestvalley',
    name: 'Harvest Valley Cold Hub',
    status: 'Warning',
    healthScore: 78,
    firmwareVersion: 'v2.0.8',
    hardwareVersion: 'HW-V1-STD',
    connectionType: '4G Cellular',
    totalCapacity: 300,
    chambers: [
      {
        id: 'harvest-ch-1',
        name: 'Chamber 1 - Root Veg (Potato)',
        temperature: 10.5,
        humidity: 88.0,
        co2Level: 1200,
        o2Level: 19.5,
        ethyleneLevel: 1.5,
        status: 'Warning',
        usedCapacity: 120,
        batches: [
          {
            id: 'batch-pot-502',
            batchId: 'POT-502',
            cropId: 'crop-potato',
            cropName: 'Potato',
            cropIcon: '🥔',
            stage: 'Semi Ripe',
            quantity: 120.0,
            unit: 'tons',
            harvestDate: subDays(45),
            storageDate: subDays(40),
            expectedEndDate: addDays(135),
            status: 'Active',
          },
        ],
      },
      {
        id: 'harvest-ch-2',
        name: 'Chamber 2 - Subtropical (Mango)',
        temperature: 13.5,
        humidity: 90.0,
        co2Level: 800,
        o2Level: 20.9,
        ethyleneLevel: 0.1,
        status: 'Healthy',
        usedCapacity: 40,
        batches: [
          {
            id: 'batch-mng-201',
            batchId: 'MNG-201',
            cropId: 'crop-mango',
            cropName: 'Mango',
            cropIcon: '🥭',
            stage: 'Semi Ripe',
            quantity: 40.0,
            unit: 'tons',
            harvestDate: subDays(5),
            storageDate: subDays(4),
            expectedEndDate: addDays(16),
            status: 'Active',
          },
        ],
      },
    ],
  };

  const device3: ColdStorage = {
    id: 'dev-deltaport',
    name: 'Delta Port Transit Coldhouse',
    status: 'Critical',
    healthScore: 42,
    firmwareVersion: 'v2.3.1',
    hardwareVersion: 'HW-V3-PRO',
    connectionType: 'Ethernet',
    totalCapacity: 800,
    chambers: [
      {
        id: 'delta-ch-1',
        name: 'Chamber Alpha - Leafy Greens',
        temperature: 8.2,
        humidity: 65.0,
        co2Level: 1500,
        o2Level: 18.0,
        ethyleneLevel: 0.8,
        status: 'Critical',
        usedCapacity: 30,
        batches: [
          {
            id: 'batch-leaf-88',
            batchId: 'LEAF-88',
            cropId: 'crop-leafy-veg',
            cropName: 'Leafy Vegetables',
            cropIcon: '🥬',
            stage: 'Fresh',
            quantity: 30.0,
            unit: 'tons',
            harvestDate: subDays(3),
            storageDate: subDays(2),
            expectedEndDate: addDays(12),
            status: 'Active',
          },
        ],
      },
      {
        id: 'delta-ch-2',
        name: 'Chamber Beta - Onions (Wet Air)',
        temperature: 4.5,
        humidity: 95.0,
        co2Level: 400,
        o2Level: 20.8,
        ethyleneLevel: 0.2,
        status: 'Critical',
        usedCapacity: 70,
        batches: [
          {
            id: 'batch-oni-99',
            batchId: 'ONI-99',
            cropId: 'crop-onion',
            cropName: 'Onion',
            cropIcon: '🧅',
            stage: 'Ripe',
            quantity: 70.0,
            unit: 'tons',
            harvestDate: subDays(12),
            storageDate: subDays(10),
            expectedEndDate: addDays(170),
            status: 'Active',
          },
        ],
      },
    ],
  };

  await AsyncStorage.setItem(STORAGES_KEY, JSON.stringify([device1, device2, device3]));

  // 3. Seed Alerts matching the conditions
  const alerts: Alert[] = [
    {
      id: 'alert-pot-temp-high',
      deviceId: 'dev-harvestvalley',
      chamberId: 'harvest-ch-1',
      type: 'Temperature Warning',
      severity: 'Warning',
      title: 'High Temp in Potato Chamber',
      message: 'Chamber 1 temperature is 10.5°C (target: 4.0°C - 8.0°C). High temperatures can trigger premature sprouting.',
      recommendedAction: 'Check ventilation settings and adjust cooling output.',
      timestamp: subDays(0.08), // ~2 hours ago
      isRead: false,
    },
    {
      id: 'alert-greens-temp-critical',
      deviceId: 'dev-deltaport',
      chamberId: 'delta-ch-1',
      type: 'Temperature Alert',
      severity: 'Critical',
      title: 'Critical Temp in Leafy Greens Chamber',
      message: 'Chamber Alpha temperature has risen to 8.2°C (target: 0.0°C - 2.0°C), creating an immediate risk of leaf decay.',
      recommendedAction: 'Inspect the refrigeration compressor and verify chamber seals.',
      timestamp: subDays(0.16), // ~4 hours ago
      isRead: false,
    },
    {
      id: 'alert-greens-humidity-critical',
      deviceId: 'dev-deltaport',
      chamberId: 'delta-ch-1',
      type: 'Humidity Alert',
      severity: 'Critical',
      title: 'Low Humidity in Leafy Greens Chamber',
      message: 'Chamber Alpha humidity is 65.0% (target: 90.0% - 95.0%), causing rapid crop dehydration and wilting.',
      recommendedAction: 'Verify active humidifier operation and water supply lines.',
      timestamp: subDays(0.125), // ~3 hours ago
      isRead: false,
    },
    {
      id: 'alert-onion-humidity-critical',
      deviceId: 'dev-deltaport',
      chamberId: 'delta-ch-2',
      type: 'Humidity Alert',
      severity: 'Critical',
      title: 'High Humidity in Onion Chamber',
      message: 'Chamber Beta humidity is at 95.0% (target: 65.0% - 70.0%). Excess moisture causes mold growth and root development.',
      recommendedAction: 'Verify dehumidifier function and increase dry air circulation.',
      timestamp: subDays(0.03), // ~45 mins ago
      isRead: false,
    },
  ];

  await AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));

  // 4. Seed activity log
  const log: ActivityLog = {
    id: 'log-seed-1',
    userId: 'system',
    userName: 'System',
    action: 'Seeded initial real-world cold storage conditions.',
    timestamp: subDays(0.2), // ~5 hours ago
  };

  await AsyncStorage.setItem(LOGS_KEY, JSON.stringify([log]));
};

// Database GET/SET helper functions
export const getStorages = async (): Promise<ColdStorage[]> => {
  const data = await AsyncStorage.getItem(STORAGES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveStorages = async (storages: ColdStorage[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGES_KEY, JSON.stringify(storages));
};

export const getCrops = async (): Promise<CropProfile[]> => {
  const data = await AsyncStorage.getItem(CROPS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveCrops = async (crops: CropProfile[]): Promise<void> => {
  await AsyncStorage.setItem(CROPS_KEY, JSON.stringify(crops));
};

export const getAlerts = async (): Promise<Alert[]> => {
  const data = await AsyncStorage.getItem(ALERTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveAlerts = async (alerts: Alert[]): Promise<void> => {
  await AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
};

export const getLogs = async (): Promise<ActivityLog[]> => {
  const data = await AsyncStorage.getItem(LOGS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveLogs = async (logs: ActivityLog[]): Promise<void> => {
  await AsyncStorage.setItem(LOGS_KEY, JSON.stringify(logs));
};

export const getShares = async (): Promise<DeviceShare[]> => {
  const data = await AsyncStorage.getItem(SHARES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveShares = async (shares: DeviceShare[]): Promise<void> => {
  await AsyncStorage.setItem(SHARES_KEY, JSON.stringify(shares));
};

export const getCurrentUser = async (): Promise<any | null> => {
  const data = await AsyncStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = async (user: any | null): Promise<void> => {
  if (user === null) {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  } else {
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
};

export const getNextBatchSequence = async (): Promise<number> => {
  const seqStr = await AsyncStorage.getItem(BATCH_SEQUENCE_KEY);
  const seq = seqStr ? parseInt(seqStr, 10) : 0;
  await AsyncStorage.setItem(BATCH_SEQUENCE_KEY, (seq + 1).toString());
  return seq + 1;
};

export const getUsers = async (): Promise<any[]> => {
  const data = await AsyncStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveUsers = async (users: any[]): Promise<void> => {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};
