import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFormContext } from '../contexts/FormContext';
import { Ionicons } from '@expo/vector-icons';

export default function ViewTemplate() {
  const { templateId } = useLocalSearchParams();
  const { templates } = useFormContext();
  const router = useRouter();

  const template = templates.find(t => t.templateId === templateId);

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
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{template.name}</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {template.fields.map((field, index) => (
          <View key={field.id} style={styles.fieldCard}>
            <Text style={styles.fieldNumber}>Question {index + 1}</Text>
            <Text style={styles.fieldLabel}>{field.label}</Text>
            <Text style={styles.fieldType}>Type: {field.type}</Text>
          </View>
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
}); 