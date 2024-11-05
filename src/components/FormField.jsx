import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function FormField({ field, onDelete, onEdit }) {
  return (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldContent}>
        <Text style={styles.fieldLabel}>{field.label}</Text>
        <Text style={styles.fieldType}>{field.type}</Text>
      </View>
      <View style={styles.fieldActions}>
        <TouchableOpacity onPress={() => onEdit(field)} style={styles.actionButton}>
          <Ionicons name="pencil-outline" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(field.id)} style={styles.actionButton}>
          <Ionicons name="trash-outline" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: '#000000',
  },
  fieldType: {
    fontFamily: 'outfit-regular',
    fontSize: 14,
    color: '#666666',
  },
  fieldActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 5,
  },
}); 