/**
 * Authentication store using Zustand for state management
 */

import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, role: 'admin' | 'kasir') => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,

  login: async (username: string, password: string, role: 'admin' | 'kasir') => {
    try {
      // Simulate API call - replace with actual backend call
      if ((username === 'admin' && password === 'admin123') || 
          (username === 'kasir' && password === 'kasir123')) {
        const user: User = {
          id: '1',
          username,
          role,
          name: role === 'admin' ? 'Administrator' : 'Kasir',
          createdAt: new Date()
        };
        
        localStorage.setItem('auth_user', JSON.stringify(user));
        set({ user, isAuthenticated: true });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('auth_user');
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      set({ user, isAuthenticated: true });
    }
  }
}));
