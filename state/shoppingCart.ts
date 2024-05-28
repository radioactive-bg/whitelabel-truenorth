import create from 'zustand';

export interface Product {
  id: number;
  name: string;
  price: number;
  imageSrc: string;
  imageAlt: string;
  quantity: number;
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
  addToCart: (product) =>
    set((state) => {
      const existingProduct = state.cartItems.find(
        (item) => item.id === product.id,
      );
      let updatedCartItems;
      if (existingProduct) {
        updatedCartItems = state.cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item,
        );
      } else {
        updatedCartItems = [...state.cartItems, product];
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
