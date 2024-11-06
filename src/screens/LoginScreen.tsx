import React from 'react';
import { View, Text, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { globalStyles } from '../styles/globalStyles';
import Input from '../components/Input';
import Button from '../components/Button';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => (
  <View style={globalStyles.container}>
    <Image 
      source={require('../../assets/logo.png')}
      style={{ width: 120, height: 120, alignSelf: 'center', marginBottom: 20 }}
    />
    <Text style={globalStyles.title}>Inicia sesión</Text>
    <Text style={globalStyles.subtitle}>Hola! Qué gusto volverte a ver!</Text>
    
    <Input label="Usuario" placeholder="Tu nombre de usuario" />
    <Input label="Contraseña" placeholder="Tu contraseña" secureTextEntry />

    <Button title="Ingresar" onPress={() => navigation.navigate('Sales')} />
    <Button title="Crea una cuenta" onPress={() => navigation.navigate('CreateAccount')} outline />
  </View>
);

export default LoginScreen;