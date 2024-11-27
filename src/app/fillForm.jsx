import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getTemplateComponent, getTemplateDetails } from '../components/templates';
import { useFormDataContext } from '../contexts/FormDataContext';

export default function FillForm() {
  const { templateId, formId, isEditing } = useLocalSearchParams();
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const { saveForm, updateForm, loading, error, clearError } = useFormDataContext();
  
  // Load existing form data if editing
  useEffect(() => {
    if (isEditing && formId) {
      const existingForm = filledFormsStore.getFormById(formId);
      if (existingForm) {
        setFormData(existingForm.data);
      }
    }
  }, [formId, isEditing]);

  const TemplateComponent = getTemplateComponent(templateId);
  const templateDetails = getTemplateDetails(templateId);

  const handleSave = async () => {
    try {
      console.log('Attempting to save form with template:', templateId);
      console.log('Form data:', formData);

      if (isEditing && formId) {
        await updateForm(formId, formData);
      } else {
        await saveForm(templateId, formData);
      }
      
      Alert.alert(
        'Success',
        `Form ${isEditing ? 'updated' : 'saved'} successfully`,
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/forms')
          }
        ]
      );
    } catch (error) {
      console.error('Form save error:', error);
      Alert.alert(
        'Error',
        error.message || `Failed to ${isEditing ? 'update' : 'save'} form. Please try again.`
      );
    }
  };

  if (!TemplateComponent) {
    return (
      <View style={styles.container}>
        <Text>Template not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.formContainer}>
        <TemplateComponent 
          isTemplate={false} 
          data={formData}
          onDataChange={setFormData}
        />
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>
          {isEditing ? 'Update Form' : 'Save Form'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  formContainer: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontFamily: 'outfit-medium',
    fontSize: 16,
  },
}); 