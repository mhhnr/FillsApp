import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { filledFormsStore } from './(tabs)/forms';
import { getTemplateComponent } from '../components/templates';

export default function ViewFilledForm() {
  const { formId } = useLocalSearchParams();
  const router = useRouter();

  const filledForm = filledFormsStore.getFormById(formId);
  
  if (!filledForm) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Form not found</Text>
      </View>
    );
  }

  // Get the appropriate template component based on templateId
  const TemplateComponent = getTemplateComponent(filledForm.templateId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Render the template with the saved data */}
      {TemplateComponent && (
        <TemplateComponent
          isTemplate={false}
          data={filledForm.data}
          readOnly={true} // Add this prop to make fields read-only
        />
      )}
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
  errorText: {
    fontFamily: 'outfit-regular',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
}); 