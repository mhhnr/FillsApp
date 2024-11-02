import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated'
import { Audio } from 'expo-av'

export default function Talk() {
  const [isRecording, setIsRecording] = useState(false)
  const [recording, setRecording] = useState(null)

  const pulseStyle = useAnimatedStyle(() => {
    if (!isRecording) return { transform: [{ scale: 1 }] }
    return {
      transform: [
        {
          scale: withRepeat(
            withSequence(
              withSpring(1.2),
              withSpring(1)
            ),
            -1,
            true
          ),
        },
      ],
    }
  })

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync()
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      )
      setRecording(recording)
      setIsRecording(true)
    } catch (err) {
      console.error('Failed to start recording', err)
    }
  }

  async function stopRecording() {
    try {
      if (!recording) return

      await recording.stopAndUnloadAsync()
      const uri = recording.getURI()
      console.log('Recording stopped and stored at', uri)
      
      setRecording(null)
      setIsRecording(false)
    } catch (err) {
      console.error('Failed to stop recording', err)
    }
  }

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync()
      }
    }
  }, [recording])

  return (
    <View style={styles.container}>
      <View style={styles.transcriptionContainer}>
        <Text style={styles.transcriptionText}>
          Your speech will appear here...
        </Text>
      </View>

      <View style={styles.controlsContainer}>
        <Animated.View style={[styles.recordButtonContainer, pulseStyle]}>
          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.recordButtonActive
            ]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <View style={[
              styles.recordButtonInner,
              isRecording && styles.recordButtonInnerActive
            ]} />
          </TouchableOpacity>
        </Animated.View>

        {/* Submit button */}
        {transcribedText && (
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={() => {
              // TODO: Handle submit functionality
              console.log('Submitting:', transcribedText)
            }}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  transcriptionContainer: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 16,
    marginBottom: 20,
    marginTop: 40, // Add some top margin for better spacing
  },
  transcriptionText: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: '#333333',
  },
  controlsContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  recordButtonContainer: {
    marginBottom: 20,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // Android shadow
    shadowColor: '#000000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recordButtonActive: {
    borderColor: '#FF0000',
  },
  recordButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000000',
  },
  recordButtonInnerActive: {
    backgroundColor: '#FF0000',
  },
  submitButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: '#000000',
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontFamily: 'outfit-medium',
    fontSize: 16,
  },
})
