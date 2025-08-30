import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    showOnlineStatus: boolean;
    allowMessages: boolean;
  };
  display: {
    compactMode: boolean;
    autoPlayVideos: boolean;
    showThumbnails: boolean;
  };
}

interface UserStore {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  notifications: {
    email: true,
    push: true,
    marketing: false,
  },
  privacy: {
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowMessages: true,
  },
  display: {
    compactMode: false,
    autoPlayVideos: false,
    showThumbnails: true,
  },
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      
      updatePreferences: (updates: Partial<UserPreferences>) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...updates,
          },
        }));
      },
      
      resetPreferences: () => {
        set({ preferences: defaultPreferences });
      },
    }),
    {
      name: 'user-preferences',
      partialize: (state) => ({ preferences: state.preferences }),
    }
  )
);
