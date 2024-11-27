import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SelectionOverlay({ selectedCount, onCancel, onChooseTemplate }) {
  return (
    <View style={styles.overlay}>
      <TouchableOpacity onPress={onCancel} style={styles.button}>
        <Ionicons name="close" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.count}>{selectedCount} selected</Text>
      <TouchableOpacity onPress={onChooseTemplate} style={styles.button}>
        <Text style={styles.buttonText}>Choose Template</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    zIndex: 1000,
  },
  count: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'outfit-medium',
  },
  button: {
    padding: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'outfit-medium',
  },
}); 