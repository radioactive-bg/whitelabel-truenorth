import { create } from 'zustand';
import { User } from '../app/lib/types/user';

export const userStore = create((set) => ({
  user: {
    id: 'string',
    email: 'some.email@gmail.com',
    avatar: 'string',
    image: 'string',
    name: 'string',
    role: 'string',
    tier: 'string',
    is2FAEnable: true,
    accesToken: 'string',
  },
  setUser: (user: User) => set({ user }),
  updateUserProperty: (propertyKey: keyof User, propertyValue: any) =>
    set((state: any) => ({
      user: {
        ...state.user,
        [propertyKey]: propertyValue,
      },
    })),
  setAccesToken: (accesToken: string) => set({ accesToken: accesToken }),
}));
