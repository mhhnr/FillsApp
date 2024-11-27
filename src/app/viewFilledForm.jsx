import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, SafeAreaView, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getTemplateComponent } from '../components/templates';
import { generateAndSharePDF } from '../utils/pdfGenerator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFormDataContext } from '../contexts/FormDataContext';

export default function ViewFilledForm() {
  const { formId } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { forms } = useFormDataContext();

  const filledForm = forms.find(form => form.formId === formId);
  const TemplateComponent = filledForm ? getTemplateComponent(filledForm.templateId) : null;

  const handleShare = async () => {
    if (!filledForm) return;
    const success = await generateAndSharePDF(filledForm);
    if (!success) {
      Alert.alert('Error', 'Failed to generate or share PDF');
    }
  };

  if (!filledForm || !TemplateComponent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, { marginTop: insets.top }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.errorText}>Form not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { marginTop: insets.top }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Ionicons name="share-outline" size={24} color="#000000" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.contentContainer}>
        <TemplateComponent 
          data={filledForm.data}
          readOnly={true}
          isTemplate={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    zIndex: 1000,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  contentContainer: {
    flex: 1,
  },
  backButton: {
    padding: 8,
  },
  shareButton: {
    padding: 8,
  },
  errorText: {
    fontFamily: 'outfit-regular',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
}); 