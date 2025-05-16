'use client';
import { create } from 'zustand';

export interface Auth {
  access_token: string;
  access_token_expires: number;
  refresh_token: string;
  isLoggedIn: boolean;
}

export const authStore = create((set) => ({
  auth: {
    // access_token: localStorage.getItem('access_token') || 'no value',
    access_token: '',
    access_token_expires: 0,
    refresh_token: '',
    isLoggedIn: false,
  },
  initializeAuth: () => {
    //console.log('calls initializeAuth');
    const auth = {
      access_token: localStorage.getItem('access_token') || '',
      access_token_expires: parseInt(
        localStorage.getItem('access_token_expires') || '0',
        10,
      ),
      refresh_token: localStorage.getItem('refresh_token') || '',
      isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    };
    set({ auth });
  },
  setAuth: (auth: Auth | null) => {
    if (auth !== null) {
      set({ auth });
    } else {
      set({
        auth: {
          access_token: '',
          access_token_expires: 0,
          refresh_token: '',
          isLoggedIn: false,
        },
      });
    }
  },

  updateAuthProperty: (propertyKey: keyof Auth, propertyValue: any) => {
    set((state: any) => {
      // Update state with new property value
      const newAuth = {
        ...state.auth,
        [propertyKey]: propertyValue,
      };

      return { auth: newAuth };
    });
  },
}));
