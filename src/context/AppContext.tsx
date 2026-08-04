import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  initDb, 
  getStorages, 
  saveStorages, 
  getCrops, 
  saveCrops, 
  getAlerts, 
  saveAlerts, 
  getLogs, 
  saveLogs, 
  getShares, 
  saveShares, 
  getCurrentUser, 
  setCurrentUser,
  getUsers,
  saveUsers,
  getFacilities,
  saveFacilities,
  getNextBatchSequence,
  ColdStorage, 
  CropProfile, 
  Alert, 
  ActivityLog, 
  DeviceShare, 
  CropBatch,
  StorageChamber,
  Facility
} from '../data/db';
import { getString } from '../utils/l10n';

interface AppContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  getString: (key: string) => string;
  currentUser: any | null;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, phone: string, role: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updated: any) => Promise<void>;
  storages: ColdStorage[];
  loadStorages: () => Promise<void>;
  addStorage: (
    name: string, 
    connectionType: string, 
    chamberCount: number, 
    deviceId?: string,
    options?: {
      location?: string;
      capacityPerChamber?: number;
      targetTemperature?: number;
      targetHumidity?: number;
      ipAddress?: string;
      macAddress?: string;
    }
  ) => Promise<void>;
  facilities: Facility[];
  loadFacilities: () => Promise<void>;
  addFacility: (
    name: string,
    connectionMethod: string,
    facilityCode?: string,
    options?: {
      type?: string;
      location?: string;
      totalCapacity?: number;
      climateZone?: string;
      managerName?: string;
    }
  ) => Promise<void>;
  removeFacility: (id: string) => Promise<void>;
  addBatch: (deviceId: string, chamberId: string, crop: CropProfile, stage: string, quantity: number, unit: string) => Promise<boolean>;
  removeBatch: (deviceId: string, chamberId: string, batchId: string, reason: string) => Promise<boolean>;
  crops: CropProfile[];
  addCustomCrop: (crop: CropProfile) => Promise<void>;
  removeCrop: (id: string) => Promise<void>;
  alerts: Alert[];
  unreadAlertsCount: number;
  markAlertRead: (id: string) => Promise<void>;
  markAllAlertsRead: () => Promise<void>;
  logs: ActivityLog[];
  loadLogs: () => Promise<void>;
  shares: DeviceShare[];
  loadShares: (deviceId: string) => Promise<DeviceShare[]>;
  shareDevice: (share: DeviceShare) => Promise<void>;
  removeShare: (shareId: string) => Promise<void>;
  currentScreen: { name: string; params?: any };
  navigateTo: (name: string, params?: any) => void;
  goBack: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLangState] = useState<string>('English');
  const [currentUser, setUserState] = useState<any | null>(null);
  const [storages, setStorages] = useState<ColdStorage[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [crops, setCrops] = useState<CropProfile[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [shares, setShares] = useState<DeviceShare[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentScreen, setCurrentScreen] = useState<{ name: string; params?: any }>({ name: 'main' });
  const [screenHistory, setScreenHistory] = useState<{ name: string; params?: any }[]>([]);

  const navigateTo = (name: string, params?: any) => {
    setScreenHistory(prev => [...prev, currentScreen]);
    setCurrentScreen({ name, params });
  };

  const goBack = () => {
    if (screenHistory.length > 0) {
      const prev = screenHistory[screenHistory.length - 1];
      setScreenHistory(history => history.slice(0, -1));
      setCurrentScreen(prev);
    } else {
      setCurrentScreen({ name: 'main' });
    }
  };

  // Unread alerts count
  const unreadAlertsCount = alerts.filter(a => !a.isRead).length;

  useEffect(() => {
    const startup = async () => {
      await initDb();
      
      // Load current user (default to demo user for testing)
      const user = await getCurrentUser();
      const defaultUser = {
        id: 'user-demo-owner',
        name: 'Demo Owner',
        email: 'demo@coldapp.com',
        phone: '+1 (555) 019-2834',
        role: 'OWNER'
      };
      setUserState(user || defaultUser);

      // Load facilities
      const allFacilities = await getFacilities();
      setFacilities(allFacilities);
      
      // Load crops
      const allCrops = await getCrops();
      setCrops(allCrops);
      
      // Load storages
      const allStorages = await getStorages();
      setStorages(allStorages);
      
      // Load alerts
      const allAlerts = await getAlerts();
      setAlerts(allAlerts);

      // Load logs
      const allLogs = await getLogs();
      setLogs(allLogs);
      
      setLoading(false);
    };
    startup();
  }, []);

  const setLanguage = (lang: string) => {
    setLangState(lang);
  };

  const getTranslationString = (key: string) => {
    return getString(language, key);
  };

  // Auth Operations
  const login = async (email: string, password?: string): Promise<boolean> => {
    // Standard mock user verification or create user if not exists
    const users = await getUsers();
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      // Auto-create a mock user if none exists to make testing seamless
      user = {
        id: 'user-mock-' + Date.now(),
        name: email.split('@')[0],
        email: email,
        phone: '+1 (555) 019-2834',
        role: 'OWNER'
      };
      await saveUsers([...users, user]);
    }
    
    await setCurrentUser(user);
    setUserState(user);
    
    // Add log
    await addLog(`User signed in: ${user.name}`);
    return true;
  };

  const signup = async (name: string, email: string, phone: string, role: string, password?: string): Promise<boolean> => {
    const users = await getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return false;
    }

    const user = {
      id: 'user-mock-' + Date.now(),
      name,
      email,
      phone,
      role
    };
    
    await saveUsers([...users, user]);
    await setCurrentUser(user);
    setUserState(user);
    
    // Add log
    await addLog(`User signed up: ${name}`);
    return true;
  };

  const logout = async () => {
    await addLog(`User signed out`);
    await setCurrentUser(null);
    setUserState(null);
  };

  const updateProfile = async (updated: any) => {
    // Update local user list
    const users = await getUsers();
    const updatedUsers = users.map(u => u.id === updated.id ? updated : u);
    await saveUsers(updatedUsers);
    
    // Update session
    await setCurrentUser(updated);
    setUserState(updated);
    
    await addLog('Updated profile details.');
  };

  // Storages operations
  const loadStorages = async () => {
    const all = await getStorages();
    setStorages(all);
  };

  const addStorage = async (
    name: string, 
    connectionType: string, 
    chamberCount: number, 
    deviceId?: string,
    options?: {
      location?: string;
      capacityPerChamber?: number;
      targetTemperature?: number;
      targetHumidity?: number;
      ipAddress?: string;
      macAddress?: string;
    }
  ) => {
    const chamberCap = options?.capacityPerChamber || 100;
    const initialTemp = options?.targetTemperature !== undefined ? options.targetTemperature : 4.0;
    const initialHum = options?.targetHumidity !== undefined ? options.targetHumidity : 85.0;

    const newStorage: ColdStorage = {
      id: deviceId || 'dev-' + Math.random().toString(36).substr(2, 9),
      name,
      status: 'Healthy',
      healthScore: 100,
      firmwareVersion: 'v2.2.0',
      hardwareVersion: 'HW-V3-PRO',
      connectionType,
      location: options?.location || 'Main Storage Facility',
      ipAddress: options?.ipAddress || '192.168.1.150',
      macAddress: options?.macAddress || 'A4:C1:38:9B:41:00',
      targetTemperature: initialTemp,
      targetHumidity: initialHum,
      totalCapacity: chamberCap * chamberCount,
      chambers: Array.from({ length: chamberCount }, (_, i) => ({
        id: 'ch-' + Math.random().toString(36).substr(2, 9),
        name: `Chamber ${String.fromCharCode(65 + i)}`,
        temperature: initialTemp,
        humidity: initialHum,
        co2Level: 400,
        o2Level: 20.9,
        ethyleneLevel: 0.0,
        status: 'Healthy',
        usedCapacity: 0,
        batches: []
      }))
    };

    const updated = [...storages, newStorage];
    await saveStorages(updated);
    setStorages(updated);
    
    await addLog(`Added storage device: ${name} (${connectionType})`);
  };

  const addBatch = async (
    deviceId: string, 
    chamberId: string, 
    crop: CropProfile, 
    stage: string, 
    quantity: number, 
    unit: string
  ): Promise<boolean> => {
    try {
      const seq = await getNextBatchSequence();
      
      // Calculate crop prefix e.g. Tomato -> TOM
      const prefix = crop.name.substring(0, 3).toUpperCase();
      const batchId = `${prefix}-${seq.toString().padStart(3, '0')}`;
      
      const now = new Date();
      const expectedEnd = new Date(now.getTime() + crop.maxStorageDays * 24 * 60 * 60 * 1000);
      
      const newBatch: CropBatch = {
        id: 'batch-' + Math.random().toString(36).substr(2, 9),
        batchId,
        cropId: crop.id,
        cropName: crop.name,
        cropIcon: crop.icon,
        stage,
        quantity,
        unit,
        harvestDate: now.toISOString(),
        storageDate: now.toISOString(),
        expectedEndDate: expectedEnd.toISOString(),
        status: 'Active'
      };

      const allStorages = [...storages];
      const storageIdx = allStorages.findIndex(s => s.id === deviceId);
      if (storageIdx === -1) return false;
      
      const storage = allStorages[storageIdx];
      const chambers = [...storage.chambers];
      const chamberIdx = chambers.findIndex(c => c.id === chamberId);
      if (chamberIdx === -1) return false;
      
      const chamber = chambers[chamberIdx];
      const batches = [...chamber.batches, newBatch];
      
      chambers[chamberIdx] = {
        ...chamber,
        batches,
        usedCapacity: chamber.usedCapacity + Math.round(quantity)
      };

      allStorages[storageIdx] = {
        ...storage,
        chambers,
        status: recalculateStorageStatus(chambers)
      };

      await saveStorages(allStorages);
      setStorages(allStorages);
      
      await addLog(`Added batch ${batchId} (${crop.name}) in ${chamber.name}.`);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const removeBatch = async (deviceId: string, chamberId: string, batchId: string, reason: string): Promise<boolean> => {
    try {
      const allStorages = [...storages];
      const storageIdx = allStorages.findIndex(s => s.id === deviceId);
      if (storageIdx === -1) return false;
      
      const storage = allStorages[storageIdx];
      const chambers = [...storage.chambers];
      const chamberIdx = chambers.findIndex(c => c.id === chamberId);
      if (chamberIdx === -1) return false;
      
      const chamber = chambers[chamberIdx];
      const batches = [...chamber.batches];
      const batchIdx = batches.findIndex(b => b.id === batchId);
      if (batchIdx === -1) return false;
      
      const batch = batches[batchIdx];
      
      // Update the status of the batch instead of completely deleting it to retain record
      // Or filter it out of active view
      batches[batchIdx] = {
        ...batch,
        status: 'Removed'
      };
      
      chambers[chamberIdx] = {
        ...chamber,
        batches,
        usedCapacity: Math.max(0, chamber.usedCapacity - Math.round(batch.quantity))
      };

      allStorages[storageIdx] = {
        ...storage,
        chambers,
        status: recalculateStorageStatus(chambers)
      };

      await saveStorages(allStorages);
      setStorages(allStorages);
      
      await addLog(`Removed batch ${batch.batchId} (${batch.cropName}) from ${chamber.name}. Reason: ${reason}`);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Crop Profiles
  const addCustomCrop = async (crop: CropProfile) => {
    const updated = [...crops, crop];
    await saveCrops(updated);
    setCrops(updated);
    
    await addLog(`Added custom crop profile: ${crop.name}`);
  };

  const removeCrop = async (id: string) => {
    const crop = crops.find(c => c.id === id);
    const updated = crops.filter(c => c.id !== id);
    await saveCrops(updated);
    setCrops(updated);
    
    if (crop) {
      await addLog(`Removed crop profile: ${crop.name}`);
    }
  };

  // Alerts
  const markAlertRead = async (id: string) => {
    const updated = alerts.map(a => a.id === id ? { ...a, isRead: true } : a);
    await saveAlerts(updated);
    setAlerts(updated);
  };

  const markAllAlertsRead = async () => {
    const updated = alerts.map(a => ({ ...a, isRead: true }));
    await saveAlerts(updated);
    setAlerts(updated);
    await addLog('Marked all alerts as read');
  };

  // History logs loading
  const loadLogs = async () => {
    const all = await getLogs();
    setLogs(all);
  };

  // Sharing
  const loadShares = async (deviceId: string) => {
    const all = await getShares();
    const filtered = all.filter(s => s.deviceId === deviceId);
    setShares(filtered);
    return filtered;
  };

  const shareDevice = async (share: DeviceShare) => {
    const all = await getShares();
    const updated = [...all, share];
    await saveShares(updated);
    setShares(updated.filter(s => s.deviceId === share.deviceId));
    
    await addLog(`Shared device with user: ${share.userName} (${share.role})`);
  };

  const removeShare = async (shareId: string) => {
    const all = await getShares();
    const share = all.find(s => s.id === shareId);
    const updated = all.filter(s => s.id !== shareId);
    await saveShares(updated);
    
    if (share) {
      setShares(updated.filter(s => s.deviceId === share.deviceId));
      await addLog(`Removed sharing access for user: ${share.userName}`);
    }
  };

  // Helper function to add logs
  const addLog = async (action: string) => {
    const newLog: ActivityLog = {
      id: 'log-' + Math.random().toString(36).substr(2, 9),
      userId: currentUser?.id || 'system',
      userName: currentUser?.name || 'System',
      action,
      timestamp: new Date().toISOString()
    };
    
    const allLogs = await getLogs();
    const updated = [newLog, ...allLogs].slice(0, 500); // Max 500 logs
    await saveLogs(updated);
    setLogs(updated);
  };

  // Status helper
  const recalculateStorageStatus = (chambers: StorageChamber[]): string => {
    if (chambers.some(c => c.status === 'Critical')) return 'Critical';
    if (chambers.some(c => c.status === 'Warning')) return 'Warning';
    if (chambers.every(c => c.status === 'Offline')) return 'Offline';
    return 'Healthy';
  };

  // Facility operations
  const loadFacilities = async () => {
    const all = await getFacilities();
    setFacilities(all);
  };

  const addFacility = async (
    name: string,
    connectionMethod: string,
    facilityCode?: string,
    options?: {
      type?: string;
      location?: string;
      totalCapacity?: number;
      climateZone?: string;
      managerName?: string;
    }
  ) => {
    const code = facilityCode || 'FAC-' + Math.floor(1000 + Math.random() * 9000) + '-X';
    const newFacility: Facility = {
      id: 'fac-' + Math.random().toString(36).substr(2, 9),
      facilityCode: code,
      name,
      type: options?.type || 'Cold Warehouse',
      location: options?.location || 'Primary Industrial Zone',
      connectionMethod,
      status: 'Active',
      totalCapacity: options?.totalCapacity || 500,
      climateZone: options?.climateZone || '0°C to 4°C Cold Storage',
      managerName: options?.managerName || currentUser?.name || 'Facility Manager',
      createdAt: new Date().toISOString()
    };

    const updated = [...facilities, newFacility];
    await saveFacilities(updated);
    setFacilities(updated);
    await addLog(`Registered new storage facility: ${name} (${code}) via ${connectionMethod}`);
  };

  const removeFacility = async (id: string) => {
    const facility = facilities.find(f => f.id === id);
    const updated = facilities.filter(f => f.id !== id);
    await saveFacilities(updated);
    setFacilities(updated);

    if (facility) {
      await addLog(`Removed facility: ${facility.name} (${facility.facilityCode})`);
    }
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      getString: getTranslationString,
      currentUser,
      login,
      signup,
      logout,
      updateProfile,
      storages,
      loadStorages,
      addStorage,
      facilities,
      loadFacilities,
      addFacility,
      removeFacility,
      addBatch,
      removeBatch,
      crops,
      addCustomCrop,
      removeCrop,
      alerts,
      unreadAlertsCount,
      markAlertRead,
      markAllAlertsRead,
      logs,
      loadLogs,
      shares,
      loadShares,
      shareDevice,
      removeShare,
      currentScreen,
      navigateTo,
      goBack
    }}>
      {!loading && children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
