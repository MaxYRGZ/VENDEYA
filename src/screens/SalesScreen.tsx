import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { globalStyles } from '../styles/globalStyles';
import ProductItem from '../components/ProductItem';
import Button from '../components/Button';

type SalesScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const SalesScreen: React.FC<SalesScreenProps> = ({ navigation }) => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Tostilocos', count: 0 },
    { id: 2, name: 'Esquite', count: 0 },
    { id: 3, name: 'Elote', count: 0 },
  ]);

  const updateCount = (id: number, increment: boolean) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, count: increment ? product.count + 1 : Math.max(0, product.count - 1) } : product
    ));
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Ventas</Text>
      
      <ScrollView style={{ flex: 1, marginBottom: 20 }}>
        {products.map(product => (
          <ProductItem
            key={product.id}
            name={product.name}
            count={product.count}
            onIncrement={() => updateCount(product.id, true)}
            onDecrement={() => updateCount(product.id, false)}
          />
        ))}
      </ScrollView>

      <Button title="Agregar venta" onPress={() => {}} outline />
      <Button title="Ver reporte" onPress={() => navigation.navigate('Report')} />
    </View>
  );
};

export default SalesScreen;