import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function FormTemplate({ template, onSelect }) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onSelect(template)}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{template.name}</Text>
        <Text style={styles.fieldCount}>
          {template.fields.length} fields
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#000" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: 'outfit-medium',
    fontSize: 18,
    color: '#000000',
    marginBottom: 4,
  },
  fieldCount: {
    fontFamily: 'outfit-regular',
    fontSize: 14,
    color: '#666666',
  },
}); 