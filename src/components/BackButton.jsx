import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AppIcons } from '../utils/icons';

export default function BackButton() {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={() => router.back()}
    >
      <Text style={styles.icon}>{AppIcons.back}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    marginLeft: 8,
  },
  icon: {
    fontSize: 24,
    color: '#007AFF',
  },
}); 