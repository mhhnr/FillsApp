import { View, Text, TouchableOpacity, StyleSheet, TextInput, Pressable, Animated as RNAnimated, ScrollView, KeyboardAvoidingView, Platform, Alert, PermissionsAndroid, Switch } from 'react-native'
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import { Audio } from 'expo-av'
import { AppIcons } from '../../utils/icons';
import { PanGestureHandler, State, TapGestureHandler } from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectionOverlay from '../../components/SelectionOverlay';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Voice from '@react-native-voice/voice';

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
  const [selectedMessages, setSelectedMessages] = useState([]);
  const wsRef = useRef(null);
  const scrollViewRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();
  const [shouldConnect, setShouldConnect] = useState(false);
  const doubleTapRef = useRef(null);
  const transcriptionIntervalRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [allowResponses, setAllowResponses] = useState(true);

  // Single WebSocket connection when component mounts
  useEffect(() => {
    // Log to verify the effect is running
    console.log('Component mounted, attempting to focus input');

    // Focus the input with a slight delay
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        console.log('Input focused');
      } else {
        console.log('Input ref is null');
      }
    }, 100);

    // Only connect if not already connected
    if (!wsRef.current) {
      wsRef.current = new WebSocket(WEBSOCKET_URL);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
      };

      wsRef.current.onmessage = (event) => {
        try {
          // Check if event.data is empty or invalid
          if (!event.data || event.data.trim() === '') {
            return; // Silently ignore empty messages
          }
          
          const response = JSON.parse(event.data);
          if (response.message) {
            const newMessage = {
              id: Date.now().toString(),
              text: response.message,
              isUser: false,
              timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, newMessage]);
          }
        } catch (error) {
          // Only log in development, not in production
          if (__DEV__) {
            console.log('Received invalid WebSocket message:', event.data);
          }
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        wsRef.current = null;
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        wsRef.current = null;
      };
    }

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []); // Empty dependency array - only runs on mount/unmount

  useEffect(() => {
    return () => {
      // Cleanup on component unmount
      if (transcriptionIntervalRef.current) {
        clearInterval(transcriptionIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    checkPermission();

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const checkPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'This app needs access to your microphone to transcribe speech.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasPermission(true);
        } else {
          setHasPermission(false);
          Alert.alert(
            'Permission Denied',
            'You need to grant microphone permission to use voice recognition.'
          );
        }
      } catch (err) {
        console.warn(err);
        setHasPermission(false);
      }
    } else {
      setHasPermission(true);
    }
  };

  const onSpeechStart = () => {
    console.log('Speech started');
  };

  const onSpeechRecognized = () => {
    console.log('Speech recognized');
  };

  const onSpeechEnd = () => {
    setIsListening(false);
    console.log('Speech ended');
  };

  const onSpeechError = (error) => {
    console.log('Speech error:', error);
    setIsListening(false);
    if (Platform.OS === 'android') {
      switch (error.error.message) {
        case '7':
          Alert.alert('Error', 'No speech was recognized. Please try again.');
          break;
        case '9':
          Alert.alert('Error', 'Permission denied. Please enable microphone permission.');
          break;
        default:
          Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    }
  };

  const onSpeechResults = (event) => {
    const text = event.value[0];
    setRecognizedText(text);
    console.log('Speech results:', text);
  };

  const startListening = async () => {
    if (!hasPermission) {
      await checkPermission();
      if (!hasPermission) return;
    }

    try {
      await Voice.start('en-US');
      setIsListening(true);
    } catch (error) {
      console.error('Error starting voice:', error);
      Alert.alert(
        'Error',
        'Failed to start voice recognition. Please try again.'
      );
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping voice:', error);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleInputChange = (text) => {
    setInputMessage(text);
  };

  const handleSend = async () => {
    if (recognizedText.trim() === '') return;

    const newMessage = {
      id: Date.now().toString(),
      text: recognizedText,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setRecognizedText('');

    // Scroll to bottom after sending message
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    if (allowResponses && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        action: 'sendMessage',
        message: recognizedText
      }));
    }
  };

  // Add this effect to handle auto-scrolling when receiving messages
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleLongPress = (messageId) => {
    setSelectedMessages([messageId]);
  };

  const handleMessagePress = (messageId) => {
    if (selectedMessages.length > 0) {
      setSelectedMessages(prev => 
        prev.includes(messageId)
          ? prev.filter(id => id !== messageId)
          : [...prev, messageId]
      );
    }
  };

  const handleCancelSelection = () => {
    setSelectedMessages([]);
  };

  const handleChooseTemplate = () => {
    // Get the actual text content of selected messages
    const selectedContent = selectedMessages.map(messageId => {
      const message = messages.find(m => m.id === messageId);
      return message?.text || ''; // Make sure we're accessing the text property
    }).join(' ');

    console.log('Selected message content:', selectedContent);

    if (!selectedContent) {
      Alert.alert('Error', 'Please select a message first');
      return;
    }

    // Navigate with the actual message content
    router.push({
      pathname: '/templateSelection',
      params: {
        selectedMessages: selectedContent // Send the actual text content
      }
    });
  };

  const startRecording = async () => {
    try {
      console.log('Starting recording...');
      setIsRecording(true);
      
      // Clear any existing interval just in case
      if (transcriptionIntervalRef.current) {
        clearInterval(transcriptionIntervalRef.current);
      }
      
      // Start new live transcription simulation
      transcriptionIntervalRef.current = setInterval(() => {
        setInputMessage(prev => prev + ' live...');
      }, 1000);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      console.log('Stopping recording...');
      
      // Clear the interval
      if (transcriptionIntervalRef.current) {
        clearInterval(transcriptionIntervalRef.current);
        transcriptionIntervalRef.current = null;
      }
      
      setIsRecording(false);
      setIsLocked(false);
      
      // Only send if there's actual content
      if (inputMessage.trim()) {
        await handleSend();
      }
      
      // Clear the input after sending
      setInputMessage('');
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const handleMicPressIn = async () => {
    console.log('Mic pressed in');
    if (!isLocked && !isRecording) {
      await startRecording();
    }
  };

  const handleMicPressOut = async () => {
    console.log('Mic pressed out');
    if (!isLocked && isRecording) {
      await stopRecording();
    }
  };

  const handleDoubleTap = () => {
    console.log('Double tap detected');
    setIsLocked(prev => !prev);
    if (!isLocked) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const handleToggleResponses = () => {
    setAllowResponses(prev => !prev);
  };

  // Memoize callbacks
  const handleSendMessage = useCallback(() => {
    if (recognizedText.trim()) {
      setMessages(prev => [...prev, { text: recognizedText.trim(), sender: 'user' }]);
      setRecognizedText('');
    }
  }, [recognizedText]);

  // Memoize expensive computations
  const sortedMessages = useMemo(() => {
    return messages.sort((a, b) => b.timestamp - a.timestamp);
  }, [messages]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.toggleContainer}>
          <Text>Allow Responses:</Text>
          <Switch
            value={allowResponses}
            onValueChange={handleToggleResponses}
          />
        </View>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          {selectedMessages.length > 0 && (
            <SelectionOverlay
              selectedCount={selectedMessages.length}
              onCancel={handleCancelSelection}
              onChooseTemplate={handleChooseTemplate}
            />
          )}
          
          <View style={{ flex: 1 }}>
            <ScrollView
              ref={scrollViewRef}
              style={styles.messageContainer}
              contentContainerStyle={styles.messageContent}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.map((msg, index) => (
                <TouchableOpacity
                  key={msg.id || index}
                  onLongPress={() => handleLongPress(msg.id || index)}
                  onPress={() => handleMessagePress(msg.id || index)}
                  delayLongPress={200}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.messageBubble,
                    msg.isUser ? styles.userMessage : styles.aiMessage,
                    selectedMessages.includes(msg.id || index) && styles.selectedMessage
                  ]}>
                    <Text style={[
                      styles.messageText,
                      msg.isUser ? styles.userMessageText : styles.aiMessageText
                    ]}>
                      {msg.text}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={[
              styles.inputContainer,
              Platform.OS === "ios" ? styles.inputContainerIOS : styles.inputContainerAndroid
            ]}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={recognizedText}
                onChangeText={setRecognizedText}
                placeholder="Type a message..."
                multiline
                autoFocus={true}
              />
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  isListening && styles.recordingButton
                ]}
                onPress={toggleListening}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.sendIcon,
                  isListening && styles.recordingIcon
                ]}>
                  {isListening ? '🔴' : AppIcons.microphone}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconButton, !recognizedText.trim() && styles.disabledButton]}
                onPress={handleSend}
                disabled={!recognizedText.trim()}
              >
                <Text style={[
                  styles.sendIcon,
                  {color: recognizedText.trim() ? "#007AFF" : "#999"}
                ]}>
                  {AppIcons.send}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </GestureHandlerRootView>
  );
}

// Keep your existing styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  messageContainer: {
    flex: 1,
    padding: 16,
  },
  messageContent: {
    paddingBottom: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  userMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    backgroundColor: '#F0F0F0',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'outfit-regular',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
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
  inputContainerIOS: {
    paddingBottom: 20,
  },
  inputContainerAndroid: {
    paddingBottom: 0,
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
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  selectedMessage: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  sendIcon: {
    fontSize: 20,
  },
  recordingButton: {
    backgroundColor: '#FF3B30',
    transform: [{ scale: 1.1 }],
  },
  recordingIcon: {
    color: '#FFFFFF',
  },
  lockedIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
});
