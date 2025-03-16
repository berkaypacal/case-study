import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {RadioButton, Checkbox} from 'react-native-paper';
import {SortOptions} from '../../../utils/enum/SortOptionsEnum';

/**
 * FilterModal component for sorting and filtering brands/models.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.isVisible - Determines if the modal is visible.
 * @param {function} props.onClose - Function to call when the modal is closed.
 * @param {function} props.onApply - Function to call when the filters are applied.
 * @param {Array<string>} props.brands - List of available brands.
 * @param {Array<string>} props.models - List of available models.
 * @param {Object} props.initialFilters - Initial filter values.
 * @param {string} props.initialFilters.sortOption - Initial sort option.
 * @param {Array<string>} props.initialFilters.selectedBrands - Initially selected brands.
 * @param {Array<string>} props.initialFilters.selectedModels - Initially selected models.
 */
const FilterModal = ({
  isVisible,
  onClose,
  onApply,
  brands,
  models,
  initialFilters,
}) => {
  const [sortOption, setSortOption] = useState(initialFilters.sortOption);
  const [selectedBrands, setSelectedBrands] = useState(
    initialFilters.selectedBrands,
  );
  const [selectedModels, setSelectedModels] = useState(
    initialFilters.selectedModels,
  );
  const [brandQuery, setBrandQuery] = useState('');
  const [modelQuery, setModelQuery] = useState('');

  useEffect(() => {
    if (isVisible) {
      setSortOption(initialFilters.sortOption);
      setSelectedBrands(initialFilters.selectedBrands);
      setSelectedModels(initialFilters.selectedModels);
    }
  }, [isVisible, initialFilters]);

  const handleToggleBrand = brand => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(prevSelectedBrands =>
        prevSelectedBrands.filter(b => b !== brand),
      );
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const handleToggleModel = model => {
    if (selectedModels.includes(model)) {
      setSelectedModels(selectedModels.filter(m => m !== model));
    } else {
      setSelectedModels([...selectedModels, model]);
    }
  };

  const handleApply = () => {
    onApply({
      sortOption,
      selectedBrands,
      selectedModels,
    });
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Filter</Text>
            <View style={{width: 24}} />
          </View>

          <Text style={styles.sectionTitle}>Sort By</Text>
          <RadioButton.Group
            onValueChange={value => setSortOption(value)}
            value={sortOption}>
            {Object.values(SortOptions).map((option, index) => (
              <View key={`${option.key}-${index}`} style={styles.radioOption}>
                <RadioButton.Android
                  value={option.key}
                  color="#0066FF"
                  status={sortOption === option.key ? 'checked' : 'unchecked'}
                />
                <Text style={styles.radioText}>{option.label}</Text>
              </View>
            ))}
          </RadioButton.Group>

          <Text style={styles.sectionTitle}>Brand</Text>
          <TextInput
            style={styles.searchBar}
            placeholder="Search Brand"
            value={brandQuery}
            onChangeText={setBrandQuery}
          />
          <View style={styles.fixedHeightContainer}>
            <ScrollView style={{overflow: 'hidden'}}>
              {brands
                .filter(brand =>
                  brand.toLowerCase().includes(brandQuery.toLowerCase()),
                )
                .map((brand, index) => (
                  <View key={`${brand}-${index}`} style={styles.checkboxOption}>
                    <Checkbox.Android
                      status={
                        selectedBrands.includes(brand) ? 'checked' : 'unchecked'
                      }
                      onPress={() => handleToggleBrand(brand)}
                      color="#0066FF"
                    />
                    <Text style={styles.checkboxText}>{brand}</Text>
                  </View>
                ))}
            </ScrollView>
          </View>

          <Text style={styles.sectionTitle}>Model</Text>
          <TextInput
            style={styles.searchBar}
            placeholder="Search Model"
            value={modelQuery}
            onChangeText={setModelQuery}
          />
          <View style={styles.fixedHeightContainer}>
            <ScrollView>
              {models
                .filter(model =>
                  model.toLowerCase().includes(modelQuery.toLowerCase()),
                )
                .map((model, index) => (
                  <View key={`${model}-${index}`} style={styles.checkboxOption}>
                    <Checkbox.Android
                      status={
                        selectedModels.includes(model) ? 'checked' : 'unchecked'
                      }
                      onPress={() => handleToggleModel(model)}
                      color="#0066FF"
                    />
                    <Text style={styles.checkboxText}>{model}</Text>
                  </View>
                ))}
            </ScrollView>
          </View>

          <TouchableOpacity onPress={handleApply} style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    maxHeight: '95%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  closeButton: {
    fontSize: 24,
    color: '#000',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    marginTop: 4,
  },
  fixedHeightContainer: {
    maxHeight: '15%',
    marginBottom: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioText: {
    marginLeft: 8,
    fontSize: 16,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  checkboxText: {
    marginLeft: 8,
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: '#0066FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FilterModal;
