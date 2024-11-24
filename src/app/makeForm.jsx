import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FormFieldEditor from '../components/FormFieldEditor';
import { useFormContext } from '../contexts/FormContext';
import { auth } from '../configs/FirebaseConfig';

export default function MakeForm() {
  const { saveTemplate } = useFormContext();
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [fields, setFields] = useState([]);
  const [showFieldTypes, setShowFieldTypes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fieldTypes = [
    { id: 'short_text', label: 'Short Text', icon: 'text-outline' },
    { id: 'long_text', label: 'Long Text', icon: 'document-text-outline' },
    { id: 'multiple_choice', label: 'Multiple Choice', icon: 'radio-button-on-outline' },
    { id: 'checkbox', label: 'Checkbox', icon: 'checkbox-outline' },
    { id: 'date', label: 'Date', icon: 'calendar-outline' },
    { id: 'time', label: 'Time', icon: 'time-outline' },
    { id: 'scale', label: 'Linear Scale', icon: 'options-outline' },
  ];

  const addField = (type) => {
    const newField = {
      id: Date.now().toString(),
      type,
      question: '',
      required: false,
      ...(type === 'multiple_choice' || type === 'checkbox' ? { 
        options: ['Option 1', 'Option 2'] 
      } : {}),
      ...(type === 'scale' ? {
        scaleStart: 1,
        scaleEnd: 5,
        lowLabel: '',
        highLabel: ''
      } : {}),
    };
    setFields([...fields, newField]);
    setShowFieldTypes(false);
  };

  const duplicateField = (fieldId) => {
    const fieldToDuplicate = fields.find(f => f.id === fieldId);
    if (fieldToDuplicate) {
      const duplicatedField = {
        ...fieldToDuplicate,
        id: Date.now().toString(),
        question: `${fieldToDuplicate.question} (Copy)`
      };
      setFields([...fields, duplicatedField]);
    }
  };

  const moveField = (fieldId, direction) => {
    const index = fields.findIndex(f => f.id === fieldId);
    if (index === -1) return;
    
    const newFields = [...fields];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < fields.length) {
      [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
      setFields(newFields);
    }
  };

  const updateField = (fieldId, updatedField) => {
    setFields(fields.map(field => 
      field.id === fieldId ? updatedField : field
    ));
  };

  const deleteField = (fieldId) => {
    setFields(fields.filter(field => field.id !== fieldId));
  };

  const handleSave = async () => {
    if (!formTitle.trim()) {
      Alert.alert('Error', 'Please enter a form title');
      return;
    }

    if (fields.length === 0) {
      Alert.alert('Error', 'Please add at least one field to the form');
      return;
    }

    try {
      setIsLoading(true);
      const template = {
        title: formTitle,
        description: formDescription,
        fields: fields,
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString()
      };

      await saveTemplate(template);
      Alert.alert('Success', 'Form template saved successfully');
      
      // Reset form
      setFormTitle('');
      setFormDescription('');
      setFields([]);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to save form template');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.formHeader}>
          <TextInput
            style={styles.titleInput}
            value={formTitle}
            onChangeText={setFormTitle}
            placeholder="Form Title"
            placeholderTextColor="#666666"
          />
          <TextInput
            style={styles.descriptionInput}
            value={formDescription}
            onChangeText={setFormDescription}
            placeholder="Form Description (optional)"
            placeholderTextColor="#666666"
            multiline
          />
        </View>

        {fields.map(field => (
          <FormFieldEditor
            key={field.id}
            field={field}
            onUpdate={updateField}
            onDelete={deleteField}
            onDuplicate={duplicateField}
            onMove={moveField}
          />
        ))}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowFieldTypes(!showFieldTypes)}
        >
          <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
          <Text style={styles.addButtonText}>Add Field</Text>
        </TouchableOpacity>

        {showFieldTypes && (
          <View style={styles.fieldTypesList}>
            {fieldTypes.map(type => (
              <TouchableOpacity
                key={type.id}
                style={styles.fieldTypeButton}
                onPress={() => {
                  addField(type.id);
                  setShowFieldTypes(false);
                }}
              >
                <Ionicons name={type.icon} size={24} color="#007AFF" />
                <Text style={styles.fieldTypeText}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={isLoading}
      >
        <Text style={styles.saveButtonText}>
          {isLoading ? 'Saving...' : 'Save Form'}
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
  scrollView: {
    flex: 1,
    padding: 16,
  },
  formHeader: {
    marginBottom: 24,
  },
  titleInput: {
    fontFamily: 'outfit-medium',
    fontSize: 24,
    marginBottom: 8,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  descriptionInput: {
    fontFamily: 'outfit-regular',
    fontSize: 16,
    padding: 8,
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  addFieldSection: {
    marginTop: 24,
    marginBottom: 100,
  },
  addFieldTitle: {
    fontFamily: 'outfit-medium',
    fontSize: 18,
    marginBottom: 16,
  },
  addFieldButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  addButtonText: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    marginTop: 8,
  },
  saveButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    left: 16,
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  fieldTypesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fieldTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  fieldTypeText: {
    marginLeft: 12,
    fontFamily: 'outfit-medium',
    fontSize: 16,
  },
  addFieldText: {
    marginLeft: 8,
    fontFamily: 'outfit-medium',
    fontSize: 16,
  },
});