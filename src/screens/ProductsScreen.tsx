import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { globalStyles } from '../styles/globalStyles';
import Input from '../components/Input';
import Button from '../components/Button';

type ProductsScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const ProductsScreen: React.FC<ProductsScreenProps> = ({ navigation }) => (
  <View style={globalStyles.container}>
    <Text style={globalStyles.title}>Productos</Text>
    <Text style={globalStyles.subtitle}>Dinos qué productos vendes, y cuánto ganas por cada uno</Text>
    
    <Input label="Nombre" placeholder="El nombre de tu producto" />
    <Input label="Ganancia" placeholder="0" keyboardType="numeric" />

    <Button title="Crear cuenta" onPress={() => navigation.navigate('Login')} />
  </View>
);

export default ProductsScreen;