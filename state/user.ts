import { create } from 'zustand';
import axios from 'axios';
import { User } from '../app/lib/types/user';

export const userStore = create((set) => ({
  user: {
    id: 'string',
    name: 'string',
    email: 'some.email@gmail.com',
    is2FAEnable: true,
    acl: {},
  },
  setUser: (user: User | null) => set({ user }),
  updateUserProperty: (propertyKey: keyof User, propertyValue: any) =>
    set((state: any) => ({
      user: {
        ...state.user,
        [propertyKey]: propertyValue,
      },
    })),
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
    console.error('response.data.data: ', response.data.data);
    userStore.setState({ user: response.data.data });

    console.error('userStore: ', JSON.stringify(userStore.getState()));

    return response.data.data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to fetch user.');
  }
}
