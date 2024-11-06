

import { View, Text, Image } from 'react-native';
import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';

// Get the dimensions of the device's window
const { width, height } = Dimensions.get('window');

/**
 * Login Function Component
 * 
 * This function component handles the rendering of the login screen.
 * It utilizes the useRouter hook for navigation and the useSharedValue 
 * and useAnimatedStyle hooks from react-native-reanimated for animation.
 */
export default function Login() { 
  // Initialize the router for navigation
  const router = useRouter();
  
  // Shared value for controlling the vertical translation of the animated view
  const translateY = useSharedValue(height);

  // Effect to animate the entrance of the login form
  useEffect(() => {
    // Animate the translateY value to 0 with spring effect
    translateY.value = withSpring(0, {
      damping: 15, // Controls the bounciness of the animation
      stiffness: 100 // Controls the speed of the animation
    });
  }, [translateY]);

  // Animated style for the login form
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }], // Apply the translation
    };
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      {/* Background Image */}
      <Image
        source={{ uri: 'https://raw.githubusercontent.com/mhhnn/FillsApp/12a8617a7af7ee2f3cc7821620a705cbe50fef1c/assets/images/hhny.jpg' }}
        style={{
          width: width,
          height: height,
          position: 'absolute',
          top: 0,
          left: 0,
          resizeMode: 'cover', // Cover the entire area
        }}
      />

      {/* Animated Login Form */}
      <Animated.View style={[{
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent background
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        position: 'absolute',
        bottom: 0,
        width: width * 0.95, // Slightly less than full width
        minHeight: height * 0.25, // Minimum height of the form
        alignSelf: 'center',
        alignItems: 'center'
      }, animatedStyle]}>
        {/* Title of the Form */}
        <Text style={{
          fontSize: 24,
          fontFamily: 'outfit-bold',
          color: '#000',
          marginBottom: 15,
          textAlign: 'center'
        }}>Medical Form Filler</Text>
        
        {/* Description of the Form */}
        <Text style={{
          fontSize: 16,
          fontFamily: 'outfit',
          color: '#666',
          marginBottom: 20,
          textAlign: 'center'
        }}>Get started with automated form filling powered by AI</Text>

        {/* Get Started Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#000', // Button background color
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 20, // Rounded corners
          }}
          activeOpacity={0.7} // Opacity when pressed
          onPress={() => router.push('/auth/sign-in')} // Navigate to sign-in page
        >
          <Text style={{
            color: '#fff', // Text color
            fontSize: 16,
            fontFamily: 'outfit-medium',
            textAlign: 'center'
          }}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
