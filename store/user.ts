import { create } from 'zustand';

export type User = {
  id?: string;
  email?: string;
  avatar?: string;
  image?: string;
  name?: string;
  role?: string;
  tier?: string;
  is2FAEnable?: boolean;
};

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
