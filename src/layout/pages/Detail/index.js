import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {useProductContext} from '../../../context/ProductContext';

/**
 * Detail component to display product details.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.route - Route object containing parameters.
 * @param {Object} props.route.params - Parameters passed to the route.
 * @param {string} props.route.params.description - Product description.
 * @param {number} props.route.params.price - Product price.
 * @param {string} props.route.params.image - Product image URL.
 * @param {string} props.route.params.name - Product name.
 * @param {string} props.route.params.id - Product ID.
 */
const Detail = ({
  route: {
    params: {description, price, image, name, id},
  },
}) => {
  const {cart, setCart} = useProductContext();

  const addToCart = () => {
    const newItem = {description, price, image, name, id: id};
    const existingItem = cart.find(cartItem => cartItem.name === name);

    const updateCartItem = cartItem => {
      if (cartItem.name === name) {
        return {...cartItem, quantity: cartItem.quantity + 1};
      }
      return cartItem;
    };

    if (existingItem) {
      setCart(cart.map(updateCartItem));
    } else {
      setCart([...cart, {...newItem, quantity: 1}]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{uri: image}} style={styles.image} />
      </View>

      <Text style={styles.name}>{name}</Text>

      <Text style={styles.description}>{description}</Text>

      <View style={styles.footer}>
        <Text style={styles.priceLabel}>Price:</Text>
        <Text style={styles.price}>{price} ₺</Text>
        <TouchableOpacity style={styles.button} onPress={addToCart}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    margin: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 24,
    color: 'gold',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: '#0066FF',
    fontWeight: '500',
    marginRight: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 'auto',
  },
  button: {
    backgroundColor: '#0066FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
