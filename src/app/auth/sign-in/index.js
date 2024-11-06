import { View, Text, TextInput, TouchableOpacity, Dimensions, StyleSheet, Animated } from 'react-native';
import React, { useEffect, useRef, useMemo, useState } from 'react';
import { useAppFonts } from '../../../utils/fonts';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../configs/FirebaseConfig';

/**
 * SignIn Function Component
 * 
 * This function component handles the rendering of the sign-in screen.
 * It manages the state for form data, loading status, and error messages.
 * It also handles user authentication and animations for the UI.
 */
export default function SignIn() {
    // Load custom fonts for the component
    const loaded = useAppFonts();

    // State to manage form data for email and password
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // State to manage error messages
    const [errors, setErrors] = useState({});

    // State to manage loading status during sign-in
    const [isLoading, setIsLoading] = useState(false);

    // Animated values for fade and slide animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    // Router and navigation hooks for navigation functionalities
    const router = useRouter();
    const navigation = useNavigation();

    // Memoized animations for fade and slide effects
    const animations = useMemo(() => ({
        fade: Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }),
        slide: Animated.timing(slideAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        })
    }), [fadeAnim, slideAnim]);

    // Effect to set navigation options and start animations
    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
        Animated.parallel([animations.fade, animations.slide]).start();
    }, [navigation, animations]);

    // Return null if fonts are not loaded yet
    if (!loaded) return null;

    /**
     * handleSignIn Function
     * 
     * This asynchronous function handles the sign-in process.
     * It attempts to sign in the user with the provided email and password.
     * If successful, it navigates to the main application screen.
     * If an error occurs, it sets the appropriate error message.
     */
    const handleSignIn = async () => {
        setIsLoading(true); // Set loading state to true
        try {
            // Attempt to sign in with email and password
            const userCredential = await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            console.log('User signed in:', userCredential.user);
            router.replace('/(tabs)/talk'); // Navigate to the main screen
        } catch (error) {
            console.error('Sign-in error:', error);
            let errorMessage = 'Failed to sign in';
            
            // Determine the error message based on the error code
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This account has been disabled';
                    break;
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    errorMessage = 'Invalid email or password';
                    break;
            }
            setErrors({ submit: errorMessage }); // Set the error message
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()} // Navigate back on press
            >
                <Ionicons name="arrow-back-circle-outline" size={24} color="black" />
            </TouchableOpacity>
            <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <Text style={styles.title}>Welcome Back</Text>
                <TextInput 
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="Email"
                    placeholderTextColor="#666"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.email}
                    onChangeText={(text) => setFormData({...formData, email: text})}
                    maxLength={50}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                <TextInput 
                    style={[styles.input, errors.password && styles.inputError]}
                    placeholder="Password"
                    placeholderTextColor="#666"
                    secureTextEntry
                    value={formData.password}
                    onChangeText={(text) => setFormData({...formData, password: text})}
                    maxLength={30}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                {errors.submit && <Text style={styles.errorText}>{errors.submit}</Text>}

                <TouchableOpacity 
                    style={[styles.signInButton, isLoading && styles.disabledButton]}
                    activeOpacity={0.7}
                    onPress={handleSignIn}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.createAccountButton}
                    activeOpacity={0.7} // Optimize touch feedback
                    onPress={() => router.replace('auth/sign-up')} // Navigate to SignUp screen
                >
                    <Text style={styles.createAccountText}>Create Account</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

// Memoize dimensions to prevent recalculation
const { width, height } = Dimensions.get('window');

// Styles for the SignIn component
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        padding: width * 0.05,
    },
    backButton: {
        position: 'absolute',
        top: height * 0.05,
        left: width * 0.05,
        zIndex: 1, // Ensure the button is above other elements
    },
    content: {
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontFamily: 'Outfit-Bold',
        fontSize: Math.min(width * 0.08, 32), // Cap font size for larger screens
        color: '#000000',
        marginBottom: height * 0.04,
    },
    input: {
        width: '100%',
        height: Math.min(height * 0.06, 50), // Cap height for larger screens
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        marginBottom: height * 0.02,
        paddingHorizontal: width * 0.04,
        fontFamily: 'Outfit-Regular',
        fontSize: Math.min(width * 0.04, 16), // Cap font size for larger screens
    },
    signInButton: {
        width: '100%',
        height: Math.min(height * 0.06, 50), // Cap height for larger screens
        backgroundColor: '#000000',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * 0.02,
    },
    buttonText: {
        color: '#FFFFFF',
        fontFamily: 'Outfit-Bold',
        fontSize: Math.min(width * 0.04, 16), // Cap font size for larger screens
    },
    createAccountButton: {
        marginTop: height * 0.02,
        padding: 10,
    },
    createAccountText: {
        color: '#000000',
        fontFamily: 'Outfit-Regular',
        fontSize: Math.min(width * 0.04, 16), // Cap font size for larger screens
        textDecorationLine: 'underline',
    },
    inputError: {
        borderWidth: 1,
        borderColor: '#FF0000',
    },
    errorText: {
        color: '#FF0000',
        fontFamily: 'Outfit-Regular',
        fontSize: Math.min(width * 0.03, 12),
        alignSelf: 'flex-start',
        marginBottom: height * 0.01,
    },
    disabledButton: {
        backgroundColor: '#666666',
    },
});