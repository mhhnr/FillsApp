import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { filledFormsStore } from './(tabs)/forms';
import { getTemplateComponent } from '../components/templates';
import { generateAndSharePDF } from '../utils/pdfGenerator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ViewFilledForm() {
  const { formId } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const filledForm = filledFormsStore.getFormById(formId);
  const TemplateComponent = filledForm ? getTemplateComponent(filledForm.templateId) : null;

  const handleShare = async () => {
    if (!filledForm) return;
    const success = await generateAndSharePDF(filledForm);
    if (!success) {
      Alert.alert('Error', 'Failed to generate or share PDF');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View 
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            height: 60 + insets.top
          }
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="share-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View 
        style={[
          styles.contentContainer,
          {
            paddingTop: 60 + insets.top // Adjust content padding based on header height
          }
        ]}
      >
        {TemplateComponent && (
          <TemplateComponent
            isTemplate={false}
            data={filledForm.data}
            readOnly={true}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end', // Align items to bottom of header
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
}); 