'use client';
import { create } from 'zustand';
import axios from 'axios';
import { User } from '../app/lib/types/user';

export interface Auth {
  access_token: string;
  access_token_expires: number;
  refresh_token: string;
  isLoggedIn: boolean;
}

export const authStore = create((set) => ({
  auth: {
    access_token: localStorage.getItem('access_token') || 'no value',
    access_token_expires: 0,
    refresh_token: '',
    isLoggedIn: false,
  },
  initializeAuth: () => {
    // This function should only be called from the client side
    const auth = {
      access_token: localStorage.getItem('access_token') || '',
      access_token_expires: parseInt(
        localStorage.getItem('access_token_expires') || '0',
      ),
      refresh_token: localStorage.getItem('refresh_token') || '',
      isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    };
    set({ auth });
  },
  setAuth: (auth: Auth | null) => set({ auth }),
  updateAuthProperty: (propertyKey: keyof Auth, propertyValue: any) =>
    set((state: any) => ({
      auth: {
        ...state.auth,
        [propertyKey]: propertyValue,
      },
    })),
}));
