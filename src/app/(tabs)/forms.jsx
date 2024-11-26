import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getTemplateIcon } from '../../utils/templateUtils';
import { getTemplateDetails } from '../../components/templates';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Update the store to properly handle form data and persistence
export const filledFormsStore = {
  forms: [],
  
  async init() {
    try {
      const savedForms = await AsyncStorage.getItem('filledForms');
      if (savedForms) {
        this.forms = JSON.parse(savedForms);
      }
    } catch (error) {
      console.error('Error loading forms:', error);
    }
  },

  async addForm(form) {
    const newForm = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      templateId: form.templateId,
      data: form.responses,
      title: form.title
    };
    
    this.forms.push(newForm);
    await this._saveForms();
    return newForm;
  },

  async updateForm(formId, updatedData) {
    const index = this.forms.findIndex(form => form.id === formId);
    if (index !== -1) {
      this.forms[index] = {
        ...this.forms[index],
        data: updatedData.responses,
        updatedAt: new Date().toISOString()
      };
      await this._saveForms();
    }
  },

  async deleteForm(formId) {
    this.forms = this.forms.filter(form => form.id !== formId);
    await this._saveForms();
  },

  getForms() {
    return this.forms;
  },

  getFormById(formId) {
    return this.forms.find(form => form.id === formId);
  },

  async _saveForms() {
    try {
      await AsyncStorage.setItem('filledForms', JSON.stringify(this.forms));
    } catch (error) {
      console.error('Error saving forms:', error);
    }
  }
};

export default function Forms() {
  const router = useRouter();
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);

  useEffect(() => {
    filledFormsStore.init();
  }, []);

  useEffect(() => {
    setForms(filledFormsStore.getForms());
  }, []);

  const handleEditForm = (form) => {
    router.push({
      pathname: '/fillForm',
      params: { 
        templateId: form.templateId,
        formId: form.id,
        isEditing: true
      }
    });
  };

  const handleDeleteForm = (formId) => {
    Alert.alert(
      'Delete Form',
      'Are you sure you want to delete this form?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            filledFormsStore.deleteForm(formId);
            setForms(filledFormsStore.getForms());
          }
        }
      ]
    );
  };

  const renderFormActions = (form) => (
    <View style={styles.formActions}>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => handleEditForm(form)}
      >
        <Ionicons name="create-outline" size={20} color="#007AFF" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => handleDeleteForm(form.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {forms.length === 0 ? (
          <Text style={styles.emptyText}>No filled forms yet</Text>
        ) : (
          forms.map((form) => {
            const templateDetails = getTemplateDetails(form.templateId);
            return (
              <View key={form.id} style={styles.formCard}>
                <TouchableOpacity
                  style={styles.formContent}
                  onPress={() => router.push({
                    pathname: '/viewFilledForm',
                    params: { formId: form.id }
                  })}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons 
                      name={getTemplateIcon(templateDetails.type)} 
                      size={24} 
                      color="#007AFF" 
                    />
                  </View>
                  <View style={styles.formInfo}>
                    <Text style={styles.formTitle}>{templateDetails.title}</Text>
                    <Text style={styles.formDate}>
                      {form.updatedAt ? 'Updated: ' : 'Filled: '}
                      {new Date(form.updatedAt || form.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </TouchableOpacity>
                {renderFormActions(form)}
              </View>
            );
          })
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  formContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  formActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    padding: 8,
    justifyContent: 'flex-end',
    gap: 8
  },
  actionButton: {
    padding: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
}); 