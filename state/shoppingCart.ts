import { create } from 'zustand';

export interface Product {
  id: number;
  group: string;
  name: string;
  groupName: string;
  regions: string[];
  currency: string;
  basePrice: string;
  salePrice: string;
  isEnabled: boolean;
  price: string;
  logo: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const getInitialCartItems = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const storedCartItems = localStorage.getItem('cartItems');
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  }
  return [];
};

const setCartItemsInLocalStorage = (cartItems: CartItem[]) => {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
};

export const useCartStore = create<CartState>((set) => ({
  cartItems: getInitialCartItems(),
  addToCart: (cartItem) =>
    set((state) => {
      const existingProduct = state.cartItems.find(
        (item) => item.id === cartItem.id,
      );
      let updatedCartItems;
      if (existingProduct) {
        updatedCartItems = state.cartItems.map((item) =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + cartItem.quantity }
            : item,
        );
      } else {
        updatedCartItems = [...state.cartItems, cartItem];
      }
      setCartItemsInLocalStorage(updatedCartItems);
      return {
        cartItems: updatedCartItems,
      };
    }),
  removeFromCart: (productId) =>
    set((state) => {
      const updatedCartItems = state.cartItems.filter(
        (item) => item.id !== productId,
      );
      setCartItemsInLocalStorage(updatedCartItems);
      return {
        cartItems: updatedCartItems,
      };
    }),
  updateQuantity: (productId, quantity) =>
    set((state) => {
      const updatedCartItems = state.cartItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      );
      setCartItemsInLocalStorage(updatedCartItems);
      return {
        cartItems: updatedCartItems,
      };
    }),
  clearCart: () => {
    setCartItemsInLocalStorage([]);
    return { cartItems: [] };
  },
}));
