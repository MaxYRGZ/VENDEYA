import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { globalStyles } from '../styles/globalStyles';

type ZoneDetailScreenProps = {
  route: RouteProp<{ params: { zone: number } }, 'params'>;
};

const ZoneDetailScreen: React.FC<ZoneDetailScreenProps> = ({ route }) => {
  const { zone } = route.params;

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Zona {zone}</Text>
      
      <View style={styles.earningsContainer}>
        <Text style={globalStyles.subtitle}>Ganancias</Text>
        <View style={styles.earningsRow}>
          <Text>Tostilocos</Text>
          <Text>$ 1,200</Text>
        </View>
        <View style={styles.earningsRow}>
          <Text>Esquites</Text>
          <Text>$ 800</Text>
        </View>
        <View style={styles.earningsRow}>
          <Text>Elotes</Text>
          <Text>$ 300</Text>
        </View>
        <View style={[styles.earningsRow, styles.totalRow]}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalAmount}>$ 2,300</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  earningsContainer: {
    flex: 1,
    marginTop: 20,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: '#4CAF50',
    marginTop: 10,
    paddingTop: 10,
  },
  totalText: {
    fontWeight: 'bold',
  },
  totalAmount: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default ZoneDetailScreen;