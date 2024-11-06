import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function FilledForms() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filled Forms</Text>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.emptyText}>No filled forms yet</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  title: {
    fontFamily: 'outfit-medium',
    fontSize: 24,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  emptyText: {
    fontFamily: 'outfit-regular',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
}); 