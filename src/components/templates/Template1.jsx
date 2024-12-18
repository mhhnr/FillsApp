import React from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';

export const TEMPLATE_FIELDS = {
  patientInfo: {
    fullName: {
      type: 'text',
      label: 'Full Name',
      required: true,
      placeholder: "Patient's full name"
    },
    age: {
      type: 'number',
      label: 'Age',
      required: true,
      placeholder: 'Age'
    },
    gender: {
      type: 'text',
      label: 'Gender',
      required: true,
      placeholder: 'Gender'
    }
  },
  vitalSigns: {
    temperature: {
      type: 'text',
      label: 'Temperature',
      required: true,
      placeholder: '°C'
    },
    bloodPressure: {
      type: 'text',
      label: 'Blood Pressure',
      required: true,
      placeholder: 'mmHg'
    },
    heartRate: {
      type: 'text',
      label: 'Heart Rate',
      required: true,
      placeholder: 'bpm'
    }
  }
};

export default function Template1({ data = {}, onDataChange, readOnly = false }) {
  // Ensure we have the complete data structure
  const formData = {
    patientInfo: {
      fullName: data?.patientInfo?.fullName || '',
      age: data?.patientInfo?.age?.toString() || '',
      gender: data?.patientInfo?.gender || ''
    },
    vitalSigns: {
      temperature: data?.vitalSigns?.temperature?.toString() || '',
      bloodPressure: data?.vitalSigns?.bloodPressure || '',
      heartRate: data?.vitalSigns?.heartRate?.toString() || ''
    }
  };

  console.log('Template1 using data:', formData);

  const handleChange = (section, field, value) => {
    if (onDataChange && !readOnly) {
      const newData = {
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value
        }
      };
      console.log('Template1 updating data:', newData);
      onDataChange(newData);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient Information</Text>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, readOnly && styles.readOnlyInput]}
            value={formData.patientInfo.fullName}
            onChangeText={(text) => handleChange('patientInfo', 'fullName', text)}
            placeholder="Patient's full name"
            editable={!readOnly}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={[styles.input, readOnly && styles.readOnlyInput]}
            value={formData.patientInfo.age}
            onChangeText={(text) => handleChange('patientInfo', 'age', text)}
            placeholder="Age"
            keyboardType="numeric"
            editable={!readOnly}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Gender</Text>
          <TextInput
            style={[styles.input, readOnly && styles.readOnlyInput]}
            value={formData.patientInfo.gender}
            onChangeText={(text) => handleChange('patientInfo', 'gender', text)}
            placeholder="Gender"
            editable={!readOnly}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vital Signs</Text>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Temperature</Text>
          <TextInput
            style={[styles.input, readOnly && styles.readOnlyInput]}
            value={formData.vitalSigns.temperature}
            onChangeText={(text) => handleChange('vitalSigns', 'temperature', text)}
            placeholder="Temperature (°C)"
            editable={!readOnly}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Blood Pressure</Text>
          <TextInput
            style={[styles.input, readOnly && styles.readOnlyInput]}
            value={formData.vitalSigns.bloodPressure}
            onChangeText={(text) => handleChange('vitalSigns', 'bloodPressure', text)}
            placeholder="Blood Pressure (mmHg)"
            editable={!readOnly}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Heart Rate</Text>
          <TextInput
            style={[styles.input, readOnly && styles.readOnlyInput]}
            value={formData.vitalSigns.heartRate}
            onChangeText={(text) => handleChange('vitalSigns', 'heartRate', text)}
            placeholder="Heart Rate (bpm)"
            editable={!readOnly}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  readOnlyInput: {
    backgroundColor: '#F5F5F5',
    color: '#666666',
  }
});