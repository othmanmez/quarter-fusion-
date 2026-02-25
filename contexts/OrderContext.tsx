'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { getCartSubtotal } from '@/lib/pricing';

// Types pour les éléments du menu et la commande
export interface MenuItem {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  price: number;
  priceClickAndCollect?: number | null;
  priceDelivery?: number | null;
  category?: string;
  image: string;
  badge?: 'HOT' | 'NEW' | 'TOP';
  customizations?: any[];
}

export interface CartItem {
  cartItemId: string;
  item: MenuItem;
  quantity: number;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  paymentMethod: 'especes' | 'carte';
  notes: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryFee?: number;
}

export interface OrderState {
  cart: CartItem[];
  customerInfo: CustomerInfo;
  orderMode: 'click-and-collect' | 'delivery';
  currentStep: number;
  isLoading: boolean;
  orderNumber?: string;
}

// Actions pour le reducer
type OrderAction =
  | { type: 'ADD_TO_CART'; payload: MenuItem; quantity?: number }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { cartItemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'UPDATE_CUSTOMER_INFO'; payload: Partial<CustomerInfo> }
  | { type: 'SET_ORDER_MODE'; payload: 'click-and-collect' | 'delivery' }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ORDER_NUMBER'; payload: string }
  | { type: 'RESET_ORDER' };

// État initial
const initialState: OrderState = {
  cart: [],
  customerInfo: {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    paymentMethod: 'especes',
    notes: '',
    deliveryFee: 0,
  },
  orderMode: 'click-and-collect',
  currentStep: 1,
  isLoading: false,
};

// Génère une clé unique pour identifier une ligne du panier (même article + mêmes personnalisations)
function getCartItemKey(item: MenuItem): string {
  const customizationsKey = JSON.stringify(
    (item.customizations || []).map(c =>
      typeof c === 'string' ? c : `${c.name}:${(c.selectedOptions || []).sort().join(',')}`
    ).sort()
  );
  return `${item._id || item.id}__${customizationsKey}`;
}

// Reducer
function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const newKey = getCartItemKey(action.payload);
      const qty = action.quantity ?? 1;
      const existingItem = state.cart.find(cartItem => cartItem.cartItemId === newKey);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(cartItem =>
            cartItem.cartItemId === newKey
              ? { ...cartItem, quantity: cartItem.quantity + qty }
              : cartItem
          ),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { cartItemId: newKey, item: action.payload, quantity: qty }],
        };
      }
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(cartItem => cartItem.cartItemId !== action.payload),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(cartItem =>
          cartItem.cartItemId === action.payload.cartItemId
            ? { ...cartItem, quantity: action.payload.quantity }
            : cartItem
        ),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };

    case 'UPDATE_CUSTOMER_INFO':
      return {
        ...state,
        customerInfo: { ...state.customerInfo, ...action.payload },
      };

    case 'SET_ORDER_MODE':
      return {
        ...state,
        orderMode: action.payload,
      };

    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ORDER_NUMBER':
      return {
        ...state,
        orderNumber: action.payload,
      };

    case 'RESET_ORDER':
      return initialState;

    default:
      return state;
  }
}

// Contexte
interface OrderContextType {
  state: OrderState;
  dispatch: React.Dispatch<OrderAction>;
  // Méthodes utilitaires
  addToCart: (item: MenuItem, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Provider
export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Méthodes utilitaires
  const addToCart = (item: MenuItem, quantity: number = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: item, quantity });
  };

  const removeFromCart = (cartItemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: cartItemId });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { cartItemId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return getCartSubtotal(state.cart);
  };

  const getCartItemCount = () => {
    return state.cart.reduce((count, cartItem) => count + cartItem.quantity, 0);
  };

  const nextStep = () => {
    if (state.currentStep < 3) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
    }
  };

  const prevStep = () => {
    if (state.currentStep > 1) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 });
    }
  };

  const setStep = (step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const value: OrderContextType = {
    state,
    dispatch,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    nextStep,
    prevStep,
    setStep,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
} 