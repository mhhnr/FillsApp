import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { AppIcons } from '../utils/icons';

export default function LogoutButton({ onLogout }) {
  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={onLogout}
    >
      <Text style={styles.icon}>{AppIcons.logout}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    marginRight: 8,
  },
  icon: {
    fontSize: 24,
  }
});