import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

interface InputProps {
  label: string;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address';
}

const Input: React.FC<InputProps> = ({ label, placeholder, secureTextEntry, keyboardType = 'default' }) => (
  <View style={globalStyles.inputContainer}>
    <Text style={globalStyles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      placeholderTextColor="black" 
    />
  </View>
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    color: 'black', 
  },
});

export default Input;