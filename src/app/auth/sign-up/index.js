import { View, Text, TextInput, TouchableOpacity, Dimensions, StyleSheet, Animated, Platform } from 'react-native'
import React, { useEffect, useRef, useMemo, useState } from 'react'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { useNavigation } from '@react-navigation/native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../configs/FirebaseConfig';

export default function SignUp() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const router = useRouter();
    const navigation = useNavigation();

    const [loaded] = useFonts({
        'Outfit-Regular': require('../../../../assets/fonts/Outfit-Regular.ttf'),
        'Outfit-Bold': require('../../../../assets/fonts/Outfit-Bold.ttf'),
    });

    const handleCreateAccount = async () => {
        if (validateForm()) {
            setIsLoading(true);
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                const user = userCredential.user;
                console.log(user);
                router.replace('/(tabs)/talk');
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
                
                setErrors({...errors, submit: errorMessage});
            } finally {
                setIsLoading(false);
            }
        }
    }

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

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
        Animated.parallel([animations.fade, animations.slide]).start();
    }, [navigation, animations]);

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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = () => {
        handleCreateAccount();
    };

    if (!loaded) return null;

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back-circle-outline" size={24} color="black" />
            </TouchableOpacity>
            <Animated.ScrollView 
                style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Create Account</Text>
                
                <TextInput 
                    style={[styles.input, errors.firstName && styles.inputError]}
                    placeholder="First Name"
                    placeholderTextColor="#666"
                    value={formData.firstName}
                    onChangeText={(text) => setFormData({...formData, firstName: text})}
                    maxLength={30}
                />
                {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

                <TextInput 
                    style={[styles.input, errors.lastName && styles.inputError]}
                    placeholder="Last Name"
                    placeholderTextColor="#666"
                    value={formData.lastName}
                    onChangeText={(text) => setFormData({...formData, lastName: text})}
                    maxLength={30}
                />
                {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

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
                    placeholder="Create Password"
                    placeholderTextColor="#666"
                    secureTextEntry
                    value={formData.password}
                    onChangeText={(text) => setFormData({...formData, password: text})}
                    maxLength={30}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                <TextInput 
                    style={[styles.input, errors.confirmPassword && styles.inputError]}
                    placeholder="Confirm Password"
                    placeholderTextColor="#666"
                    secureTextEntry
                    value={formData.confirmPassword}
                    onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                    maxLength={30}
                />
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                {errors.submit && <Text style={styles.errorText}>{errors.submit}</Text>}

                <TouchableOpacity 
                    style={[styles.signUpButton, isLoading && styles.disabledButton]}
                    activeOpacity={0.7}
                    onPress={handleSignUp}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>{isLoading ? 'Signing Up...' : 'Sign Up'}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.loginButton}
                    activeOpacity={0.7}
                    onPress={() => router.replace('auth/sign-in')}
                >
                    <Text style={styles.loginText}>Already have an account? Sign In</Text>
                </TouchableOpacity>
            </Animated.ScrollView>
        </View>
    );
}

const { width, height } = Dimensions.get('window');

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