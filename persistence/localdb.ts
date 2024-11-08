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

    // ... other methods remain the same
}