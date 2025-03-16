import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import Cart from '../layout/pages/Cart';
import {ProductContext} from '../context/ProductContext';
import {
  calculateTotal,
  completePurchase,
  decreaseItemQuantity,
  increaseItemQuantity,
} from '../utils/helpers/cart.helper';

jest.mock('../utils/helpers/cart.helper');
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({push: jest.fn()}),
}));

const mockCart = [
  {
    id: 1,
    name: 'Product 1',
    price: 100,
    quantity: 1,
  },
  {
    id: 2,
    name: 'Product 2',
    price: 200,
    quantity: 2,
  },
];

const mockContextValue = {
  cart: mockCart,
  setCart: jest.fn(),
};

describe('Cart', () => {
  beforeEach(() => {
    calculateTotal.mockReturnValue(500);
    completePurchase.mockImplementation(() => mockContextValue.setCart([]));
    decreaseItemQuantity.mockImplementation((id, setCart) => {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === id ? {...item, quantity: item.quantity - 1} : item,
        ),
      );
    });
    increaseItemQuantity.mockImplementation((id, setCart) => {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === id ? {...item, quantity: item.quantity + 1} : item,
        ),
      );
    });
  });

  it('renders correctly', () => {
    const {getByText} = render(
      <ProductContext.Provider value={mockContextValue}>
        <Cart />
      </ProductContext.Provider>,
    );

    expect(getByText('Product 1')).toBeTruthy();
    expect(getByText('Product 2')).toBeTruthy();
    expect(getByText('Total:')).toBeTruthy();
    expect(getByText('500₺')).toBeTruthy();
  });

  it('increases item quantity', () => {
    const {getAllByText} = render(
      <ProductContext.Provider value={mockContextValue}>
        <Cart />
      </ProductContext.Provider>,
    );

    const increaseButtons = getAllByText('+');
    fireEvent.press(increaseButtons[0]);

    expect(mockContextValue.setCart).toHaveBeenCalled();
  });

  it('decreases item quantity', () => {
    const {getAllByText} = render(
      <ProductContext.Provider value={mockContextValue}>
        <Cart />
      </ProductContext.Provider>,
    );

    const decreaseButtons = getAllByText('-');
    fireEvent.press(decreaseButtons[0]);

    expect(mockContextValue.setCart).toHaveBeenCalled();
  });

  it('completes purchase', () => {
    const {getByText} = render(
      <ProductContext.Provider value={mockContextValue}>
        <Cart />
      </ProductContext.Provider>,
    );

    const completeButton = getByText('Complete');
    fireEvent.press(completeButton);

    expect(mockContextValue.setCart).toHaveBeenCalledWith([]);
  });
});
