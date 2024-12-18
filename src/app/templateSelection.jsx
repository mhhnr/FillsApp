import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TEMPLATE_COMPONENTS, getTemplateDetails } from '../components/templates';
import { getTemplateIcon } from '../utils/templateUtils';
import { filledFormsService } from '../aws/api/filledForms';
import { AppIcons } from '../utils/icons';

export default function TemplateSelection() {
  const { selectedMessages } = useLocalSearchParams();
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
  };

  const handleSubmit = async () => {
    if (!selectedTemplate) return;

    try {
      setLoading(true);
      
      console.log('Received message:', selectedMessages);

      const response = await filledFormsService.createFilledForm({
        templateCode: selectedTemplate,
        conversationText: selectedMessages,
        templateFields: TEMPLATE_COMPONENTS[selectedTemplate].TEMPLATE_FIELDS
      });

      console.log('API Response:', response);

      if (response && response.data) {
        const formData = {
          patientInfo: {
            fullName: response.data.patientInfo?.fullName || '',
            age: response.data.patientInfo?.age || '',
            gender: response.data.patientInfo?.gender || ''
          },
          vitalSigns: {
            temperature: response.data.vitalSigns?.temperature || '',
            bloodPressure: response.data.vitalSigns?.bloodPressure || '',
            heartRate: response.data.vitalSigns?.heartRate || ''
          }
        };

        console.log('Form data being passed:', formData);

        router.push({
          pathname: '/fillForm',
          params: {
            templateId: selectedTemplate,
            initialData: JSON.stringify(formData)
          }
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error creating form:', error);
      Alert.alert('Error', 'Failed to process the form data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.icon}>{AppIcons.back}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Select Template</Text>
        <TouchableOpacity 
          style={[
            styles.submitButton,
            (!selectedTemplate || loading) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!selectedTemplate || loading}
        >
          <Text style={[
            styles.submitButtonText,
            (!selectedTemplate || loading) && styles.submitButtonTextDisabled
          ]}>
            {loading ? 'Processing...' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.templateList}>
        {Object.keys(TEMPLATE_COMPONENTS).map((templateId) => {
          const details = getTemplateDetails(templateId);
          const isSelected = selectedTemplate === templateId;

          return (
            <TouchableOpacity
              key={templateId}
              style={[
                styles.templateItem,
                isSelected && styles.selectedTemplateItem
              ]}
              onPress={() => handleTemplateSelect(templateId)}
            >
              <View style={styles.templateIcon}>
                <Text style={styles.icon}>{getTemplateIcon(details.type)}</Text>
              </View>
              <View style={styles.templateInfo}>
                <Text style={[
                  styles.templateName,
                  isSelected && styles.selectedTemplateText
                ]}>
                  {details.title}
                </Text>
                <Text style={styles.templateDescription}>
                  {details.description}
                </Text>
              </View>
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
  icon: {
    fontSize: 24,
    color: '#007AFF',
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