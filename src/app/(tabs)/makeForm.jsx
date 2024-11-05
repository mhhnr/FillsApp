import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FormFieldEditor from '../../components/FormFieldEditor';
import { useFormContext } from '../../contexts/FormContext';

export default function MakeForm() {
  const { saveForm } = useFormContext();
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [fields, setFields] = useState([]);

  const addField = (type) => {
    const newField = {
      id: Date.now().toString(),
      type,
      question: '',
      required: false,
      ...(type === 'multiple_choice' ? { options: ['Option 1', 'Option 2'] } : {})
    };
    setFields([...fields, newField]);
  };

  const updateField = (fieldId, updatedField) => {
    setFields(fields.map(field => 
      field.id === fieldId ? updatedField : field
    ));
  };

  const deleteField = (fieldId) => {
    setFields(fields.filter(field => field.id !== fieldId));
  };

  const handleSave = () => {
    if (!formTitle.trim()) {
      alert('Please enter a form title');
      return;
    }
    
    const newForm = {
      id: Date.now().toString(),
      title: formTitle,
      description: formDescription,
      fields,
      createdAt: new Date().toISOString(),
    };
    
    saveForm(newForm);
    setFormTitle('');
    setFormDescription('');
    setFields([]);
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
          />
        ))}

        <View style={styles.addFieldSection}>
          <Text style={styles.addFieldTitle}>Add Field</Text>
          <View style={styles.addFieldButtons}>
            <TouchableOpacity 
              style={styles.addFieldButton}
              onPress={() => addField('short_text')}
            >
              <Ionicons name="text-outline" size={24} color="#000000" />
              <Text style={styles.addFieldButtonText}>Short Text</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.addFieldButton}
              onPress={() => addField('long_text')}
            >
              <Ionicons name="document-text-outline" size={24} color="#000000" />
              <Text style={styles.addFieldButtonText}>Long Text</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.addFieldButton}
              onPress={() => addField('multiple_choice')}
            >
              <Ionicons name="radio-button-on-outline" size={24} color="#000000" />
              <Text style={styles.addFieldButtonText}>Multiple Choice</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Save Form</Text>
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
  addFieldButton: {
    flex: 1,
    minWidth: 100,
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addFieldButtonText: {
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
});