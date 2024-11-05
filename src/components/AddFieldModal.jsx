import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

export default function AddFieldModal({ visible, onClose, onAdd }) {
  const [fieldType, setFieldType] = useState('text');
  const [fieldLabel, setFieldLabel] = useState('');

  const fieldTypes = [
    { label: 'Text Input', value: 'text' },
    { label: 'Number', value: 'number' },
    { label: 'Radio Buttons', value: 'radio' },
    { label: 'Checkbox', value: 'checkbox' },
    { label: 'Date', value: 'date' },
  ];

  const handleAdd = () => {
    if (fieldLabel.trim()) {
      onAdd({
        id: Date.now().toString(),
        type: fieldType,
        label: fieldLabel,
      });
      setFieldLabel('');
      setFieldType('text');
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Field</Text>
          
          <Text style={styles.label}>Field Label</Text>
          <TextInput
            style={styles.input}
            value={fieldLabel}
            onChangeText={setFieldLabel}
            placeholder="Enter field label"
          />

          <Text style={styles.label}>Field Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={fieldType}
              onValueChange={setFieldType}
              style={styles.picker}
            >
              {fieldTypes.map((type) => (
                <Picker.Item key={type.value} label={type.label} value={type.value} />
              ))}
            </Picker>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAdd} style={[styles.button, styles.addButton]}>
              <Text style={[styles.buttonText, styles.addButtonText]}>Add Field</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontFamily: 'outfit-medium',
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontFamily: 'outfit-regular',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 20,
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  addButton: {
    backgroundColor: '#000000',
  },
  buttonText: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
  },
}); 