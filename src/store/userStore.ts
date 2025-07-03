/**
 * User management store for admin functionality
 */

import { create } from 'zustand';
import { User } from '../types';

interface UserState {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  resetUsers: () => void;
}

const defaultUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    role: 'admin',
    name: 'Administrator',
    email: 'admin@apotek.com',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    username: 'kasir',
    role: 'kasir',
    name: 'Kasir 1',
    email: 'kasir@apotek.com',
    createdAt: new Date('2024-01-01')
  }
];

export const useUserStore = create<UserState>((set, get) => ({
  users: defaultUsers,

  addUser: (userData) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    set((state) => ({
      users: [...state.users, newUser]
    }));
  },

  updateUser: (id, updates) => {
    set((state) => ({
      users: state.users.map(user => 
        user.id === id ? { ...user, ...updates } : user
      )
    }));
  },

  deleteUser: (id) => {
    set((state) => ({
      users: state.users.filter(user => user.id !== id)
    }));
  },

  resetUsers: () => {
    set({ users: defaultUsers });
  }
}));
