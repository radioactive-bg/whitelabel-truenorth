import { create } from 'zustand';
import axios from 'axios';

export interface Auth {
  access_token: string;
  access_token_expires: number;
  refresh_token: string;
  isLoggedIn: boolean;
}

export const authStore = create((set) => ({
  auth: {
    access_token: localStorage.getItem('access_token')
      ? localStorage.getItem('access_token')
      : '',
    access_token_expires: localStorage.getItem('access_token_expires')
      ? localStorage.getItem('access_token_expires')
      : 0,
    refresh_token: localStorage.getItem('refresh_token')
      ? localStorage.getItem('refresh_token')
      : '',
    isLoggedIn: localStorage.getItem('isLoggedIn')
      ? localStorage.getItem('isLoggedIn')
      : false,
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
