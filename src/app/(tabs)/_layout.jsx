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
import { TouchableOpacity, Text } from 'react-native'; // Importing TouchableOpacity and Text for UI elements
import { useRouter } from 'expo-router'; // Importing useRouter hook for navigation
import { auth } from '../../configs/FirebaseConfig'; // Importing auth for Firebase authentication

/**
 * Handles user logout by signing out from Firebase and redirecting to the home screen.
 * 
 * @async
 * @function handleLogout
 * @returns {Promise<void>} 
 */
const handleLogout = async () => {
  try {
    await auth.signOut(); // Sign out from Firebase
    router.replace('/'); // Redirect to the home screen
  } catch (error) {
    console.error('Error signing out:', error); // Log any errors during sign out
  }
};

/**
 * LogoutButton Component
 * 
 * This component renders a button that allows users to log out of their account.
 * It triggers the handleLogout function when pressed.
 * 
 * @returns {JSX.Element} A TouchableOpacity component that serves as the logout button.
 */
const LogoutButton = () => (
  <TouchableOpacity 
    onPress={handleLogout} // Trigger logout on press
    style={{ marginRight: 15 }} // Style for the button
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

/**
 * Renders the TabLayout component with tab screens for navigation.
 * 
 * @returns {JSX.Element} The TabLayout component containing tab screens.
 */
export default function TabLayout() {
  const router = useRouter(); // Initialize router for navigation

  return (
    <Tabs screenOptions={{
      headerRight: () => <LogoutButton />, // Render LogoutButton in the header
    }}>

      <Tabs.Screen
        name="formChoose"
        options={{
          title: "Choose Form", // Title for the tab
          tabBarIcon: ({ color }) => ( // Icon for the tab
            <Ionicons name="document-outline" size={24} color={color} />
          ),
        }}
      />
            <Tabs.Screen
        name="talk"
        options={{
          title: "Talk", // Title for the tab
          tabBarIcon: ({ color }) => ( // Icon for the tab
            <Ionicons name="mic-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="makeForm"
        options={{
          title: "Make Form", // Title for the tab
          tabBarIcon: ({ color }) => ( // Icon for the tab
            <Ionicons name="create-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="savedForms"
        options={{
          title: "Saved Forms", // Title for the tab
          tabBarIcon: ({ color }) => ( // Icon for the tab
            <Ionicons name="save-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 