'use client';
import { create } from 'zustand';
import axios from 'axios';
import { User } from '../app/lib/types/user';

export const userStore = create((set) => ({
  user: {
    id: 'null',
    //name: localStorage.getItem('username') || 'no value',
    name: 'null',
    email: 'some.email@gmail.com',
    is2FAEnable: true,
    acl: {
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
    },
  },
  setUser: (user: User | null) => {
    if (user) {
      localStorage.setItem('username', user.name);
    } else {
      localStorage.removeItem('username');
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
    userStore.setState({ user: response.data.data });

    localStorage.setItem('username', response.data.data.name);

    return response.data.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch user.');
  }
}
