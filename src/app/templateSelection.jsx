import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TEMPLATE_COMPONENTS, getTemplateDetails } from '../components/templates';
import { useFormContext } from '../contexts/FormContext';

export default function TemplateSelection() {
  const { selectedMessages } = useLocalSearchParams();
  const router = useRouter();
  const { templates } = useFormContext();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const getTemplateIcon = (templateId) => {
    const icons = {
      'general': 'document-text-outline',
      'emergency': 'alert-circle-outline',
      'pediatric': 'people-outline',
      'opd': 'medical-outline'
    };
    return icons[templateId] || 'document-outline';
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
  };

  const handleSubmit = () => {
    if (!selectedTemplate) return;

    // Here you would implement the logic to process the selected messages with the template
    console.log('Selected template:', selectedTemplate);
    console.log('Selected messages:', JSON.parse(selectedMessages));

    // Navigate back to talk screen
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Choose Template</Text>
        <TouchableOpacity 
          onPress={handleSubmit}
          style={[
            styles.submitButton,
            !selectedTemplate && styles.submitButtonDisabled
          ]}
          disabled={!selectedTemplate}
        >
          <Text style={[
            styles.submitButtonText,
            !selectedTemplate && styles.submitButtonTextDisabled
          ]}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.templateList}>
        {Object.keys(TEMPLATE_COMPONENTS).map((templateId) => {
          const details = getTemplateDetails(templateId);
          const iconName = getTemplateIcon(templateId);
          
          return (
            <TouchableOpacity
              key={templateId}
              style={[
                styles.templateItem,
                selectedTemplate === templateId && styles.selectedTemplateItem
              ]}
              onPress={() => handleTemplateSelect(templateId)}
            >
              <View style={styles.templateIcon}>
                <Ionicons 
                  name={iconName} 
                  size={24} 
                  color={selectedTemplate === templateId ? "#007AFF" : "#666"} 
                />
              </View>
              <View style={styles.templateInfo}>
                <Text style={[
                  styles.templateName,
                  selectedTemplate === templateId && styles.selectedTemplateText
                ]}>
                  {details.name}
                </Text>
                <Text style={styles.templateDescription}>
                  {details.description}
                </Text>
              </View>
              {selectedTemplate === templateId && (
                <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
              )}
            </TouchableOpacity>
          );
        })}
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
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'outfit-medium',
  },
  submitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  submitButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontFamily: 'outfit-medium',
    fontSize: 16,
  },
  submitButtonTextDisabled: {
    color: '#999999',
  },
  templateList: {
    flex: 1,
    padding: 16,
  },
  templateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedTemplateItem: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  templateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 18,
    fontFamily: 'outfit-medium',
    marginBottom: 4,
  },
  selectedTemplateText: {
    color: '#007AFF',
  },
  templateDescription: {
    fontSize: 14,
    fontFamily: 'outfit-regular',
    color: '#666666',
  },
}); 