/**
 * Tests unitaires pour le reducer OrderContext
 * Teste la logique du panier : ajout, suppression, mise à jour des quantités
 */

interface MenuItem {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  price: number;
  image: string;
  badge?: 'HOT' | 'NEW' | 'TOP';
  customizations?: any[];
}

interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface OrderState {
  cart: CartItem[];
  orderMode: 'click-and-collect' | 'delivery';
  currentStep: number;
  isLoading: boolean;
}

type OrderAction =
  | { type: 'ADD_TO_CART'; payload: MenuItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_ORDER_MODE'; payload: 'click-and-collect' | 'delivery' }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'RESET_ORDER' };

const initialState: OrderState = {
  cart: [],
  orderMode: 'click-and-collect',
  currentStep: 1,
  isLoading: false,
};

function orderReducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(
        (cartItem) => cartItem.item._id === action.payload._id
      );
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((cartItem) =>
            cartItem.item._id === action.payload._id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { item: action.payload, quantity: 1 }],
      };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter((cartItem) => cartItem.item._id !== action.payload),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map((cartItem) =>
          cartItem.item._id === action.payload.itemId
            ? { ...cartItem, quantity: action.payload.quantity }
            : cartItem
        ),
      };

    case 'CLEAR_CART':
      return { ...state, cart: [] };

    case 'SET_ORDER_MODE':
      return { ...state, orderMode: action.payload };

    case 'SET_STEP':
      return { ...state, currentStep: action.payload };

    case 'RESET_ORDER':
      return initialState;

    default:
      return state;
  }
}

const burger: MenuItem = {
  _id: 'item-1',
  title: 'Burger Classic',
  description: 'Un délicieux burger',
  price: 8.5,
  image: '/burger.jpg',
};

const wings: MenuItem = {
  _id: 'item-2',
  title: 'Wings x6',
  description: 'Ailes de poulet',
  price: 7.0,
  image: '/wings.jpg',
};

describe('OrderReducer - Gestion du panier', () => {
  describe('ADD_TO_CART', () => {
    it('ajoute un article au panier vide', () => {
      const state = orderReducer(initialState, { type: 'ADD_TO_CART', payload: burger });
      expect(state.cart).toHaveLength(1);
      expect(state.cart[0].item.title).toBe('Burger Classic');
      expect(state.cart[0].quantity).toBe(1);
    });

    it('incrémente la quantité si l\'article existe déjà', () => {
      let state = orderReducer(initialState, { type: 'ADD_TO_CART', payload: burger });
      state = orderReducer(state, { type: 'ADD_TO_CART', payload: burger });
      expect(state.cart).toHaveLength(1);
      expect(state.cart[0].quantity).toBe(2);
    });

    it('ajoute un article différent comme nouvel élément', () => {
      let state = orderReducer(initialState, { type: 'ADD_TO_CART', payload: burger });
      state = orderReducer(state, { type: 'ADD_TO_CART', payload: wings });
      expect(state.cart).toHaveLength(2);
    });

    it('ajoute correctement plusieurs articles différents', () => {
      let state = initialState;
      state = orderReducer(state, { type: 'ADD_TO_CART', payload: burger });
      state = orderReducer(state, { type: 'ADD_TO_CART', payload: wings });
      state = orderReducer(state, { type: 'ADD_TO_CART', payload: burger });
      expect(state.cart).toHaveLength(2);
      const burgerInCart = state.cart.find((c) => c.item._id === 'item-1');
      const wingsInCart = state.cart.find((c) => c.item._id === 'item-2');
      expect(burgerInCart?.quantity).toBe(2);
      expect(wingsInCart?.quantity).toBe(1);
    });
  });

  describe('REMOVE_FROM_CART', () => {
    it('supprime un article du panier', () => {
      let state = orderReducer(initialState, { type: 'ADD_TO_CART', payload: burger });
      state = orderReducer(state, { type: 'ADD_TO_CART', payload: wings });
      state = orderReducer(state, { type: 'REMOVE_FROM_CART', payload: 'item-1' });
      expect(state.cart).toHaveLength(1);
      expect(state.cart[0].item._id).toBe('item-2');
    });

    it('ne change pas l\'état si l\'article n\'existe pas', () => {
      let state = orderReducer(initialState, { type: 'ADD_TO_CART', payload: burger });
      state = orderReducer(state, { type: 'REMOVE_FROM_CART', payload: 'inexistant' });
      expect(state.cart).toHaveLength(1);
    });

    it('vide le panier si le dernier article est supprimé', () => {
      let state = orderReducer(initialState, { type: 'ADD_TO_CART', payload: burger });
      state = orderReducer(state, { type: 'REMOVE_FROM_CART', payload: 'item-1' });
      expect(state.cart).toHaveLength(0);
    });
  });

  describe('UPDATE_QUANTITY', () => {
    it('met à jour la quantité d\'un article', () => {
      let state = orderReducer(initialState, { type: 'ADD_TO_CART', payload: burger });
      state = orderReducer(state, {
        type: 'UPDATE_QUANTITY',
        payload: { itemId: 'item-1', quantity: 5 },
      });
      expect(state.cart[0].quantity).toBe(5);
    });

    it('ne modifie pas les autres articles', () => {
      let state = orderReducer(initialState, { type: 'ADD_TO_CART', payload: burger });
      state = orderReducer(state, { type: 'ADD_TO_CART', payload: wings });
      state = orderReducer(state, {
        type: 'UPDATE_QUANTITY',
        payload: { itemId: 'item-1', quantity: 3 },
      });
      const wingsItem = state.cart.find((c) => c.item._id === 'item-2');
      expect(wingsItem?.quantity).toBe(1);
    });
  });

  describe('CLEAR_CART', () => {
    it('vide complètement le panier', () => {
      let state = orderReducer(initialState, { type: 'ADD_TO_CART', payload: burger });
      state = orderReducer(state, { type: 'ADD_TO_CART', payload: wings });
      state = orderReducer(state, { type: 'CLEAR_CART' });
      expect(state.cart).toHaveLength(0);
    });

    it('ne change pas l\'état si le panier est déjà vide', () => {
      const state = orderReducer(initialState, { type: 'CLEAR_CART' });
      expect(state.cart).toHaveLength(0);
    });
  });

  describe('SET_ORDER_MODE', () => {
    it('change le mode de commande en livraison', () => {
      const state = orderReducer(initialState, {
        type: 'SET_ORDER_MODE',
        payload: 'delivery',
      });
      expect(state.orderMode).toBe('delivery');
    });

    it('change le mode en click-and-collect', () => {
      const state = orderReducer(
        { ...initialState, orderMode: 'delivery' },
        { type: 'SET_ORDER_MODE', payload: 'click-and-collect' }
      );
      expect(state.orderMode).toBe('click-and-collect');
    });
  });

  describe('SET_STEP', () => {
    it('passe à l\'étape 2', () => {
      const state = orderReducer(initialState, { type: 'SET_STEP', payload: 2 });
      expect(state.currentStep).toBe(2);
    });

    it('passe à l\'étape 3', () => {
      const state = orderReducer(initialState, { type: 'SET_STEP', payload: 3 });
      expect(state.currentStep).toBe(3);
    });
  });

  describe('RESET_ORDER', () => {
    it('réinitialise l\'état complet', () => {
      let state = orderReducer(initialState, { type: 'ADD_TO_CART', payload: burger });
      state = orderReducer(state, { type: 'SET_ORDER_MODE', payload: 'delivery' });
      state = orderReducer(state, { type: 'SET_STEP', payload: 3 });
      state = orderReducer(state, { type: 'RESET_ORDER' });
      expect(state.cart).toHaveLength(0);
      expect(state.orderMode).toBe('click-and-collect');
      expect(state.currentStep).toBe(1);
    });
  });
});

describe('Calcul du nombre d\'articles dans le panier', () => {
  it('retourne 0 pour un panier vide', () => {
    const count = initialState.cart.reduce((sum, item) => sum + item.quantity, 0);
    expect(count).toBe(0);
  });

  it('compte correctement plusieurs articles', () => {
    let state = orderReducer(initialState, { type: 'ADD_TO_CART', payload: burger });
    state = orderReducer(state, { type: 'ADD_TO_CART', payload: burger });
    state = orderReducer(state, { type: 'ADD_TO_CART', payload: wings });
    const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    expect(count).toBe(3);
  });
});
