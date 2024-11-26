import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TEMPLATE_COMPONENTS, getTemplateComponent, getTemplateDetails } from '../../components/templates';
import { getTemplateIcon } from '../../utils/templateUtils';

export default function Templates() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);

  const handleTemplateSelect = (templateKey) => {
    setSelectedTemplate(templateKey);
  };

  const handleFillForm = () => {
    if (selectedTemplate) {
      router.push({
        pathname: '/fillForm',
        params: { templateId: selectedTemplate }
      });
    }
  };

  const renderTemplate = () => {
    if (!selectedTemplate) return null;
    
    const TemplateComponent = getTemplateComponent(selectedTemplate);
    return TemplateComponent ? <TemplateComponent isTemplate={true} /> : null;
  };

  return (
    <View style={styles.container}>
      {!selectedTemplate ? (
        <ScrollView style={styles.scrollView}>
          {Object.keys(TEMPLATE_COMPONENTS).map((key) => {
            const details = getTemplateDetails(key);

            return (
              <TouchableOpacity
                key={key}
                style={styles.templateCard}
                onPress={() => handleTemplateSelect(key)}
              >
                <View style={styles.cardIcon}>
                  <Ionicons 
                    name={getTemplateIcon(details.type)}
                    size={24} 
                    color="#007AFF" 
                  />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.templateTitle}>{details.title}</Text>
                  <Text style={styles.templateDescription} numberOfLines={2}>
                    {details.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#666" />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <>
          <View style={styles.selectedHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedTemplate(null)}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.selectedTitle}>
              {getTemplateDetails(selectedTemplate).title}
            </Text>
          </View>
          
          <View style={styles.templateContent}>
            {renderTemplate()}
          </View>
          
          <TouchableOpacity 
            style={styles.fillButton}
            onPress={handleFillForm}
          >
            <Ionicons name="create-outline" size={24} color="#FFFFFF" />
            <Text style={styles.fillButtonText}>Fill Form</Text>
          </TouchableOpacity>
        </>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontFamily: 'outfit-medium',
    fontSize: 24,
  },
  scrollView: {
    flex: 1,
    padding: 16,
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
    elevation: 2,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    marginRight: 8,
  },
  templateTitle: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    marginBottom: 4,
  },
  templateDescription: {
    fontFamily: 'outfit-regular',
    fontSize: 14,
    color: '#666666',
  },
  selectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 16,
  },
  selectedTitle: {
    fontFamily: 'outfit-medium',
    fontSize: 18,
  },
  fillButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  fillButtonText: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  loadingText: {
    fontFamily: 'outfit-regular',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    fontFamily: 'outfit-regular',
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontFamily: 'outfit-regular',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
  templateContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  }
}); 