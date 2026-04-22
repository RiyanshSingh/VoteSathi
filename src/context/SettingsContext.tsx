import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { db } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from './AuthContext';

export interface NotificationSettings {
  push: boolean;
  email: boolean;
  news: boolean;
  reminders: boolean;
}

export interface PreferenceSettings {
  darkMode: boolean;
  highContrast: boolean;
  hapticFeedback: boolean;
  incognitoMode: boolean;
}

interface SettingsContextType {
  notifications: NotificationSettings;
  preferences: PreferenceSettings;
  loading: boolean;
  updateNotifications: (updates: Partial<NotificationSettings>) => void;
  updatePreferences: (updates: Partial<PreferenceSettings>) => void;
  saveSettings: () => Promise<boolean>;
}

const defaultNotifications: NotificationSettings = {
  push: true,
  email: false,
  news: true,
  reminders: true
};

const defaultPreferences: PreferenceSettings = {
  darkMode: false,
  highContrast: false,
  hapticFeedback: true,
  incognitoMode: false
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationSettings>(defaultNotifications);
  const [preferences, setPreferences] = useState<PreferenceSettings>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  // Load settings from Firestore when user changes
  useEffect(() => {
    if (!user) {
      // For anonymous users, we could use localStorage if needed
      const localSettings = localStorage.getItem('app_settings');
      if (localSettings) {
        const parsed = JSON.parse(localSettings);
        setNotifications(parsed.notifications || defaultNotifications);
        setPreferences(parsed.preferences || defaultPreferences);
      }
      setLoading(false);
      return;
    }

    // Subscribe to settings document
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.settings) {
          setNotifications(data.settings.notifications || defaultNotifications);
          setPreferences(data.settings.preferences || defaultPreferences);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const updateNotifications = (updates: Partial<NotificationSettings>) => {
    setNotifications(prev => ({ ...prev, ...updates }));
  };

  const updatePreferences = (updates: Partial<PreferenceSettings>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const saveSettings = async () => {
    try {
      const settingsToSave = { notifications, preferences };
      
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          settings: settingsToSave
        }, { merge: true });
      } else {
        localStorage.setItem('app_settings', JSON.stringify(settingsToSave));
      }
      
      return true;
    } catch (error) {
      console.error("Error saving settings:", error);
      return false;
    }
  };

  return (
    <SettingsContext.Provider value={{ 
      notifications, 
      preferences, 
      loading, 
      updateNotifications, 
      updatePreferences, 
      saveSettings 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
