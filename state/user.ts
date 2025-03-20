'use client';
import { create } from 'zustand';
import axios from 'axios';
import { User } from '../app/lib/types/user';

// Define a default ACL object
const defaultAcl = {
  orders: {
    list: {
      crud: { view: false, store: false },
      special: { downloadInvoice: false, storePreOrder: false },
    },
  },
  wallet: {
    list: {
      crud: { view: false },
      special: { redeemCards: false, redeemInvoiceCode: false },
    },
    transactions: { crud: { view: false } },
  },
  profile: {
    list: {
      crud: { view: false },
      special: { login: false, logout: false },
    },
  },
  company: {
    list: { crud: { view: false } },
    priceList: { crud: { view: false } },
  },
  filters: {
    list: { crud: { view: false } },
  },
  payoutTransaction: {
    list: { crud: { view: false, store: false } },
  },
  payoutMethod: {
    list: { crud: { view: false } },
  },
};

// Safely retrieve stored values from localStorage (only if window is defined)
const storedAcl =
  typeof window !== 'undefined' && localStorage.getItem('acl')
    ? JSON.parse(localStorage.getItem('acl') as string)
    : defaultAcl;
const storedUsername =
  typeof window !== 'undefined' && localStorage.getItem('username')
    ? localStorage.getItem('username')
    : 'null';

export const userStore = create((set) => ({
  user: {
    id: 'null',
    //name: localStorage.getItem('username') || 'no value',
    name: storedUsername,
    email: 'some.email@gmail.com',
    is2FAEnable: true,
    acl: storedAcl,
  },
  setUser: (user: User | null) => {
    if (user) {
      localStorage.setItem('username', user.name);
      localStorage.setItem('acl', JSON.stringify(user.acl));
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('acl');
    }
    set({ user });
  },
  updateUserProperty: (propertyKey: keyof User, propertyValue: any) => {
    set((state: any) => {
      // Update the user state
      const newUser = {
        ...state.user,
        [propertyKey]: propertyValue,
      };

      if (propertyKey === 'name') {
        localStorage.setItem('username', propertyValue);
      }
      if (propertyKey === 'acl') {
        localStorage.setItem('acl', JSON.stringify(propertyValue));
      }

      return { user: newUser };
    });
  },
}));

//works
export async function getUserProfile(access_token: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/profile`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    console.log('response.data.data: ', response.data.data);
    userStore.setState({ user: response.data.data });

    localStorage.setItem('username', response.data.data.name);
    localStorage.setItem('acl', JSON.stringify(response.data.data.acl));

    console.log('userStore: ', JSON.stringify(userStore.getState()));

    return response.data.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch user.');
  }
}
