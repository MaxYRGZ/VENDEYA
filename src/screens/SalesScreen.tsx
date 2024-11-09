import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from '../styles/globalStyles';
import LocalDB from '../../persistence/localdb';

type SalesScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

interface Product {
  id: number;
  nombre_producto: string;
  ganancia_producto: string;
  count: number;
}

const SalesScreen: React.FC<SalesScreenProps> = ({ navigation }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadProducts();
    }, [])
  );

  const loadProducts = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      Alert.alert('Error', 'No se pudo obtener la información del usuario');
      return;
    }

    const db = await LocalDB.connect();
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM productos WHERE usuario_id = ?',
        [userId],
        (_, { rows }) => {
          const loadedProducts = rows.raw().map(product => ({
            ...product,
            count: 0
          }));
          setProducts(loadedProducts);
        },
        (error) => console.error('Error loading products:', error)
      );
    });
  };

  const updateProductCount = (id: number, increment: boolean) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === id
          ? { ...product, count: Math.max(0, product.count + (increment ? 1 : -1)) }
          : product
      )
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      <Text style={styles.productName}>{item.nombre_producto}</Text>
      <View style={styles.productControls}>
        <TouchableOpacity onPress={() => updateProductCount(item.id, false)}>
          <Image
            source={require('../../assets/minus-button.png')}
            style={styles.controlButton}
          />
        </TouchableOpacity>
        <Text style={styles.productCount}>{item.count}</Text>
        <TouchableOpacity onPress={() => updateProductCount(item.id, true)}>
          <Image
            source={require('../../assets/plus-button.png')}
            style={styles.controlButton}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.headerButton}>
          <Image
            source={require('../../assets/back-arrow.png')}
            style={styles.headerButtonImage}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Ventas</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Products')} style={styles.headerButton}>
          <Image
            source={require('../../assets/menu-icon.png')}
            style={styles.headerButtonImage}
          />
        </TouchableOpacity>
      </View>
      {products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text style={styles.noProductsText}>Aún no hay productos</Text>
      )}
      <TouchableOpacity style={styles.addSaleButton} onPress={() => {/* Handle add sale */}}>
        <Text style={styles.addSaleButtonText}>Agregar venta</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.viewReportButton} 
        onPress={() => navigation.navigate('Report')}
      >
        <Text style={styles.viewReportButtonText}>Ver reporte</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerButton: {
    padding: 10,
  },
  headerButtonImage: {
    width: 24,
    height: 24,
  },
  title: {
    ...globalStyles.title,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  productName: {
    fontSize: 16,
    color: 'black',
  },
  productControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    width: 30,
    height: 30,
  },
  productCount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
    color: 'black',
  },
  noProductsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  addSaleButton: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  addSaleButtonText: {
    color: '#4CAF50',
    fontSize: 16,
  },
  viewReportButton: {
    marginTop: '100%',
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
  },
  viewReportButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SalesScreen;