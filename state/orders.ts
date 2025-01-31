import create from 'zustand';
import { getOrdersList, FetchInvoicesParams } from '@/app/lib/api/orders';

interface OrderListState {
  orders: any[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  filters: FetchInvoicesParams;

  // Actions
  fetchOrders: (page?: number, filters?: Partial<FetchInvoicesParams>) => Promise<void>;
  setFilters: (filters: Partial<FetchInvoicesParams>) => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;
}

export const orderListStore = create<OrderListState>((set, get) => ({
  // Initial State
  orders: [],
  loading: false,
  currentPage: 1,
  totalPages: 1,
  filters: {
    perPage: 10,
    page: 1,
    status: null,
    dateFrom: '',
    dateTo: '',
    orderId: '',
  },

  // Actions
  fetchOrders: async (page = 1, filters = {}) => {
    set({ loading: true });

    const state = get();
    const requestFilters: FetchInvoicesParams = {
      ...state.filters,
      ...filters,
      page,
    };

    try {
      const response = await getOrdersList(requestFilters);

      const urlObject = new URL(response.data.links.last);
      const lastPage = new URLSearchParams(urlObject.search).get('page');

      set({
        orders: response.data.data,
        totalPages: Number(lastPage) || 1,
        currentPage: page,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      set({ orders: [], loading: false });
    }
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },

  resetFilters: () => {
    set({
      filters: {
        perPage: 10,
        page: 1,
        status: null,
        dateFrom: '',
        dateTo: '',
        orderId: '',
      },
      currentPage: 1,
    });
  },
}));
