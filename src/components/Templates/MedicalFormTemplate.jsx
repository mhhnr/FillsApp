import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MedicalFormTemplate({ isTemplate = true, data = {} }) {
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.hospitalInfo}>
          <Text style={styles.hospitalName}>PARABDA MEDICAL TRUST</Text>
          <Text style={styles.hospitalSubName}>Dr. Vitthalrao Vikhe Patil Pravara Rural Hospital</Text>
          <Text style={styles.hospitalAddress}>At. Post- Loni, Tal- Rahata, Dist- Ahmednagar</Text>
          <Text style={styles.hospitalContact}>Phone: +91-24322-273600,273358,FAX:+91-2422-273442</Text>
        </View>
      </View>

      {/* Patient Information Section */}
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>UMR No.:</Text>
            <TextInput 
              style={styles.input}
              editable={!isTemplate}
              value={data.umrNo}
              placeholder="Enter UMR No."
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>MLC No.:</Text>
            <TextInput 
              style={styles.input}
              editable={!isTemplate}
              value={data.mlcNo}
              placeholder="Enter MLC No."
            />
          </View>
        </View>

        {/* Add more form fields following the same pattern */}
      </View>

      {/* Add more sections for complaints, history, etc. */}
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
  hospitalAddress: {
    fontFamily: 'outfit-regular',
    fontSize: 14,
    color: '#666666',
  },
  hospitalContact: {
    fontFamily: 'outfit-regular',
    fontSize: 14,
    color: '#666666',
  },
  section: {
    padding: 16,
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
  }
});