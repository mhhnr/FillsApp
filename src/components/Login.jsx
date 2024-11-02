import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import { TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
export default function Login() { 

const router = useRouter();
  const translateY = useSharedValue(height);

  useEffect(() => {
    translateY.value = withSpring(0, {
      damping: 15,
      stiffness: 100
    });
  }, [translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require('../../assets/images/landing.jpg')}
        style={{
          width: width,       // 90% of the screen width, adaptable for any screen
          height: height,      // Keeps a phone-like aspect ratio (adjust this as needed)
          position: 'absolute',     // Maintains image proportions without stretching
          resizeMode: 'cover',              // Optional rounded corners
        }}
      />

      <Animated.View style={[{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        position: 'absolute',
        bottom: 0,
        width: width * 0.95, // Adjusted to be 95% of the screen width for better responsiveness
        minHeight: height * 0.25, // Adjusted to be 25% of the screen height for better responsiveness
        alignSelf: 'center',
        alignItems: 'center'
      }, animatedStyle]}>
        <Text style={{
          fontSize: 24,
          fontFamily: 'outfit-bold',
          color: '#000',
          marginBottom: 15,
          textAlign: 'center'
        }}>Medical Form Filler</Text>
        
        <Text style={{
          fontSize: 16,
          fontFamily: 'outfit',
          color: '#666',
          marginBottom: 20,
          textAlign: 'center'
        }}>Get started with automated form filling powered by AI</Text>

        <TouchableOpacity
          style={{
            backgroundColor: '#000',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 20, // Changed to make the button rounded at the left and right corner
          }}
          activeOpacity={0.7}
          onPress={() => router.push('/auth/sign-in')}
          
        >
          <Text style={{
            color: '#fff',
            fontSize: 16,
            fontFamily: 'outfit-medium',
            textAlign: 'center'
          }}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  ) 

}
