import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { globalStyles } from '../styles/globalStyles';
import Button from '../components/Button';
import Input from '../components/Input';
import LocalDB from '../../persistence/localdb';
import Clipboard from '@react-native-clipboard/clipboard'; // Import Clipboard

type ForgotPasswordScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: {
    params: {
      username: string;
    };
  };
};

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation, route }) => {
  const { username } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [averageEarnings, setAverageEarnings] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleVerifyAndReset = async () => {
    setIsLoading(true);
    try {
      const db = await LocalDB.connect();
      const userData = await new Promise<{ correo: string, ganancia: string } | null>((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT correo, ganancia FROM cuenta WHERE usuario = ?',
            [username],
            (_, { rows }) => {
              if (rows.length > 0) {
                resolve(rows.item(0));
              } else {
                resolve(null);
              }
            },
            (_, error) => reject(error)
          );
        });
      });

      if (!userData) {
        Alert.alert('Error', 'Usuario no encontrado');
        setIsLoading(false);
        return;
      }

      if (userData.correo !== email || userData.ganancia !== averageEarnings) {
        Alert.alert('Error', 'La información proporcionada no coincide con nuestros registros');
        setIsLoading(false);
        return;
      }

      const generatedPassword = Math.random().toString(36).slice(-8);
      setNewPassword(generatedPassword);

      await new Promise<void>((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            'UPDATE cuenta SET contraseña = ? WHERE usuario = ?',
            [generatedPassword, username],
            () => resolve(),
            (_, error) => reject(error)
          );
        });
      });

      Alert.alert(
        'Contraseña restablecida',
        `Tu nueva contraseña es: ${generatedPassword}\n\nPor favor, cámbiala después de iniciar sesión.`
      );
    } catch (error) {
      console.error('Error resetting password:', error);
      Alert.alert('Error', 'Ocurrió un error al restablecer la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (newPassword) {
      Clipboard.setString(newPassword);
      Alert.alert('Contraseña copiada', 'La nueva contraseña ha sido copiada al portapapeles.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar contraseña</Text>
      <Text style={styles.subtitle}>Por favor, verifica tu información para el usuario: {username}</Text>
      
      <Input 
        label="Correo electrónico"
        placeholder="Ingresa tu correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <Input 
        label="Ganancias promedio"
        placeholder="Ingresa tus ganancias promedio"
        value={averageEarnings}
        onChangeText={setAverageEarnings}
        keyboardType="numeric"
      />
      
      <Button 
        title={isLoading ? "Verificando..." : "Verificar y restablecer contraseña"}
        onPress={handleVerifyAndReset}
        disabled={isLoading || !email || !averageEarnings}
        loading={isLoading}
      />

      {newPassword && (
        <View style={styles.newPasswordContainer}>
          <Text style={styles.newPasswordTitle}>Tu nueva contraseña es:</Text>
          <View style={styles.passwordContainer}>
            <Text style={styles.newPassword}>{newPassword}</Text>
            <TouchableOpacity onPress={handleCopyToClipboard} style={styles.copyButton}>
              <Text style={styles.copyButtonText}>Copiar</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.newPasswordInstructions}>Por favor, cámbiala después de iniciar sesión.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
    justifyContent: 'center',
  },
  title: {
    ...globalStyles.title,
    marginBottom: 20,
  },
  subtitle: {
    ...globalStyles.subtitle,
    marginBottom: 30,
    textAlign: 'center',
  },
  newPasswordContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  newPasswordTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  newPassword: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  newPasswordInstructions: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyButton: {
    marginLeft: 10,
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 5,
  },
  copyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
