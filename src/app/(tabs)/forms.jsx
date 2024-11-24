import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFormContext } from '../../contexts/FormContext';
import { Ionicons } from '@expo/vector-icons';

export default function FilledForms() {
  const { filledForms, templates, deleteFilledForm, loading } = useFormContext();

  const handleDelete = async (formId) => {
    Alert.alert(
      'Delete Form',
      'Are you sure you want to delete this filled form?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFilledForm(formId);
              Alert.alert('Success', 'Form deleted successfully');
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to delete form');
            }
          },
        },
      ]
    );
  };

  const getTemplateTitle = (templateId) => {
    const template = templates.find(t => t.templateId === templateId);
    return template?.title || 'Unknown Template';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Filled Forms</Text>
        <Text style={styles.emptyText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filled Forms</Text>
      <ScrollView style={styles.scrollView}>
        {filledForms.length === 0 ? (
          <Text style={styles.emptyText}>No filled forms yet</Text>
        ) : (
          filledForms.map((form) => (
            <View key={form.formId} style={styles.formCard}>
              <View style={styles.formInfo}>
                <Text style={styles.formTitle}>{getTemplateTitle(form.templateId)}</Text>
                <Text style={styles.formDate}>
                  Filled: {new Date(form.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDelete(form.formId)}
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
  }
}); 