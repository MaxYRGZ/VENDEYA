import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  outline?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, outline }) => (
  <TouchableOpacity
    style={[globalStyles.button, outline && styles.outlineButton]}
    onPress={onPress}
  >
    <Text style={[globalStyles.buttonText, outline && styles.outlineButtonText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  outlineButtonText: {
    color: '#4CAF50',
  },
});

export default Button;