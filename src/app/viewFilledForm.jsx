import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { filledFormsStore } from './(tabs)/forms';
import { getTemplateDetails } from '../components/templates';

export default function ViewFilledForm() {
  const { formId } = useLocalSearchParams();
  const router = useRouter();

  const filledForm = filledFormsStore.getFormById(formId);
  const templateDetails = filledForm ? getTemplateDetails(filledForm.templateId) : null;

  if (!filledForm || !templateDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Form not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{templateDetails.title}</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push({
            pathname: '/fillForm',
            params: { 
              templateId: filledForm.templateId,
              formId: filledForm.id,
              isEditing: true
            }
          })}
        >
          <Ionicons name="create-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Form Details</Text>
          <Text style={styles.dateText}>
            Created: {new Date(filledForm.createdAt).toLocaleDateString()}
          </Text>
          {filledForm.updatedAt && (
            <Text style={styles.dateText}>
              Last Updated: {new Date(filledForm.updatedAt).toLocaleDateString()}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Responses</Text>
          {Object.entries(filledForm.data).map(([key, value]) => (
            <View key={key} style={styles.field}>
              <Text style={styles.fieldLabel}>
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:
              </Text>
              <Text style={styles.fieldValue}>{value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontFamily: 'outfit-medium',
    fontSize: 20,
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'outfit-medium',
    fontSize: 18,
    marginBottom: 12,
    color: '#007AFF',
  },
  dateText: {
    fontFamily: 'outfit-regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  field: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  fieldValue: {
    fontFamily: 'outfit-regular',
    fontSize: 16,
    color: '#000000',
  },
}); 