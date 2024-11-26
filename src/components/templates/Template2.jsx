import React from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';

export default function EmergencyTemplate({ isTemplate = true, data = {} }) {
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
              style={styles.input}
              editable={!isTemplate}
              value={data.triageLevel}
              placeholder="Triage Level"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Arrival Time:</Text>
            <TextInput 
              style={styles.input}
              editable={!isTemplate}
              value={data.arrivalTime}
              placeholder="HH:MM"
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
              style={styles.input}
              editable={!isTemplate}
              value={data.bp}
              placeholder="mmHg"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Heart Rate:</Text>
            <TextInput 
              style={styles.input}
              editable={!isTemplate}
              value={data.heartRate}
              placeholder="BPM"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Oxygen Saturation:</Text>
            <TextInput 
              style={styles.input}
              editable={!isTemplate}
              value={data.o2sat}
              placeholder="%"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>GCS Score:</Text>
            <TextInput 
              style={styles.input}
              editable={!isTemplate}
              value={data.gcs}
              placeholder="3-15"
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chief Complaint</Text>
        <View style={styles.field}>
          <TextInput 
            style={[styles.input, styles.textArea]}
            editable={!isTemplate}
            value={data.complaint}
            placeholder="Describe emergency condition"
            multiline
            numberOfLines={4}
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
    fontFamily: 'outfit-bold',
    fontSize: 18,
    marginBottom: 4,
    color: '#CC0000',
  },
  hospitalSubName: {
    fontFamily: 'outfit-medium',
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
    fontFamily: 'outfit-medium',
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