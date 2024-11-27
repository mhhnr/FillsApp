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
import SelectionOverlay from '../../components/SelectionOverlay';
import { useRouter } from 'expo-router';

let Voice;
try {
  Voice = require('@react-native-voice/voice').default;
} catch (e) {
  console.log('Voice module not available');
}

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

  // Single WebSocket connection when component mounts
  useEffect(() => {
    // Only connect if not already connected
    if (!wsRef.current) {
      wsRef.current = new WebSocket(WEBSOCKET_URL);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
      };

      wsRef.current.onmessage = (event) => {
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

  const handleInputChange = (text) => {
    setInputMessage(text);
  };

  const handleSend = async () => {
    if (inputMessage.trim() === '') return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        action: 'sendMessage',
        message: inputMessage
      }));
    }
  };

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
    router.push({
      pathname: '/templateSelection',
      params: { selectedMessages: JSON.stringify(selectedMessages) }
    });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      {selectedMessages.length > 0 && (
        <SelectionOverlay
          selectedCount={selectedMessages.length}
          onCancel={handleCancelSelection}
          onChooseTemplate={handleChooseTemplate}
        />
      )}
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.messageContainer}
        contentContainerStyle={styles.messageContent}
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

      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={inputMessage}
          onChangeText={handleInputChange}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputMessage.trim() && styles.disabledButton]}
          onPress={handleSend}
          disabled={!inputMessage.trim()}
        >
          <Ionicons name="send" size={24} color={inputMessage.trim() ? "#007AFF" : "#999"} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    padding: 16,
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
  selectedMessage: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderColor: '#007AFF',
    borderWidth: 2,
  },
});
