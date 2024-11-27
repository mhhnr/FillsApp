import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function VoiceRecordButton({ isRecording, onPress }) {
  return (
    <TouchableOpacity 
      style={[styles.button, isRecording && styles.recording]} 
      onPress={onPress}
    >
      {isRecording ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Ionicons name="mic" size={24} color={isRecording ? "#FFFFFF" : "#000000"} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recording: {
    backgroundColor: '#FF3B30',
  },
}); 