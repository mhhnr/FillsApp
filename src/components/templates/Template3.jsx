import React from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';

export default function PediatricTemplate({ isTemplate = true, data = {}, onDataChange, readOnly = false }) {
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
          <Text style={styles.hospitalName}>PEDIATRIC ASSESSMENT</Text>
          <Text style={styles.hospitalSubName}>Child Health Record</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Child Information</Text>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Child's Name:</Text>
            <TextInput 
              style={[styles.input, readOnly && styles.readOnlyInput]}
              editable={!isTemplate && !readOnly}
              value={data.childName}
              placeholder="Child's full name"
              onChangeText={(value) => handleChange('childName', value)}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Age:</Text>
            <TextInput 
              style={[styles.input, readOnly && styles.readOnlyInput]}
              editable={!isTemplate && !readOnly}
              value={data.age}
              placeholder="Years/Months"
              onChangeText={(value) => handleChange('age', value)}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Date of Birth:</Text>
            <TextInput 
              style={[styles.input, readOnly && styles.readOnlyInput]}
              editable={!isTemplate && !readOnly}
              value={data.dob}
              placeholder="DD/MM/YYYY"
              onChangeText={(value) => handleChange('dob', value)}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Growth Parameters</Text>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Weight:</Text>
            <TextInput 
              style={[styles.input, readOnly && styles.readOnlyInput]}
              editable={!isTemplate && !readOnly}
              value={data.weight}
              placeholder="kg"
              onChangeText={(value) => handleChange('weight', value)}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Height:</Text>
            <TextInput 
              style={[styles.input, readOnly && styles.readOnlyInput]}
              editable={!isTemplate && !readOnly}
              value={data.height}
              placeholder="cm"
              onChangeText={(value) => handleChange('height', value)}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Development Milestones:</Text>
          <TextInput 
            style={[styles.input, styles.textArea, readOnly && styles.readOnlyInput]}
            editable={!isTemplate && !readOnly}
            value={data.milestones}
            placeholder="Note developmental progress"
            multiline
            numberOfLines={4}
            onChangeText={(value) => handleChange('milestones', value)}
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
    backgroundColor: '#E5F6FF',
  },
  hospitalInfo: {
    alignItems: 'center',
  },
  hospitalName: {
    fontFamily: 'outfit-bold',
    fontSize: 18,
    marginBottom: 4,
    color: '#0066CC',
  },
  hospitalSubName: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    marginBottom: 2,
    color: '#0066CC',
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
    color: '#0066CC',
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
  },
  readOnlyInput: {
    backgroundColor: '#F5F5F5',
    color: '#000000',
  }
});