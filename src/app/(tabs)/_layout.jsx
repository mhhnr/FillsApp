/**
 * TabLayout Component
 * 
 * This component serves as the layout for the tab navigation in the application.
 * It utilizes the `expo-router` library to create a tabbed interface, allowing users
 * to navigate between different screens. The component also includes a logout button
 * that enables users to sign out of their account.
 * 
 * Dependencies:
 * - expo-router: For routing and navigation functionalities.
 * - @expo/vector-icons: For using Ionicons as tab bar icons.
 * - react-native: For building the UI components.
 * - FirebaseConfig: For accessing Firebase authentication methods.
 */

import { Tabs } from "expo-router"; // Importing Tabs component for tab navigation
import { Ionicons } from "@expo/vector-icons"; // Importing Ionicons for tab icons
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'; // Importing TouchableOpacity, Text, StyleSheet, and View for UI elements
import { useRouter } from 'expo-router'; // Importing useRouter hook for navigation
import { auth } from '../../configs/FirebaseConfig'; // Importing auth for Firebase authentication
import { useAppFonts } from '../../utils/fonts';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

/**
 * Renders the TabLayout component with tab screens for navigation.
 * 
 * @returns {JSX.Element} The TabLayout component containing tab screens.
 */
export default function TabLayout() {
  const router = useRouter(); // Initialize router for navigation
  const { fontsLoaded, onLayoutRootView } = useAppFonts();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Tabs 
        screenOptions={{
          headerRight: () => <LogoutButton onLogout={handleLogout} />,
        }}
      >
        <Tabs.Screen
          name="formChoose"
          options={{
            title: "Choose Form",
            tabBarIcon: ({ color }) => (
              <Ionicons name="document-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="talk"
          options={{
            title: "Talk",
            tabBarIcon: ({ color }) => (
              <Ionicons name="mic-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="makeForm"
          options={{
            title: "Make Form",
            tabBarIcon: ({ color }) => (
              <Ionicons name="create-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="savedForms"
          options={{
            title: "Saved Forms",
            tabBarIcon: ({ color }) => (
              <Ionicons name="save-outline" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
} 

const LogoutButton = ({ onLogout }) => (
  <TouchableOpacity 
    onPress={onLogout}
    style={{ marginRight: 15 }}
  >
    <Text style={{ 
      color: '#007AFF', 
      fontSize: 16,
      fontFamily: 'outfit-medium'
    }}>
      Logout
    </Text>
  </TouchableOpacity>
);