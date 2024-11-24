import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LogoutButton({ onLogout }) {
  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={onLogout}
    >
      <Ionicons name="log-out-outline" size={24} color="#000" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    marginRight: 8,
  },
});