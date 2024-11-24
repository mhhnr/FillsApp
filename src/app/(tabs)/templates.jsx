import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useFormContext } from '../../contexts/FormContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Templates() {
  const { templates, deleteTemplate, loading } = useFormContext();
  const router = useRouter();

  const handleAddTemplate = () => {
    router.push('/makeForm');
  };

  const handleTemplateSelect = (template) => {
    router.push({
      pathname: '/viewTemplate',
      params: { templateId: template.templateId }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Templates</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddTemplate}
        >
          <Ionicons name="add-circle-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {templates.length === 0 ? (
          <Text style={styles.emptyText}>No templates yet</Text>
        ) : (
          templates.map((template) => (
            <TouchableOpacity 
              key={template.templateId} 
              style={styles.templateCard}
              onPress={() => handleTemplateSelect(template)}
            >
              <View style={styles.templateInfo}>
                <Text style={styles.templateTitle}>{template.title}</Text>
                <Text style={styles.fieldCount}>
                  {template.fields?.length || 0} fields
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#000" />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'outfit-medium',
    fontSize: 24,
  },
  addButton: {
    padding: 8,
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
  templateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  templateInfo: {
    flex: 1,
  },
  templateTitle: {
    fontFamily: 'outfit-medium',
    fontSize: 18,
    color: '#000000',
    marginBottom: 4,
  },
  fieldCount: {
    fontFamily: 'outfit-regular',
    fontSize: 14,
    color: '#666666',
  },
}); 