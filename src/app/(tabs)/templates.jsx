import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { TEMPLATE_COMPONENTS, getTemplateComponent, getTemplateDetails } from '../../components/templates';
import { getTemplateIcon } from '../../utils/templateUtils';
import { AppIcons } from '../../utils/icons';
import BackButton from '../../components/BackButton';

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
                  <Text style={styles.icon}>{AppIcons.document}</Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.templateTitle}>{details.title}</Text>
                  <Text style={styles.templateDescription} numberOfLines={2}>
                    {details.description}
                  </Text>
                </View>
                <Text style={styles.chevronIcon}>{AppIcons.back}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <>
          <View style={styles.selectedHeader}>
            <BackButton />
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
            <Text style={styles.icon}>{AppIcons.edit}</Text>
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
    fontSize: 16,
    marginBottom: 4,
  },
  templateDescription: {
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
  selectedTitle: {
    fontSize: 18,
    marginLeft: 16,
    flex: 1,
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
    fontSize: 16,
    color: '#FFFFFF',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
  templateContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  icon: {
    fontSize: 24,
    color: '#007AFF',
  },
  chevronIcon: {
    fontSize: 24,
    color: '#666',
  },
}); 