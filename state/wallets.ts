import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import axios from 'axios';

// Define the Wallet type
export interface Wallet {
  id: number;
  availableAmount: number;
  currency: string;
  // Add other relevant fields here
}

export interface WalletStore {
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  loadingWallets: boolean;
  error: string | null;
  fetchWallets: () => Promise<void>;
  addWallet: (wallet: Wallet) => void;
  removeWallet: (id: number) => void;
  updateWallet: (id: number, updatedWallet: Partial<Wallet>) => void;
  setSelectedWallet: (wallet: Wallet) => void;
}

// Define the Zustand store
export const useWalletStore = create<WalletStore>()(
  devtools(
    persist(
      (set) => ({
        wallets: [],
        selectedWallet: null,
        loadingWallets: true,
        error: null,
        fetchWallets: async () => {
          set({ loadingWallets: true, error: null });
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/wallets`,
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem(
                    'access_token',
                  )}`,
                },
              },
            );
            let wallets = response.data.data;
            // Rearrange the wallets array to ensure USD wallet is first
            wallets = wallets.sort((a: any, b: any) =>
              a.currency === 'USD' ? -1 : 1,
            );

            set({ wallets, loadingWallets: false });
            if (wallets.length > 0) {
              set({ selectedWallet: response.data.data[0] });
            }
          } catch (error) {
            set({
              error: 'Failed to fetch Wallets List.',
              loadingWallets: false,
            });
            console.error('Fetch Error:', error);
          }
        },
        addWallet: (wallet: Wallet) => {
          set((state) => ({ wallets: [...state.wallets, wallet] }));
        },
        removeWallet: (id: number) => {
          set((state) => ({
            wallets: state.wallets.filter((wallet) => wallet.id !== id),
            selectedWallet:
              state.selectedWallet && state.selectedWallet.id === id
                ? state.wallets.length > 1
                  ? state.wallets[0]
                  : null
                : state.selectedWallet,
          }));
        },
        updateWallet: (id: number, updatedWallet: Partial<Wallet>) => {
          set((state) => ({
            wallets: state.wallets.map((wallet) =>
              wallet.id === id ? { ...wallet, ...updatedWallet } : wallet,
            ),
          }));
        },
        setSelectedWallet: (wallet: Wallet) => {
          set({ selectedWallet: wallet });
        },
      }),
      {
        name: 'wallet-storage', // name of the item in the storage (optional)
      },
    ),
  ),
);
