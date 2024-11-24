import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated'
import { Audio } from 'expo-av'

// Import Voice conditionally
let Voice;
try {
  Voice = require('@react-native-voice/voice').default;
} catch (e) {
  console.log('Voice module not available');
}

export default function Talk() {
  const [isRecording, setIsRecording] = useState(false)
  const [recording, setRecording] = useState(null)
  const [transcribedText, setTranscribedText] = useState('')
  const [isListening, setIsListening] = useState(false);

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
      if (recording) {
        console.log('Recording already exists, cleaning up...')
        await recording.stopAndUnloadAsync()
      }

      console.log('Requesting permissions...')
      const { status } = await Audio.requestPermissionsAsync()
      if (status !== 'granted') {
        console.log('Permission not granted!')
        return
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      console.log('Starting recording...')
      const newRecording = new Audio.Recording()
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
      await newRecording.startAsync()
      setRecording(newRecording)
      setIsRecording(true)
    } catch (err) {
      console.error('Failed to start recording', err)
      setIsRecording(false)
      setRecording(null)
    }
  }

  async function stopRecording() {
    try {
      if (!recording) {
        console.log('No recording to stop')
        setIsRecording(false)
        return
      }

      console.log('Stopping recording...')
      await recording.stopAndUnloadAsync()
      const uri = recording.getURI()
      console.log('Recording stopped and stored at', uri)
      
      setTranscribedText('Your speech will be transcribed here...')
      
      setRecording(null)
      setIsRecording(false)
    } catch (err) {
      console.error('Failed to stop recording', err)
      setIsRecording(false)
      setRecording(null)
    }
  }

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync()
      }
    }
  }, [recording])

  useEffect(() => {
    // Only set up listeners if Voice is available
    if (Voice) {
      Voice.onSpeechStart = onSpeechStart;
      Voice.onSpeechResults = onSpeechResults;
      Voice.onSpeechError = onSpeechError;

      return () => {
        Voice?.destroy().then(Voice?.removeAllListeners);
      };
    }
  }, []);

  const onSpeechStart = () => {
    console.log('Speech started');
  };

  const onSpeechResults = (e) => {
    if (e?.value) {
      const text = e.value[0];
      console.log('Speech result:', text);
      setTranscribedText(text);
    }
  };

  const onSpeechError = (e) => {
    console.error('Speech error:', e);
  };

  const startListening = async () => {
    try {
      await Voice.start('en-US'); // or your preferred language
      setIsListening(true);
    } catch (e) {
      console.error('Error starting voice:', e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      console.error('Error stopping voice:', e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.transcriptionContainer}>
        <TextInput
          style={styles.transcriptionText}
          value={transcribedText}
          onChangeText={setTranscribedText}
          multiline
          placeholder="Your speech will appear here..."
          placeholderTextColor="#666666"
        />
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

        {transcribedText && (
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={() => {
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
    marginTop: 40,
  },
  transcriptionText: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: '#333333',
    flex: 1,
    textAlignVertical: 'top',
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
    elevation: 3,
    shadowColor: '#000000',
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
