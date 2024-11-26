import React from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';

export default function OPDTemplate({ isTemplate = true, data = {}, onDataChange, readOnly = false }) {
  const handleChange = (field, value) => {
    if (!isTemplate && !readOnly && onDataChange) {
      onDataChange({
        ...data,
        [field]: value
      });
    }
  };

  const CheckboxGroup = ({ title, options, prefix }) => (
    <View style={styles.checkboxGroup}>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.checkboxContainer}>
        {options.map((option, index) => (
          <View key={index} style={styles.checkboxItem}>
            <Checkbox.Android
              status={data[`${prefix}_${option}`] ? 'checked' : 'unchecked'}
              onPress={() => handleChange(`${prefix}_${option}`, !data[`${prefix}_${option}`])}
              disabled={isTemplate || readOnly}
            />
            <Text style={styles.checkboxLabel}>{option}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.hospitalName}>PRAVARA MEDICAL TRUST</Text>
        <Text style={styles.subTitle}>Dr. Vitthalrao Vikhe Patil Pravara Rural Hospital</Text>
        <Text style={styles.address}>At. Post- Loni, Tal- Rahata, Dist- Ahmednagar</Text>
        <Text style={styles.contact}>Phone: +91-24322-273600,273358</Text>
        <Text style={styles.formTitle}>OUT PATIENT RECORD (OPD)</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Basic Info */}
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>UMR No.:</Text>
            <TextInput
              style={[styles.input, readOnly && styles.readOnlyInput]}
              value={data.umrNo}
              onChangeText={(value) => handleChange('umrNo', value)}
              editable={!isTemplate && !readOnly}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>MLC No.:</Text>
            <TextInput
              style={[styles.input, readOnly && styles.readOnlyInput]}
              value={data.mlcNo}
              onChangeText={(value) => handleChange('mlcNo', value)}
              editable={!isTemplate && !readOnly}
            />
          </View>
        </View>

        {/* Patient Details */}
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Patient Name:</Text>
              <TextInput
                style={[styles.input, readOnly && styles.readOnlyInput]}
                value={data.patientName}
                onChangeText={(value) => handleChange('patientName', value)}
                editable={!isTemplate && !readOnly}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Age:</Text>
              <TextInput
                style={[styles.input, readOnly && styles.readOnlyInput]}
                value={data.age}
                onChangeText={(value) => handleChange('age', value)}
                editable={!isTemplate && !readOnly}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Sex:</Text>
              <TextInput
                style={[styles.input, readOnly && styles.readOnlyInput]}
                value={data.sex}
                onChangeText={(value) => handleChange('sex', value)}
                editable={!isTemplate && !readOnly}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Height:</Text>
              <TextInput
                style={[styles.input, readOnly && styles.readOnlyInput]}
                value={data.height}
                onChangeText={(value) => handleChange('height', value)}
                editable={!isTemplate && !readOnly}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Weight:</Text>
              <TextInput
                style={[styles.input, readOnly && styles.readOnlyInput]}
                value={data.weight}
                onChangeText={(value) => handleChange('weight', value)}
                editable={!isTemplate && !readOnly}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>BMI:</Text>
              <TextInput
                style={[styles.input, readOnly && styles.readOnlyInput]}
                value={data.bmi}
                onChangeText={(value) => handleChange('bmi', value)}
                editable={!isTemplate && !readOnly}
              />
            </View>
          </View>
        </View>

        {/* Checkboxes */}
        <CheckboxGroup
          title="Mode of Arrival (MAO)"
          options={['Ambulatory', 'Wheel Chair', 'Stretcher', 'Others']}
          prefix="mao"
        />

        <CheckboxGroup
          title="Transferred from"
          options={['Hospital', 'Scene', 'Home', 'Others']}
          prefix="transfer"
        />

        <CheckboxGroup
          title="Source of History"
          options={['Patient', 'Relative', 'Others']}
          prefix="source"
        />

        <CheckboxGroup
          title="Past History"
          options={['Nil', 'DM', 'HTN', 'Asthma', 'CAD', 'CVA', 'COPD', 'Others']}
          prefix="history"
        />

        {/* Large Text Areas */}
        <View style={styles.textAreaContainer}>
          <Text style={styles.label}>Presenting Complaints:</Text>
          <TextInput
            style={[styles.textArea, readOnly && styles.readOnlyInput]}
            multiline
            numberOfLines={4}
            value={data.complaints}
            onChangeText={(value) => handleChange('complaints', value)}
            editable={!isTemplate && !readOnly}
          />
        </View>

        <View style={styles.textAreaContainer}>
          <Text style={styles.label}>Examination Details:</Text>
          <TextInput
            style={[styles.textArea, readOnly && styles.readOnlyInput]}
            multiline
            numberOfLines={4}
            value={data.examination}
            onChangeText={(value) => handleChange('examination', value)}
            editable={!isTemplate && !readOnly}
          />
        </View>

        <View style={styles.textAreaContainer}>
          <Text style={styles.label}>Provisional Diagnosis:</Text>
          <TextInput
            style={[styles.textArea, readOnly && styles.readOnlyInput]}
            multiline
            numberOfLines={4}
            value={data.diagnosis}
            onChangeText={(value) => handleChange('diagnosis', value)}
            editable={!isTemplate && !readOnly}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#F8F9FA',
  },
  hospitalName: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 16,
    fontFamily: 'outfit-medium',
    marginBottom: 2,
  },
  address: {
    fontSize: 14,
    fontFamily: 'outfit-regular',
    color: '#666',
  },
  contact: {
    fontSize: 14,
    fontFamily: 'outfit-regular',
    color: '#666',
  },
  formTitle: {
    fontSize: 16,
    fontFamily: 'outfit-bold',
    marginTop: 8,
  },
  formContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  field: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontFamily: 'outfit-medium',
    marginBottom: 4,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    fontFamily: 'outfit-regular',
  },
  readOnlyInput: {
    backgroundColor: '#F5F5F5',
    color: '#000000',
  },
  checkboxGroup: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  checkboxLabel: {
    fontSize: 14,
    fontFamily: 'outfit-regular',
  },
  textAreaContainer: {
    marginBottom: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    fontFamily: 'outfit-regular',
    height: 100,
    textAlignVertical: 'top',
  },
}); 