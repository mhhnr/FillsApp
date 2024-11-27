import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getTemplateIcon } from '../../utils/templateUtils';
import { getTemplateDetails } from '../../components/templates';
import { useFormDataContext } from '../../contexts/FormDataContext';

export default function Forms() {
  const router = useRouter();
  const { forms, getForms, deleteForm, loading } = useFormDataContext();

  useEffect(() => {
    getForms();
  }, []);

  const handleDelete = (formId, formTitle) => {
    Alert.alert(
      'Delete Form',
      `Are you sure you want to delete "${formTitle}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteForm(formId);
              // Form will be removed from the list automatically through context
            } catch (error) {
              Alert.alert('Error', 'Failed to delete form');
            }
          }
        }
      ]
    );
  };

  const renderForm = (form) => {
    const templateDetails = getTemplateDetails(form.templateId);
    const icon = getTemplateIcon(templateDetails.type);
    
    const formTitle = form.data?.fullName || 
                     form.data?.patientName || 
                     form.data?.childName || 
                     `${templateDetails.title} Form`;

    const formDate = form.createdAt ? 
      new Date(form.createdAt * 1000).toLocaleDateString() : 
      'Invalid Date';

    return (
      <View key={form.formId} style={styles.formCardContainer}>
        <TouchableOpacity
          style={styles.formCard}
          onPress={() => router.push({
            pathname: '/viewFilledForm',
            params: { formId: form.formId }
          })}
        >
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={24} color="#007AFF" />
          </View>
          <View style={styles.formInfo}>
            <Text style={styles.formTitle}>{formTitle}</Text>
            <Text style={styles.formDate}>{formDate}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(form.formId, formTitle)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#007AFF" />
      ) : forms.length === 0 ? (
        <Text style={styles.emptyText}>No forms filled yet</Text>
      ) : (
        forms.map(form => renderForm(form))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loader: {
    marginTop: 20,
  },
  formCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
    backgroundColor: '#FFFFFF',
  },
  formCard: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
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
  deleteButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'outfit-regular',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
}); 