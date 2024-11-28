import React, { useEffect } from 'react';
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
  
  // Debug logs
  useEffect(() => {
    console.log('Current formId:', formId);
    console.log('Found filled form:', filledForm);
    if (filledForm) {
      console.log('Template code:', filledForm.templateCode);
      const template = getTemplateComponent(filledForm.templateCode);
      console.log('Found template:', template ? 'Yes' : 'No');
    }
  }, [formId, filledForm]);

  // Get template component - make sure we're using lowercase for consistency
  const TemplateComponent = filledForm ? 
    getTemplateComponent(filledForm.templateCode.toLowerCase()) : null;

  const handleShare = async () => {
    if (!filledForm) return;
    const success = await generateAndSharePDF(filledForm);
    if (!success) {
      Alert.alert('Error', 'Failed to generate or share PDF');
    }
  };

  if (!filledForm) {
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

  if (!TemplateComponent) {
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
          <Text style={styles.errorText}>
            Template not found: {filledForm.templateCode}
          </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'outfit-medium',
    marginLeft: 8,
    color: '#000000',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  errorText: {
    fontFamily: 'outfit-regular',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
});