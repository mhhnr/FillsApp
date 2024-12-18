import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AppIcons } from '../utils/icons';

export default function SelectionOverlay({ selectedCount, onCancel, onChooseTemplate }) {
  return (
    <View style={styles.overlay}>
      <TouchableOpacity onPress={onCancel} style={styles.button}>
        <Text style={styles.icon}>{AppIcons.close}</Text>
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
  icon: {
    fontSize: 24,
    color: '#FFFFFF',
  }
}); 