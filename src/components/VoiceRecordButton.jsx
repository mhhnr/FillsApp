import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { AppIcons } from '../utils/icons';

export default function VoiceRecordButton({ isRecording, onPress }) {
  return (
    <TouchableOpacity 
      style={[styles.button, isRecording && styles.recording]} 
      onPress={onPress}
    >
      {isRecording ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={[styles.icon, isRecording && styles.recordingIcon]}>
          {AppIcons.mic}
        </Text>
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
  icon: {
    fontSize: 24,
    color: '#000000',
  },
  recordingIcon: {
    color: '#FFFFFF',
  }
}); 