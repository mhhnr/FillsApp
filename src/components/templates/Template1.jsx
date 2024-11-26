import React from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';

export default function GeneralMedicalTemplate({ isTemplate = true, data = {}, onDataChange }) {
  const handleChange = (field, value) => {
    if (!isTemplate && onDataChange) {
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
          <Text style={styles.hospitalName}>GENERAL MEDICAL EXAMINATION</Text>
          <Text style={styles.hospitalSubName}>Primary Care Assessment Form</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient Information</Text>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Full Name:</Text>
            <TextInput 
              style={styles.input}
              editable={!isTemplate}
              value={data.fullName}
              placeholder="Patient's full name"
              onChangeText={(value) => handleChange('fullName', value)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Age:</Text>
            <TextInput 
              style={styles.input}
              editable={!isTemplate}
              value={data.age}
              placeholder="Age"
              keyboardType="numeric"
              onChangeText={(value) => handleChange('age', value)}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Gender:</Text>
            <TextInput 
              style={styles.input}
              editable={!isTemplate}
              value={data.gender}
              placeholder="Gender"
              onChangeText={(value) => handleChange('gender', value)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Blood Pressure:</Text>
            <TextInput 
              style={styles.input}
              editable={!isTemplate}
              value={data.bloodPressure}
              placeholder="BP"
              onChangeText={(value) => handleChange('bloodPressure', value)}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Temperature:</Text>
            <TextInput 
              style={styles.input}
              editable={!isTemplate}
              value={data.temperature}
              placeholder="°F"
              onChangeText={(value) => handleChange('temperature', value)}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chief Complaints</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Present Complaints:</Text>
          <TextInput 
            style={[styles.input, styles.textArea]}
            editable={!isTemplate}
            value={data.complaints}
            placeholder="Describe current symptoms"
            multiline
            numberOfLines={4}
            onChangeText={(value) => handleChange('complaints', value)}
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
  },
  hospitalInfo: {
    alignItems: 'center',
  },
  hospitalName: {
    fontFamily: 'outfit-bold',
    fontSize: 18,
    marginBottom: 4,
  },
  hospitalSubName: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    marginBottom: 2,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    marginBottom: 12,
    color: '#007AFF',
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
    fontFamily: 'outfit-medium',
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 8,
    fontFamily: 'outfit-regular',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  }
});