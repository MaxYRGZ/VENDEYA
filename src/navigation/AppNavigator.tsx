import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '../screens/LoginScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import ProductsScreen from '../screens/ProductsScreen';
import SalesScreen from '../screens/SalesScreen';
import ReportScreen from '../screens/ReportScreen';
import ZoneDetailScreen from '../screens/ZoneDetailScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import LocalDB from '../../persistence/localdb';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await LocalDB.init();
        console.log('Database initialized');
        
        // Verificar si hay un usuario logueado
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          // Si hay un usuario logueado, verificar si su cuenta aún existe en la base de datos
          const db = await LocalDB.connect();
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT * FROM cuenta WHERE id = ?',
              [userId],
              (_, { rows }) => {
                if (rows.length === 0) {
                  // Si la cuenta no existe, eliminar los datos de sesión
                  AsyncStorage.removeItem('userId');
                  AsyncStorage.removeItem('username');
                }
              },
              (_, error) => console.error('Error verifying user account:', error)
            );
          });
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="Products" component={ProductsScreen} />
        <Stack.Screen name="Sales" component={SalesScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
        <Stack.Screen name="ZoneDetail" component={ZoneDetailScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;