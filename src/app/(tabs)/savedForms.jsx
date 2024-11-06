import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useFormContext } from '../../contexts/FormContext';
import { Ionicons } from '@expo/vector-icons';

export default function SavedForms() {
  const { forms, deleteForm } = useFormContext();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Forms</Text>
      <ScrollView style={styles.scrollView}>
        {forms.length === 0 ? (
          <Text style={styles.emptyText}>No saved forms yet</Text>
        ) : (
          forms.map((form) => (
            <View key={form.id} style={styles.formCard}>
              <View style={styles.formInfo}>
                <Text style={styles.formTitle}>{form.title}</Text>
                <Text style={styles.formDate}>
                  Created: {new Date(form.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => deleteForm(form.id)}
              >
                <Ionicons name="trash-outline" size={24} color="#FF0000" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  title: {
    fontFamily: 'outfit-medium',
    fontSize: 24,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  emptyText: {
    fontFamily: 'outfit-regular',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
  formCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  formInfo: {
    flex: 1,
  },
  formTitle: {
    fontFamily: 'outfit-medium',
    fontSize: 18,
    color: '#000000',
    marginBottom: 4,
  },
  formDate: {
    fontFamily: 'outfit-regular',
    fontSize: 14,
    color: '#666666',
  },
  deleteButton: {
    padding: 8,
  },
});