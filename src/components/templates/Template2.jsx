import React from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';

export default function EmergencyTemplate({ isTemplate = true, data = {}, onDataChange, readOnly = false }) {
  const handleChange = (field, value) => {
    if (!isTemplate && !readOnly && onDataChange) {
      onDataChange({
        ...data,
        [field]: value
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.hospitalInfo}>
          <Text style={styles.hospitalName}>EMERGENCY ASSESSMENT</Text>
          <Text style={styles.hospitalSubName}>Critical Care Form</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Triage Information</Text>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Triage Level (1-5):</Text>
            <TextInput 
              style={[styles.input, readOnly && styles.readOnlyInput]}
              editable={!isTemplate && !readOnly}
              value={data.triageLevel}
              placeholder="Triage Level"
              keyboardType="numeric"
              onChangeText={(value) => handleChange('triageLevel', value)}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Arrival Time:</Text>
            <TextInput 
              style={[styles.input, readOnly && styles.readOnlyInput]}
              editable={!isTemplate && !readOnly}
              value={data.arrivalTime}
              placeholder="HH:MM"
              onChangeText={(value) => handleChange('arrivalTime', value)}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vital Signs</Text>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Blood Pressure:</Text>
            <TextInput 
              style={[styles.input, readOnly && styles.readOnlyInput]}
              editable={!isTemplate && !readOnly}
              value={data.bp}
              placeholder="mmHg"
              onChangeText={(value) => handleChange('bp', value)}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Heart Rate:</Text>
            <TextInput 
              style={[styles.input, readOnly && styles.readOnlyInput]}
              editable={!isTemplate && !readOnly}
              value={data.heartRate}
              placeholder="BPM"
              onChangeText={(value) => handleChange('heartRate', value)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Oxygen Saturation:</Text>
            <TextInput 
              style={[styles.input, readOnly && styles.readOnlyInput]}
              editable={!isTemplate && !readOnly}
              value={data.o2sat}
              placeholder="%"
              onChangeText={(value) => handleChange('o2sat', value)}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>GCS Score:</Text>
            <TextInput 
              style={[styles.input, readOnly && styles.readOnlyInput]}
              editable={!isTemplate && !readOnly}
              value={data.gcs}
              placeholder="3-15"
              keyboardType="numeric"
              onChangeText={(value) => handleChange('gcs', value)}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Chief Complaint:</Text>
          <TextInput 
            style={[styles.input, styles.textArea, readOnly && styles.readOnlyInput]}
            editable={!isTemplate && !readOnly}
            value={data.complaint}
            placeholder="Describe emergency condition"
            multiline
            numberOfLines={4}
            onChangeText={(value) => handleChange('complaint', value)}
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
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
  },
  hospitalInfo: {
    alignItems: 'center',
  },
  hospitalName: {
    fontSize: 18,
    marginBottom: 4,
    color: '#CC0000',
  },
  hospitalSubName: {
    fontSize: 16,
    marginBottom: 2,
    color: '#CC0000',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
    color: '#CC0000',
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
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  readOnlyInput: {
    backgroundColor: '#F5F5F5',
    color: '#000000',
  }
});