import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

export const increaseItemQuantity = (id, setCart) => {
  setCart(prevItems =>
    prevItems.map(item =>
      item.id === id ? {...item, quantity: item.quantity + 1} : item,
    ),
  );
};

export const decreaseItemQuantity = (id, setCart) => {
  setCart(prevItems =>
    prevItems
      .map(item =>
        item.id === id ? {...item, quantity: item.quantity - 1} : item,
      )
      .filter(item => item.quantity > 0),
  );
};

export const calculateTotal = cart =>
  cart.reduce((total, item) => total + item.price * item.quantity, 0);

export const completePurchase = async setCart => {
  try {
    await AsyncStorage.removeItem('cart');
    Alert.alert('Success', 'Purchase completed successfully!');
    setCart([]);
  } catch (error) {
    Alert.alert('Error', 'Failed to complete the purchase. Please try again.');
  }
};
