import { View, Text, TouchableOpacity, StyleSheet, TextInput, Pressable, Animated as RNAnimated, ScrollView } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import { Audio } from 'expo-av'
import { Ionicons } from '@expo/vector-icons'
import { PanGestureHandler, State } from 'react-native-gesture-handler'

// Import Voice conditionally
let Voice;
try {
  Voice = require('@react-native-voice/voice').default;
} catch (e) {
  console.log('Voice module not available');
}

export default function Talk() {
  const [isRecording, setIsRecording] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [recording, setRecording] = useState(null)
  const [message, setMessage] = useState('')
  const [selectedTexts, setSelectedTexts] = useState([])
  const [transcribedTexts, setTranscribedTexts] = useState([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)

  // Add ref for scrolling
  const scrollViewRef = useRef(null)

  // Add this function to scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }, [transcribedTexts]) // Scroll whenever transcribed texts change

  const pulseStyle = useAnimatedStyle(() => {
    if (!isRecording) return { transform: [{ scale: 1 }] }
    return {
      transform: [{
        scale: withRepeat(
          withSequence(
            withSpring(1.2),
            withSpring(1)
          ),
          -1,
          true
        ),
      }],
    }
  })

  const handlePressIn = async () => {
    if (!isRecording) {
      await startRecording()
    }
  }

  const handlePressOut = async () => {
    if (isRecording && !isLocked) {
      await stopRecording()
    }
  }

  const toggleLock = async () => {
    if (isLocked) {
      // If we're unlocking, stop the recording
      setIsLocked(false)
      await stopRecording()
    } else {
      // If we're locking, just update the lock state
      setIsLocked(true)
    }
  }

  async function startRecording() {
    try {
      // Clean up any existing recording first
      if (recording) {
        await recording.stopAndUnloadAsync().catch(() => {/* ignore cleanup errors */})
      }

      // Ensure permissions are granted
      const { status } = await Audio.requestPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant microphone access to record audio.')
        return
      }

      // Set up audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      // Create new recording instance
      const newRecording = new Audio.Recording()
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
      await newRecording.startAsync()
      
      setRecording(newRecording)
      setIsRecording(true)
    } catch (err) {
      console.error('Failed to start recording', err)
      setRecording(null)
      setIsRecording(false)
    }
  }

  async function stopRecording() {
    try {
      if (!recording) return
      
      setIsRecording(false)
      setIsLocked(false)
      
      await recording.stopAndUnloadAsync()
      const uri = recording.getURI()
      
      // Here you would integrate with Amazon Transcribe
      const placeholderText = "This is a transcribed text from Amazon Transcribe"
      setTranscribedTexts([...transcribedTexts, placeholderText])
      
      setRecording(null)
    } catch (err) {
      console.error('Failed to stop recording', err)
      // Clean up state even if there's an error
      setRecording(null)
      setIsRecording(false)
      setIsLocked(false)
    }
  }

  const handleTextSelection = (index) => {
    if (!isSelectionMode) return
    
    const newSelection = [...selectedTexts]
    const textIndex = newSelection.indexOf(index)
    
    if (textIndex === -1) {
      newSelection.push(index)
    } else {
      newSelection.splice(textIndex, 1)
    }
    
    setSelectedTexts(newSelection)
  }

  const handleSubmit = () => {
    // Here you would integrate with Amazon Polly and Lambda
    console.log('Selected texts:', selectedTexts.map(index => transcribedTexts[index]))
    setSelectedTexts([])
    setIsSelectionMode(false)
  }

  const sendMessage = () => {
    if (message.trim()) {
      setTranscribedTexts([...transcribedTexts, message])
      setMessage('')
    }
  }

  // Add cleanup on component unmount
  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync()
      }
    }
  }, [recording])

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={true}
      >
        {transcribedTexts.map((text, index) => (
          <View key={index} style={styles.messageContainer}>
            <Text style={styles.messageText}>{text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
          multiline
        />
        {message.length > 0 ? (
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={sendMessage}
          >
            <Ionicons name="send" size={24} color="#007AFF" />
          </TouchableOpacity>
        ) : (
          <View style={styles.recordControls}>
            {isRecording && (
              <TouchableOpacity
                style={[styles.lockButton, isLocked && styles.lockButtonActive]}
                onPress={toggleLock}
              >
                <Ionicons 
                  name={isLocked ? "lock-closed" : "lock-open"} 
                  size={20} 
                  color="#007AFF" 
                />
              </TouchableOpacity>
            )}
            <Animated.View style={[styles.recordButtonContainer, pulseStyle]}>
              <TouchableOpacity
                style={[styles.recordButton, isRecording && styles.recordButtonActive]}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
              >
                <Ionicons 
                  name={isRecording ? "mic" : "mic-outline"} 
                  size={24} 
                  color={isRecording ? "#FF0000" : "#007AFF"} 
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messagesContainer: {
    flex: 1,
    width: '100%',
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 80, // Add some bottom padding to prevent last message from being hidden
  },
  messageContainer: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  recordButtonContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonActive: {
    backgroundColor: '#FFE0E0',
  },
  sendButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    margin: 16,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  recordingIndicator: {
    position: 'absolute',
    bottom: 80,
    right: 0,
    width: 150,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 16,
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  recordingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'outfit-medium',
    marginBottom: 4,
  },
  recordingSubText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'outfit-regular',
  },
  recordControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lockButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  lockButtonActive: {
    backgroundColor: '#FFE0E0',
  },
})
