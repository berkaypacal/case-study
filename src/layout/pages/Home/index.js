import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';

import useLoadProductData from '../../../hooks/UseLoadProductData.hook';
import FilterModal from '../../components/Filter';
import {SortOptions} from '../../../utils/enum/SortOptionsEnum';
import {useNavigation} from '@react-navigation/native';
import {useProductContext} from '../../../context/ProductContext';

const Home = () => {
  const {data, isLoading, error} = useLoadProductData();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [displayedData, setDisplayedData] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    sortOption: SortOptions.OLD_TO_NEW.key,
    selectedBrands: [],
    selectedModels: [],
  });
  const navigation = useNavigation();
  const {cart, setCart} = useProductContext();

  const brands = [...new Set(data?.map(item => item.brand))];
  const models = [...new Set(data?.map(item => item.model))];

  useEffect(() => {
    if (data) {
      handleApplyFilters(selectedFilters);
    }
  }, [data, page, selectedFilters]);

  const handleApplyFilters = filters => {
    setSelectedFilters(filters);
    let filteredData = applyBrandFilter(data, filters.selectedBrands);
    filteredData = applyModelFilter(filteredData, filters.selectedModels);
    filteredData = applySortOption(filteredData, filters.sortOption);
    setDisplayedData(filteredData.slice(0, page * 12));
  };

  const applyBrandFilter = (data, selectedBrands) => {
    if (selectedBrands.length === 0) return data;
    return data.filter(item => selectedBrands.includes(item.brand));
  };

  const applyModelFilter = (data, selectedModels) => {
    if (selectedModels.length === 0) return data;
    return data.filter(item => selectedModels.includes(item.model));
  };

  const applySortOption = (data, sortOption) => {
    switch (sortOption) {
      case SortOptions.OLD_TO_NEW.key:
        return data.sort((a, b) => new Date(a.date) - new Date(b.date));
      case SortOptions.NEW_TO_OLD.key:
        return data.sort((a, b) => new Date(b.date) - new Date(a.date));
      case SortOptions.PRICE_HIGH_TO_LOW.key:
        return data.sort((a, b) => b.price - a.price);
      case SortOptions.PRICE_LOW_TO_HIGH.key:
        return data.sort((a, b) => a.price - b.price);
      default:
        return data;
    }
  };

  const addToCart = item => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(prevCart =>
        prevCart.map(cartItem =>
          cartItem.id === item.id
            ? {...cartItem, quantity: cartItem.quantity + 1}
            : cartItem,
        ),
      );
    } else {
      const newItem = {...item, id: item.id || new Date().getTime()};
      setCart([...cart, {...newItem, quantity: 1}]);
    }
  };

  const filteredData = displayedData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const loadMore = () => {
    if (data && displayedData.length < data.length) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.push('Detail', {
          description: item.description,
          price: item.price,
          image: item.image,
          name: item.name,
          id: item.id,
        })
      }
      style={styles.productCard}>
      <View style={styles.imageContainer}>
        <Image source={{uri: item.image}} style={styles.image} />
      </View>

      <Text style={styles.price}>{item.price} ₺</Text>
      <Text style={styles.name}>{item.name}</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => addToCart(item)}>
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FilterModal
        isVisible={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        brands={brands}
        models={models}
        initialFilters={selectedFilters}
      />

      <View style={styles.header}>
        <Text style={styles.title}>E-Market</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Filters:</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setIsFilterModalOpen(true)}>
          <Text style={styles.filterButtonText}>Select Filter</Text>
        </TouchableOpacity>
      </View>

      {isLoading && <Text>Loading...</Text>}
      {error && <Text>{error.message}</Text>}
      {!isLoading && filteredData && (
        <View style={styles.list}>
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={styles.row}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    marginBottom: 12,
    marginHorizontal: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',

    color: '#0066FF',
  },
  searchBar: {
    marginTop: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#F2F2F2',
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginHorizontal: 12,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  filterButton: {
    marginLeft: 8,
    backgroundColor: '#D9D9D9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterButtonText: {
    color: '#000',
    fontSize: 14,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    marginBottom: 8,
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
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0066FF',
  },
  name: {
    fontSize: 14,
    color: '#333',
    marginVertical: 4,
  },
  addButton: {
    backgroundColor: '#0066FF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  cartBadge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: 'red',
    borderRadius: 12,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  list: {
    margin: 12,
  },
});
