import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { globalStyles } from '../styles/globalStyles';
import ZoneCard from '../components/ZoneCard';

type ReportScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const ReportScreen: React.FC<ReportScreenProps> = ({ navigation }) => (
  <ScrollView style={globalStyles.container}>
    <Text style={globalStyles.title}>Reporte</Text>
    
    <Text style={globalStyles.subtitle}>Zonas con más ventas</Text>
    <ZoneCard zone={1} earnings={2300} onPress={() => navigation.navigate('ZoneDetail', { zone: 1 })} />
    <ZoneCard zone={2} earnings={1400} onPress={() => navigation.navigate('ZoneDetail', { zone: 2 })} />
    <ZoneCard zone={3} earnings={1000} onPress={() => navigation.navigate('ZoneDetail', { zone: 3 })} />
    
    <Text style={globalStyles.subtitle}>Zonas con menos ventas</Text>
    <ZoneCard zone={4} earnings={102} onPress={() => navigation.navigate('ZoneDetail', { zone: 4 })} isLowPerforming />
  </ScrollView>
);

export default ReportScreen;