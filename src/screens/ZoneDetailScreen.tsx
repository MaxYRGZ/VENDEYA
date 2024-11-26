import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { globalStyles } from '../styles/globalStyles';
import LocalDB from '../../persistence/localdb';

type ZoneDetailScreenProps = {
  route: RouteProp<{ params: { zone: string } }, 'params'>;
};

interface ProductSale {
  nombre_producto: string;
  cantidad: number;
  ganancia: number;
  latitude: number;
  longitude: number;
}

const MAP_WIDTH = 300;
const MAP_HEIGHT = 200;

const ZoneDetailScreen: React.FC<ZoneDetailScreenProps> = ({ route }) => {
  const { zone } = route.params;
  const [productSales, setProductSales] = useState<ProductSale[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    loadZoneDetails();
  }, [zone]);

  const loadZoneDetails = async () => {
    const db = await LocalDB.connect();
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT p.nombre_producto, v.cantidad, v.cantidad * CAST(p.ganancia_producto AS FLOAT) as ganancia, v.latitude, v.longitude
         FROM ventas v 
         JOIN productos p ON v.producto_id = p.id 
         WHERE v.zona = ?`,
        [zone],
        (_, { rows }) => {
          const sales = rows.raw().map(row => ({
            nombre_producto: row.nombre_producto,
            cantidad: row.cantidad,
            ganancia: parseFloat(row.ganancia),
            latitude: row.latitude,
            longitude: row.longitude
          }));
          setProductSales(sales);
          setTotalEarnings(sales.reduce((sum, sale) => sum + sale.ganancia, 0));
        },
        (_, error) => console.error('Error loading zone details:', error)
      );
    });
  };

  const getMapUrl = (latitude: number, longitude: number) => {
    const zoom = 15;
    const apiKey = 'AIzaSyCE8AHpJQXpaOTNGQMuZ3Wu_AqTdKYfOOY'; // Replace with your Google Maps API key
    return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=${MAP_WIDTH}x${MAP_HEIGHT}&maptype=roadmap&markers=color:red%7C${latitude},${longitude}&key=${apiKey}`;
  };

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Código Postal: {zone}</Text>

      <View style={styles.earningsContainer}>
        <Text style={globalStyles.subtitle}>Ganancias</Text>
        {productSales.map((sale, index) => (
          <View key={index} style={styles.earningsRow}>
            <Text style={styles.text}>{sale.nombre_producto}</Text>
            <Text style={styles.text}>$ {sale.ganancia.toFixed(2)}</Text>
          </View>
        ))}
        <View style={[styles.earningsRow, styles.totalRow]}>
          <Text style={[styles.text, styles.totalText]}>Total</Text>
          <Text style={[styles.text, styles.totalAmount]}>$ {totalEarnings.toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.salesBreakdownContainer}>
        <Text style={globalStyles.subtitle}>Desglose de Ventas</Text>
        {productSales.map((sale, index) => (
          <View key={index}>
            <View style={styles.salesBreakdownRow}>
              <Text style={styles.text}>{sale.nombre_producto}</Text>
              <Text style={styles.text}>{sale.cantidad} unidades</Text>
            </View>
            <View style={styles.mapContainer}>
              <Image
                source={{ uri: getMapUrl(sale.latitude, sale.longitude) }}
                style={styles.mapImage}
                resizeMode="cover"
              />
              <Text style={styles.coordinatesText}>
                Lat: {sale.latitude.toFixed(6)}, Lon: {sale.longitude.toFixed(6)}
              </Text>
            </View>
          </View>
        ))}
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
  salesBreakdownContainer: {
    flex: 1,
    marginTop: 20,
  },
  salesBreakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  text: {
    color: '#000',
  },
  mapContainer: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT + 30,
    marginVertical: 10,
    alignSelf: 'center',
  },
  mapImage: {
    width: '100%',
    height: MAP_HEIGHT,
    borderRadius: 10,
  },
  coordinatesText: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
});

export default ZoneDetailScreen;

