/**
 * SignUp Component
 * 
 * This component represents the sign-up screen of the application. 
 * It allows users to create a new account by entering their first name, 
 * last name, email, password, and confirming their password. 
 * The component includes animations for a smooth user experience 
 * and handles user registration using Firebase.
 * 
 * Dependencies:
 * - react-native: For building the UI components.
 * - expo-font: For loading custom fonts.
 * - expo-router: For navigation between screens.
 * - @react-navigation/native: For navigation functionalities.
 * - firebase/auth: For handling user authentication.
 * - Ionicons: For using icons in the UI.
 */

import { View, Text, TextInput, TouchableOpacity, Dimensions, StyleSheet, Animated, Platform } from 'react-native';
import React, { useEffect, useRef, useMemo, useState } from 'react';
import { useAppFonts } from '../../../utils/fonts';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../configs/FirebaseConfig';

/**
 * SignUp Function Component
 * 
 * This function component handles the rendering of the sign-up screen.
 * It manages the state for form data, loading status, and error messages.
 * It also handles user registration and animations for the UI.
 */
export default function SignUp() {
    // State to manage form data for user registration
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // State to manage error messages
    const [errors, setErrors] = useState({});

    // State to manage loading status during sign-up
    const [isLoading, setIsLoading] = useState(false);
    
    // Animated values for fade and slide animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    // Router and navigation hooks for navigation functionalities
    const router = useRouter();
    const navigation = useNavigation();

    // Load custom fonts for the component
    const loaded = useAppFonts();

    /**
     * handleCreateAccount Function
     * 
     * This asynchronous function handles the account creation process.
     * It validates the form data and attempts to create a new user account
     * using Firebase authentication. If successful, it navigates to the 
     * main application screen. If an error occurs, it sets the appropriate 
     * error message in the state.
     */
    const handleCreateAccount = async () => {
        if (validateForm()) {
            setIsLoading(true);
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                const user = userCredential.user;
                console.log(user);
                router.replace('/(tabs)/talk'); // Navigate to the main application screen
            } catch (error) {
                console.log('Firebase Error:', error.code, error.message);
                let errorMessage = 'An error occurred during sign up';
                
                // Handle specific Firebase error codes
                switch (error.code) {
                    case 'auth/network-request-failed':
                        errorMessage = Platform.OS === 'android' ? 
                            'Network error. Please check your internet connection and try again.' :
                            'Connection failed. Please verify your network settings.';
                        break;
                    case 'auth/email-already-in-use':
                        errorMessage = 'This email is already registered';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Please enter a valid email address';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'Password is too weak';
                        break;
                }
                
                setErrors({...errors, submit: errorMessage}); // Set the error message in state
            } finally {
                setIsLoading(false); // Reset loading state
            }
        }
    }

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
            headerShown: false, // Hide the header for this screen
        });
        Animated.parallel([animations.fade, animations.slide]).start(); // Start animations
    }, [navigation, animations]);

    /**
     * validateForm Function
     * 
     * This function validates the user input in the sign-up form.
     * It checks for required fields, valid email format, and password 
     * strength. If any validation fails, it sets the corresponding error 
     * messages in the state.
     * 
     * Returns:
     * - Boolean indicating whether the form is valid or not.
     */
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email address';
        
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            newErrors.password = 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors); // Update the errors state
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    /**
     * handleSignUp Function
     * 
     * This function is called when the user presses the sign-up button.
     * It triggers the account creation process.
     */
    const handleSignUp = () => {
        handleCreateAccount(); // Call the account creation function
    };

    // If fonts are not loaded yet, return null to prevent rendering
    if (!loaded) return null;

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()} // Navigate back to the previous screen
            >
                <Ionicons name="arrow-back-circle-outline" size={24} color="black" />
            </TouchableOpacity>
            <Animated.ScrollView 
                style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false} // Hide vertical scroll indicator
            >
                <Text style={styles.title}>Create Account</Text>
                
                <TextInput 
                    style={[styles.input, errors.firstName && styles.inputError]} // Apply error style if there's an error
                    placeholder="First Name"
                    placeholderTextColor="#666"
                    value={formData.firstName}
                    onChangeText={(text) => setFormData({...formData, firstName: text})} // Update first name
                    maxLength={30}
                />
                {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>} // Display error message

                <TextInput 
                    style={[styles.input, errors.lastName && styles.inputError]} // Apply error style if there's an error
                    placeholder="Last Name"
                    placeholderTextColor="#666"
                    value={formData.lastName}
                    onChangeText={(text) => setFormData({...formData, lastName: text})} // Update last name
                    maxLength={30}
                />
                {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>} // Display error message

                <TextInput 
                    style={[styles.input, errors.email && styles.inputError]} // Apply error style if there's an error
                    placeholder="Email"
                    placeholderTextColor="#666"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.email}
                    onChangeText={(text) => setFormData({...formData, email: text})} // Update email
                    maxLength={50}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>} // Display error message

                <TextInput 
                    style={[styles.input, errors.password && styles.inputError]} // Apply error style if there's an error
                    placeholder="Create Password"
                    placeholderTextColor="#666"
                    secureTextEntry
                    value={formData.password}
                    onChangeText={(text) => setFormData({...formData, password: text})} // Update password
                    maxLength={30}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>} // Display error message

                <TextInput 
                    style={[styles.input, errors.confirmPassword && styles.inputError]} // Apply error style if there's an error
                    placeholder="Confirm Password"
                    placeholderTextColor="#666"
                    secureTextEntry
                    value={formData.confirmPassword}
                    onChangeText={(text) => setFormData({...formData, confirmPassword: text})} // Update confirm password
                    maxLength={30}
                />
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>} // Display error message
                {errors.submit && <Text style={styles.errorText}>{errors.submit}</Text>} // Display submission error message

                <TouchableOpacity 
                    style={[styles.signUpButton, isLoading && styles.disabledButton]} // Disable button if loading
                    activeOpacity={0.7}
                    onPress={handleSignUp} // Trigger sign-up process
                    disabled={isLoading} // Disable button if loading
                >
                    <Text style={styles.buttonText}>{isLoading ? 'Signing Up...' : 'Sign Up'}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.loginButton}
                    activeOpacity={0.7}
                    onPress={() => router.replace('auth/sign-in')} // Navigate to sign-in screen
                >
                    <Text style={styles.loginText}>Already have an account? Sign In</Text>
                </TouchableOpacity>
            </Animated.ScrollView>
        </View>
    );
}

// Get the dimensions of the device's window
const { width, height } = Dimensions.get('window');

// Styles for the SignUp component
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
        zIndex: 1,
    },
    content: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: height * 0.02,
    },
    title: {
        fontFamily: 'Outfit-Bold',
        fontSize: Math.min(width * 0.08, 32),
        color: '#000000',
        marginBottom: height * 0.04,
    },
    input: {
        width: '100%',
        height: Math.min(height * 0.06, 50),
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        marginBottom: height * 0.02,
        paddingHorizontal: width * 0.04,
        fontFamily: 'Outfit-Regular',
        fontSize: Math.min(width * 0.04, 16),
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
    signUpButton: {
        width: '100%',
        height: Math.min(height * 0.06, 50),
        backgroundColor: '#000000',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: height * 0.02,
    },
    disabledButton: {
        backgroundColor: '#666666',
    },
    buttonText: {
        color: '#FFFFFF',
        fontFamily: 'Outfit-Bold',
        fontSize: Math.min(width * 0.04, 16),
    },
    loginButton: {
        marginTop: height * 0.02,
        padding: 10,
    },
    loginText: {
        color: '#000000',
        fontFamily: 'Outfit-Regular',
        fontSize: Math.min(width * 0.04, 16),
        textDecorationLine: 'underline',
    },
});