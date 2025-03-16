import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import Home from '../layout/pages/home';

import useLoadProductData from '../hooks/UseLoadProductData.hook';
import {ProductContext} from '../context/ProductContext';

jest.mock('../hooks/UseLoadProductData.hook');
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({push: jest.fn()}),
}));

const mockData = [
  {
    id: 1,
    name: 'Product 1',
    brand: 'Brand A',
    model: 'Model X',
    price: 100,
    date: '2021-01-01',
    image: 'https://example.com/product1.jpg',
  },
];

const mockContextValue = {
  cart: [],
  setCart: jest.fn(),
};

describe('Home', () => {
  beforeEach(() => {
    useLoadProductData.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    });
  });

  it('renders correctly', () => {
    const {getByText} = render(
      <ProductContext.Provider value={mockContextValue}>
        <Home />
      </ProductContext.Provider>,
    );

    expect(getByText('E-Market')).toBeTruthy();
    expect(getByText('Filters:')).toBeTruthy();
  });

  it('filters products based on search query', () => {
    const {getByPlaceholderText, getByText} = render(
      <ProductContext.Provider value={mockContextValue}>
        <Home />
      </ProductContext.Provider>,
    );

    const searchInput = getByPlaceholderText('Search');
    fireEvent.changeText(searchInput, 'Product 1');

    expect(getByText('Product 1')).toBeTruthy();
  });

  it('adds product to cart', () => {
    const {getByText} = render(
      <ProductContext.Provider value={mockContextValue}>
        <Home />
      </ProductContext.Provider>,
    );

    const addButton = getByText('Add to Cart');
    fireEvent.press(addButton);

    expect(mockContextValue.setCart).toHaveBeenCalled();
  });
});
