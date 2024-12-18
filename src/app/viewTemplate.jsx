import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFormContext } from '../contexts/FormContext';
import FormFieldEditor from '../components/FormFieldEditor';
import { AppIcons } from '../utils/icons';

export default function ViewTemplate() {
  const { templateId } = useLocalSearchParams();
  const { templates, updateTemplate } = useFormContext();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTemplate, setEditedTemplate] = useState(null);

  const template = templates.find(t => t.templateId === templateId);

  const handleSave = async () => {
    try {
      await updateTemplate(templateId, editedTemplate);
      Alert.alert('Success', 'Template updated successfully');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update template');
    }
  };

  if (!template) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Template not found</Text>
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
          <Text style={styles.icon}>{AppIcons.back}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{template.name}</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            if (isEditing) {
              handleSave();
            } else {
              setEditedTemplate({...template});
              setIsEditing(true);
            }
          }}
        >
          <Text style={styles.icon}>
            {isEditing ? AppIcons.save : AppIcons.edit}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {template.fields.map((field, index) => (
          isEditing ? (
            <FormFieldEditor
              key={field.id}
              field={field}
              onUpdate={(fieldId, updatedField) => {
                const newFields = [...editedTemplate.fields];
                const fieldIndex = newFields.findIndex(f => f.id === fieldId);
                newFields[fieldIndex] = updatedField;
                setEditedTemplate({...editedTemplate, fields: newFields});
              }}
            />
          ) : (
            <View key={field.id} style={styles.fieldCard}>
              <Text style={styles.fieldNumber}>Question {index + 1}</Text>
              <Text style={styles.fieldLabel}>{field.question}</Text>
              <Text style={styles.fieldType}>Type: {field.type}</Text>
              {field.required && (
                <Text style={styles.requiredBadge}>Required</Text>
              )}
            </View>
          )
        ))}
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
  icon: {
    fontSize: 24,
    color: '#000',
  },
  editButton: {
    marginLeft: 'auto',
    padding: 8,
  },
  title: {
    fontFamily: 'outfit-medium',
    fontSize: 24,
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  fieldCard: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  fieldNumber: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  fieldLabel: {
    fontFamily: 'outfit-medium',
    fontSize: 18,
    marginBottom: 8,
  },
  fieldType: {
    fontFamily: 'outfit-regular',
    fontSize: 14,
    color: '#666666',
  },
  requiredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF0000',
    color: '#FFFFFF',
    padding: 4,
    borderRadius: 4,
    fontSize: 12,
    fontFamily: 'outfit-medium',
  }
}); 