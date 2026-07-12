import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const initialState = {
  items: [],      // [{ id, name, price, image, quantity, restaurant_id, restaurant_name }]
  restaurantId: null,
  restaurantName: null,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item } = action.payload;
      // If adding from a different restaurant, clear cart first
      if (state.restaurantId && state.restaurantId !== item.restaurant_id) {
        return {
          items: [{ ...item, quantity: 1 }],
          restaurantId: item.restaurant_id,
          restaurantName: item.restaurant_name,
        };
      }
      const existing = state.items.find(i => i.id === item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...item, quantity: 1 }],
        restaurantId: item.restaurant_id,
        restaurantName: item.restaurant_name,
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload.id),
        restaurantId: state.items.length <= 1 ? null : state.restaurantId,
        restaurantName: state.items.length <= 1 ? null : state.restaurantName,
      };

    case 'UPDATE_QTY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        const newItems = state.items.filter(i => i.id !== id);
        return {
          ...state,
          items: newItems,
          restaurantId: newItems.length === 0 ? null : state.restaurantId,
          restaurantName: newItems.length === 0 ? null : state.restaurantName,
        };
      }
      return {
        ...state,
        items: state.items.map(i => i.id === id ? { ...i, quantity } : i),
      };
    }

    case 'CLEAR_CART':
      return initialState;

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    try {
      const saved = localStorage.getItem('restora_cart');
      return saved ? JSON.parse(saved) : initialState;
    } catch {
      return initialState;
    }
  });

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('restora_cart', JSON.stringify(state));
  }, [state]);

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: { item } });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  const updateQty = (id, quantity) => dispatch({ type: 'UPDATE_QTY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const cartCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items: state.items,
      restaurantId: state.restaurantId,
      restaurantName: state.restaurantName,
      cartCount,
      cartTotal,
      addItem,
      removeItem,
      updateQty,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
