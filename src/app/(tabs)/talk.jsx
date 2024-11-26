import { View, Text, TouchableOpacity, StyleSheet, TextInput, Pressable, Animated as RNAnimated, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
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
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import Voice conditionally
let Voice;
try {
  Voice = require('@react-native-voice/voice').default;
} catch (e) {
  console.log('Voice module not available');
}

// Add these constants at the top of the file
const WEBSOCKET_URL = 'wss://x474gm0754.execute-api.us-east-1.amazonaws.com/dev';
const CHAT_STORAGE_KEY = '@chat_history';

export default function Talk() {
  const [isRecording, setIsRecording] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [recording, setRecording] = useState(null)
  const [message, setMessage] = useState('')
  const [selectedTexts, setSelectedTexts] = useState([])
  const [transcribedTexts, setTranscribedTexts] = useState([])
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);
  const scrollViewRef = useRef(null);
  const inputRef = useRef(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_INTERVAL = 3000; // 3 seconds

  // Add this function to scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }, []) // Remove transcribedTexts dependency since it's not needed

  // Load chat history from storage
  useEffect(() => {
    loadChatHistory();
  }, []);

  // WebSocket connection management
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const loadChatHistory = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const saveChatHistory = async (newMessages) => {
    try {
      await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    wsRef.current = new WebSocket(WEBSOCKET_URL);

    wsRef.current.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
    };

    wsRef.current.onmessage = (event) => {
      try {
        if (!event.data) throw new Error('Empty response');
        const response = JSON.parse(event.data);
        if (response?.message) {
          setTranscribedTexts(prev => [...prev, {
            id: Date.now(),
            text: response.message.trim(),
            isUser: false
          }]);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };
  };

  // Connect when user focuses the input or enters the screen
  useEffect(() => {
    if (!isConnected) {
      connectWebSocket();
    }
  }, []);

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    const trimmedMessage = inputMessage.trim();
    
    // Add user message immediately
    setTranscribedTexts(prev => [...prev, {
      id: Date.now(),
      text: trimmedMessage,
      isUser: true
    }]);

    // Connect if not connected
    if (!isConnected) {
      connectWebSocket();
    }

    // Try sending the message
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const payload = {
        action: 'sendMessage',
        message: trimmedMessage
      };
      wsRef.current.send(JSON.stringify(payload));
    }
    
    setInputMessage('');
    inputRef.current?.blur();
  };

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
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Assistant</Text>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {transcribedTexts.length === 0 ? (
          <View style={styles.emptyChat}>
            <Text style={styles.emptyChatText}>Start a conversation!</Text>
            <Text style={styles.emptyChatSubtext}>Your messages will appear here</Text>
          </View>
        ) : (
          transcribedTexts.map((message) => (
            <View 
              key={message.id} 
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessage : styles.aiMessage
              ]}
            >
              <Text style={[
                styles.messageText,
                message.isUser ? styles.userMessageText : styles.aiMessageText
              ]}>
                {message.text}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          multiline
          autoCorrect={true}
          keyboardAppearance="light"
          keyboardType="default"
          returnKeyType="send"
          enablesReturnKeyAutomatically={true}
          onFocus={() => {
            if (!isConnected) {
              connectWebSocket();
            }
            if (scrollViewRef.current) {
              scrollViewRef.current.scrollToEnd({ animated: true });
            }
          }}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !inputMessage.trim() && styles.disabledButton]}
          onPress={handleSend}
          disabled={!inputMessage.trim()}
        >
          <Ionicons name="send" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'outfit-medium',
    color: '#000000',
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messagesContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '50%',
  },
  emptyChatText: {
    fontSize: 20,
    fontFamily: 'outfit-medium',
    color: '#666',
    marginBottom: 8,
  },
  emptyChatSubtext: {
    fontSize: 16,
    fontFamily: 'outfit-regular',
    color: '#999',
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    marginLeft: '20%',
    borderTopRightRadius: 4,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    marginRight: '20%',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'outfit-regular',
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontFamily: 'outfit-regular',
    fontSize: 16,
    color: '#000000',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
})
