import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { globalStyles } from '../styles/globalStyles';
import Input from '../components/Input';
import Button from '../components/Button';

type ProductsScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

interface ProductInput {
  id: number;
  name: string;
  price: string;
}

const ProductsScreen: React.FC<ProductsScreenProps> = ({ navigation }) => {
  const [products, setProducts] = useState<ProductInput[]>([
    { id: 1, name: '', price: '' }
  ]);

  const addNewProduct = () => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts([...products, { id: newId, name: '', price: '' }]);
  };

  const updateProduct = (id: number, field: 'name' | 'price', value: string) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ));
  };

  return (
    <View style={styles.container}>

      <ScrollView style={styles.scrollView}>
        <Text style={globalStyles.title}>Productos</Text>
        <Text style={globalStyles.subtitle}>Dinos qué productos vendes, y cuánto ganas por cada uno</Text>
        <View style={styles.container}>
        <TouchableOpacity style={styles.addButton} onPress={addNewProduct}>
        <Image 
          source={require('../../assets/+.png')} 
          style={styles.addButtonImage}
        />
        </TouchableOpacity>
        </View>
        
        {products.map((product) => (
          <View key={product.id} style={styles.productInputs}>
            <Input
              label="Nombre"
              placeholder="El nombre de tu producto"
              value={product.name}
              onChangeText={(text: string) => updateProduct(product.id, 'name', text)}
            />
            <Input
              label="Ganancia"
              placeholder="0"
              keyboardType="numeric"
              value={product.price}
              onChangeText={(text: string) => updateProduct(product.id, 'price', text)}
            />
          </View>
        ))}
      </ScrollView>

      <Button title="Guardar productos" onPress={() => navigation.navigate('Sales')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
    paddingTop: 60, // Make room for the add button
  },
  scrollView: {
    flex: 1,
  },
  addButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 1,
  },
  addButtonImage: {
    width: 30,
    height: 30,
    
  },
  productInputs: {
    marginBottom: 20,
  },
});

export default ProductsScreen;