import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FormFieldEditor({ field, onUpdate, onDelete }) {
  return (
    <View style={styles.container}>
      <View style={styles.fieldHeader}>
        <Text style={styles.fieldType}>{field.type}</Text>
        <TouchableOpacity onPress={() => onDelete(field.id)}>
          <Ionicons name="trash-outline" size={24} color="#FF0000" />
        </TouchableOpacity>
      </View>
      
      <TextInput
        style={styles.questionInput}
        value={field.question}
        onChangeText={(text) => onUpdate(field.id, { ...field, question: text })}
        placeholder="Enter your question"
        placeholderTextColor="#666666"
      />

      {field.type === 'multiple_choice' && (
        <View style={styles.optionsContainer}>
          {field.options.map((option, index) => (
            <View key={`option-${field.id}-${index}`} style={styles.optionRow}>
              <TextInput
                style={styles.optionInput}
                value={option}
                onChangeText={(text) => {
                  const newOptions = [...field.options];
                  newOptions[index] = text;
                  onUpdate(field.id, { ...field, options: newOptions });
                }}
                placeholder={`Option ${index + 1}`}
                placeholderTextColor="#666666"
              />
              {index > 1 && (
                <TouchableOpacity onPress={() => {
                  const newOptions = field.options.filter((_, i) => i !== index);
                  onUpdate(field.id, { ...field, options: newOptions });
                }}>
                  <Ionicons name="remove-circle-outline" size={24} color="#FF0000" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          {field.options.length < 5 && (
            <TouchableOpacity 
              style={styles.addOptionButton}
              onPress={() => {
                const newOptions = [...field.options, ''];
                onUpdate(field.id, { ...field, options: newOptions });
              }}
            >
              <Text style={styles.addOptionText}>Add Option</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fieldType: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    color: '#666666',
    textTransform: 'uppercase',
  },
  questionInput: {
    fontFamily: 'outfit-regular',
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 8,
    marginBottom: 16,
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionInput: {
    flex: 1,
    fontFamily: 'outfit-regular',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  addOptionButton: {
    padding: 8,
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#000000',
    marginTop: 8,
  },
  addOptionText: {
    fontFamily: 'outfit-medium',
    color: '#000000',
  },
}); 