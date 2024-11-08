import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { globalStyles } from '../styles/globalStyles';
import Input from '../components/Input';
import Button from '../components/Button';
import LocalDB from '../../persistence/localdb';

type ProductsScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: {
    params: {
      userId: number;
    };
  };
};

interface ProductInput {
  id: number;
  name: string;
  price: string;
}

const ProductsScreen: React.FC<ProductsScreenProps> = ({ navigation, route }) => {
  const [products, setProducts] = useState<ProductInput[]>([
    { id: 1, name: '', price: '' }
  ]);
  const { userId } = route.params;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const db = await LocalDB.connect();
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM productos WHERE usuario_id = ?',
        [userId],
        (_, { rows }) => {
          const loadedProducts = rows.raw().map((row) => ({
            id: row.id,
            name: row.nombre_producto,
            price: row.ganancia_producto,
          }));
          setProducts(loadedProducts.length > 0 ? loadedProducts : [{ id: 1, name: '', price: '' }]);
        },
        (error) => console.error('Error loading products:', error)
      );
    });
  };

  const addNewProduct = () => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts([...products, { id: newId, name: '', price: '' }]);
  };

  const updateProduct = (id: number, field: 'name' | 'price', value: string) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ));
  };

  const saveProducts = async () => {
    const db = await LocalDB.connect();
    db.transaction((tx) => {
      products.forEach((product) => {
        if (product.name && product.price) {
          tx.executeSql(
            'INSERT OR REPLACE INTO productos (id, nombre_producto, ganancia_producto, usuario_id) VALUES (?, ?, ?, ?)',
            [product.id, product.name, product.price, userId],
            () => {},
            (error) => console.error('Error saving product:', error)
          );
        }
      });
    }, (error) => {
      console.error('Transaction error:', error);
      Alert.alert('Error', 'No se pudieron guardar los productos');
    }, () => {
      Alert.alert('Éxito', 'Productos guardados exitosamente');
      navigation.navigate('Sales');
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={addNewProduct}>
        <Image 
          source={require('../../assets/+.png')} 
          style={styles.addButtonImage}
        />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        <Text style={globalStyles.title}>Productos</Text>
        <Text style={globalStyles.subtitle}>Dinos qué productos vendes, y cuánto ganas por cada uno</Text>
        
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

      <Button title="Guardar productos" onPress={saveProducts} />
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
    tintColor: 'white',
  },
  productInputs: {
    marginBottom: 20,
  },
});

export default ProductsScreen;