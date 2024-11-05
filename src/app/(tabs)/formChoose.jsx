import { View, Text, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import FormTemplate from '../../components/FormTemplate';

const sampleTemplates = [
  {
    id: '1',
    name: 'Patient Assessment Form',
    fields: [
      { id: '1', type: 'text', label: 'Name' },
      { id: '2', type: 'date', label: 'Date of Birth' },
      { id: '3', type: 'text', label: 'Occupation' },
    ],
  },
];

export default function FormChoose() {
  const handleSelectTemplate = (template) => {
    console.log('Selected template:', template);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Template</Text>
      <ScrollView style={styles.scrollView}>
        {sampleTemplates.map((template) => (
          <FormTemplate
            key={template.id}
            template={template}
            onSelect={handleSelectTemplate}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontFamily: 'outfit-medium',
    fontSize: 24,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
});