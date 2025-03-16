import {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ProductContext = createContext();
export const useProductContext = () => useContext(ProductContext);

export const ProductProvider = ({children}) => {
  const [cart, setCart] = useState([]);

  const loadCartFromStorage = async () => {
    try {
      const storedCart = await AsyncStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Failed to load the cart from storage', error);
    }
  };

  useEffect(() => {
    loadCartFromStorage();
  }, []);

  useEffect(() => {
    const saveCartToStorage = async () => {
      try {
        if (cart.length === 0) {
          await AsyncStorage.removeItem('cart');
        } else {
          await AsyncStorage.setItem('cart', JSON.stringify(cart));
        }
      } catch (error) {
        console.error('Failed to save the cart to storage', error);
      }
    };
    saveCartToStorage();
  }, [cart]);

  const value = {
    cart,
    setCart,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
