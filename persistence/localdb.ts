import SQLite from 'react-native-sqlite-storage';

export default class LocalDB {
  static connect() {
    return SQLite.openDatabase({ name: 'veneya', location: 'default' });
  }

  static async init() {
    const db = await LocalDB.connect();
    return new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        // Habilitar el uso de claves foráneas
        tx.executeSql('PRAGMA foreign_keys = ON;');

        // Crear tabla cuenta
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS cuenta (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT NOT NULL UNIQUE,
            correo TEXT NOT NULL UNIQUE,
            contraseña TEXT NOT NULL,
            ganancia TEXT NOT NULL
          )`,
          [],
          () => console.log('Created table Cuenta'),
          (_, error) => console.error('Error creating table Cuenta:', error)
        );

        // Crear tabla productos
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre_producto TEXT NOT NULL,
            ganancia_producto TEXT NOT NULL,
            usuario_id INTEGER NOT NULL,
            FOREIGN KEY (usuario_id) REFERENCES cuenta(id) ON DELETE CASCADE
          )`,
          [],
          () => console.log('Created table Productos'),
          (_, error) => console.error('Error creating table Productos:', error)
        );

        // Crear tabla ventas con latitude y longitude
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS ventas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            producto_id INTEGER,
            cantidad INTEGER,
            zona TEXT,
            fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
            usuario_id INTEGER,
            latitude REAL,
            longitude REAL,
            FOREIGN KEY (producto_id) REFERENCES productos(id),
            FOREIGN KEY (usuario_id) REFERENCES cuenta(id)
          )`,
          [],
          () => console.log('Created table Ventas'),
          (_, error) => console.error('Error creating table Ventas:', error)
        );
      }, (error) => {
        console.error('Transaction error:', error);
        reject(error);
      }, () => {
        console.log('All tables created successfully');
        resolve();
      });
    });
  }

  static async createAccount(usuario: string, correo: string, contraseña: string, ganancia: string) {
    const db = await LocalDB.connect();
    return new Promise<number>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO cuenta (usuario, correo, contraseña, ganancia) VALUES (?, ?, ?, ?)',
          [usuario, correo, contraseña, ganancia],
          (_, result) => {
            if (result.insertId) {
              resolve(result.insertId);
            } else {
              reject(new Error('No insert ID returned'));
            }
          },
          (_, error) => {
            console.error('SQL Error:', error);
            reject(error);
          }
        );
      }, (error) => {
        console.error('Transaction error:', error);
        reject(error);
      });
    });
  }

  static async verifyUser(usuario: string, contraseña: string) {
    const db = await LocalDB.connect();
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM cuenta WHERE usuario = ? AND contraseña = ?',
          [usuario, contraseña],
          (_, { rows }) => resolve(rows.length > 0 ? rows.item(0) : null),
          (_, error) => {
            console.error('SQL Error:', error);
            reject(error);
          }
        );
      }, (error) => {
        console.error('Transaction error:', error);
        reject(error);
      });
    });
  }

  static async saveSale(productoId: number, cantidad: number, zona: string, usuarioId: number, latitude: number, longitude: number) {
    const db = await LocalDB.connect();
    return new Promise<number>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO ventas (producto_id, cantidad, zona, usuario_id, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)',
          [productoId, cantidad, zona, usuarioId, latitude, longitude],
          (_, result) => {
            if (result.insertId) {
              resolve(result.insertId);
            } else {
              reject(new Error('No insert ID returned'));
            }
          },
          (_, error) => {
            console.error('SQL Error:', error);
            reject(error);
          }
        );
      });
    });
  }

  static async getZoneFromCoordinates(latitude: number, longitude: number): Promise<string> {
    const apiKey = 'AIzaSyCE8AHpJQXpaOTNGQMuZ3Wu_AqTdKYfOOY'; // Reemplaza esto con tu API key de Google Maps
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        // Buscar el componente de dirección que sea una colonia (neighborhood)
        const neighborhood = data.results[0].address_components.find(
          (component: any) => component.types.includes('neighborhood')
        );

        if (neighborhood) {
          return neighborhood.long_name;
        } else {
          // Si no se encuentra una colonia, usar la localidad o la ciudad
          const locality = data.results[0].address_components.find(
            (component: any) => component.types.includes('locality') || component.types.includes('administrative_area_level_2')
          );
          return locality ? locality.long_name : 'Zona desconocida';
        }
      } else {
        console.error('Error en la respuesta de la API de Google Maps:', data.status);
        return 'Zona desconocida';
      }
    } catch (error) {
      console.error('Error al obtener la zona:', error);
      return 'Zona desconocida';
    }
  }

  static async deleteAccount(userId: number) {
    const db = await this.connect();
    return new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM cuenta WHERE id = ?',
          [userId],
          () => resolve(),
          (_, error) => reject(error)
        );
      });
    });
  }

  static async deleteDatabase() {
    return SQLite.deleteDatabase({ name: 'veneya', location: 'default' });
  }
}

