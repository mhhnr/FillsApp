import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFormContext } from '../../contexts/FormContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SavedForms() {
  const { templates, deleteTemplate, loading } = useFormContext();
  const router = useRouter();

  const handleDelete = async (templateId) => {
    Alert.alert(
      'Delete Template',
      'Are you sure you want to delete this template?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTemplate(templateId);
              Alert.alert('Success', 'Template deleted successfully');
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to delete template');
            }
          },
        },
      ]
    );
  };

  const handleTemplateSelect = (template) => {
    router.push({
      pathname: '/viewTemplate',
      params: { templateId: template.templateId }
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Saved Forms</Text>
        <Text style={styles.emptyText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Forms</Text>
      <ScrollView style={styles.scrollView}>
        {templates.length === 0 ? (
          <Text style={styles.emptyText}>No saved templates yet</Text>
        ) : (
          templates.map((template) => (
            <TouchableOpacity 
              key={template.templateId} 
              style={styles.formCard}
              onPress={() => handleTemplateSelect(template)}
            >
              <View style={styles.formInfo}>
                <Text style={styles.formTitle}>{template.name}</Text>
                <Text style={styles.formDate}>
                  Created: {new Date(parseInt(template.createdAt) * 1000).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleDelete(template.templateId);
                }}
              >
                <Ionicons name="trash-outline" size={24} color="#FF0000" />
              </TouchableOpacity>
            </TouchableOpacity>
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