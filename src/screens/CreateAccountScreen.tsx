import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { globalStyles } from '../styles/globalStyles';
import Input from '../components/Input';
import Button from '../components/Button';

type CreateAccountScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const CreateAccountScreen: React.FC<CreateAccountScreenProps> = ({ navigation }) => (
  <View style={globalStyles.container}>
    <Text style={globalStyles.title}>Crea una cuenta</Text>
    
    <Input label="Usuario" placeholder="Tu nombre de usuario" />
    <Input label="Contraseña" placeholder="Tu contraseña" secureTextEntry />
    <Input 
      label="Ganancia diaria promedio" 
      placeholder="¿Cuánto ganas al día en promedio?" 
      keyboardType="numeric"
    />

    <Button title="Continuar" onPress={() => navigation.navigate('Products')} />
  </View>
);


export default CreateAccountScreen;