import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  user: { email: string; name: string } | null;
  setTokens: (access: string, refresh?: string) => void;
  setUser: (user: { email: string; name: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      user: null,

      setTokens: (access, refresh) => set((state) => ({ 
        token: access, 
        refreshToken: refresh || state.refreshToken, 
        isAuthenticated: true 
      })),
      
      setUser: (user) => set({ user }),

      logout: () => set({ 
        token: null, 
        refreshToken: null, 
        isAuthenticated: false, 
        user: null 
      }),
    }),
    {
      name: 'obsidian-auth-core',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
