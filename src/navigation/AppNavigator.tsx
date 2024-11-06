import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import ProductsScreen from '../screens/ProductsScreen';
import SalesScreen from '../screens/SalesScreen';
import ReportScreen from '../screens/ReportScreen';
import ZoneDetailScreen from '../screens/ZoneDetailScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => (
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
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;