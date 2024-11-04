import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import { TouchableOpacity } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export default function Login() { 
  const router = useRouter();
  const translateY = useSharedValue(height);

  useEffect(() => {
    translateY.value = withSpring(0, {
      damping: 15,
      stiffness: 100
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <Image
        source={{ uri: 'https://thumbs.dreamstime.com/b/sample-taking-representative-random-larger-group-44215738.jpg' }}
        style={{
          width: width,
          height: height * 0.5,
          position: 'absolute',
          top: height * 0.1,
          resizeMode: 'contain',
        }}
      />

      <Animated.View style={[{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        position: 'absolute',
        bottom: 0,
        width: width * 0.95,
        minHeight: height * 0.25,
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
            borderRadius: 20,
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
  );
}
