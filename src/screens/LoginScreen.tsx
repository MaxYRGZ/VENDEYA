import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { globalStyles } from '../styles/globalStyles';
import Input from '../components/Input';
import Button from '../components/Button';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => (
  <View style={styles.container}>
    
    <View style={styles.contentContainer}>
      <Image 
        source={require('../../assets/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Inicia sesión</Text>
      <Text style={styles.subtitle}>Hola! Qué gusto volverte a ver!</Text>
      
      <Input label="Usuario" placeholder="Tu nombre de usuario" />
      <Input label="Contraseña" placeholder="Tu contraseña" secureTextEntry />

      <Button title="Ingresar" onPress={() => navigation.navigate('Sales')} />
      
      <TouchableOpacity 
        style={styles.forgotPasswordButton}
        onPress={() => {/* Handle forgot password */}}
      >
        <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity 
      style={styles.createAccountButton}
      onPress={() => navigation.navigate('CreateAccount')}
    >
      <Text style={styles.createAccountText}>Crea una cuenta</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: '40%',
    height: '15%',
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    ...globalStyles.title,
  },
  subtitle: {
    ...globalStyles.subtitle,
    marginBottom: 50,
  },
  forgotPasswordButton: {
    alignSelf: 'center',
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#999',
    fontSize: 14,
  },
  createAccountButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  createAccountText: {
    color: '#4CAF50',
    fontSize: 16,
  },
});

export default LoginScreen;