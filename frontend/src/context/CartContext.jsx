import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [restaurantId, setRestaurantId] = useState(() => localStorage.getItem('cartRestaurantId') || null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    if (restaurantId) localStorage.setItem('cartRestaurantId', restaurantId);
  }, [cart, restaurantId]);

  const addToCart = (dish, restId) => {
    if (restaurantId && restaurantId !== restId && cart.length > 0) {
      if (!window.confirm("Adding this item will clear your current cart from another restaurant. Continue?")) {
        return;
      }
      setCart([]);
    }
    setRestaurantId(restId);

    setCart(prev => {
      const existing = prev.find(item => item._id === dish._id);
      if (existing) {
        return prev.map(item => item._id === dish._id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...dish, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item._id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const clearCart = () => {
    setCart([]);
    setRestaurantId(null);
    localStorage.removeItem('cart');
    localStorage.removeItem('cartRestaurantId');
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, restaurantId, addToCart, updateQty, clearCart, cartTotal, cartItemsCount }}>
      {children}
    </CartContext.Provider>
  );
};
