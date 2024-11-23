import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
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
}

interface ZoneCoordinates {
  latitude: number;
  longitude: number;
}

const ZoneDetailScreen: React.FC<ZoneDetailScreenProps> = ({ route }) => {
  const { zone } = route.params;
  const [productSales, setProductSales] = useState<ProductSale[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [zoneCoordinates, setZoneCoordinates] = useState<ZoneCoordinates | null>(null);

  useEffect(() => {
    loadZoneDetails();
    loadZoneCoordinates();
  }, [zone]);

  const loadZoneDetails = async () => {
    const db = await LocalDB.connect();
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT p.nombre_producto, SUM(v.cantidad) as cantidad, SUM(v.cantidad * CAST(p.ganancia_producto AS FLOAT)) as ganancia 
         FROM ventas v 
         JOIN productos p ON v.producto_id = p.id 
         WHERE v.zona = ? 
         GROUP BY p.id`,
        [zone],
        (_, { rows }) => {
          const sales = rows.raw().map(row => ({
            nombre_producto: row.nombre_producto,
            cantidad: row.cantidad,
            ganancia: parseFloat(row.ganancia)
          }));
          setProductSales(sales);
          setTotalEarnings(sales.reduce((sum, sale) => sum + sale.ganancia, 0));
        },
        (_, error) => console.error('Error loading zone details:', error)
      );
    });
  };

  const loadZoneCoordinates = async () => {
    const db = await LocalDB.connect();
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT latitude, longitude FROM zonas WHERE nombre = ?',
        [zone],
        (_, { rows }) => {
          if (rows.length > 0) {
            setZoneCoordinates({
              latitude: rows.item(0).latitude,
              longitude: rows.item(0).longitude
            });
          }
        },
        (_, error) => console.error('Error loading zone coordinates:', error)
      );
    });
  };

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Zona {zone}</Text>
      
      {zoneCoordinates && (
        <View style={styles.mapContainer}>
          <View style={styles.map}>
            <View style={[styles.marker, { left: '50%', top: '50%' }]} />
          </View>
          <Text style={styles.coordinatesText}>
            Lat: {zoneCoordinates.latitude.toFixed(6)}, Lon: {zoneCoordinates.longitude.toFixed(6)}
          </Text>
        </View>
      )}

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
          <View key={index} style={styles.salesBreakdownRow}>
            <Text style={styles.text}>{sale.nombre_producto}</Text>
            <Text style={styles.text}>{sale.cantidad} unidades</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  map: {
    width: Dimensions.get('window').width - 40,
    height: 200,
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    position: 'absolute',
  },
  coordinatesText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
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
    color: '#000', // Ensure text is black for visibility
  },
});

export default ZoneDetailScreen;