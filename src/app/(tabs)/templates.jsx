import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MedicalFormTemplate from '../../components/Templates/MedicalFormTemplate';

export default function Templates() {
  const router = useRouter();

  const handleFillForm = () => {
    router.push('/fillForm');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Medical Form Template</Text>
      </View>

      <MedicalFormTemplate isTemplate={true} />

      <TouchableOpacity 
        style={styles.fillButton}
        onPress={handleFillForm}
      >
        <Ionicons name="create-outline" size={24} color="#FFFFFF" />
        <Text style={styles.fillButtonText}>Fill New Form</Text>
      </TouchableOpacity>
    </View>
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
  },
  title: {
    fontFamily: 'outfit-medium',
    fontSize: 24,
  },
  fillButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  fillButtonText: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: '#FFFFFF',
  }
}); 