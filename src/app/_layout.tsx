/**
 * RootLayout Component
 * 
 * This component serves as the main layout for the application. 
 * It utilizes the Expo Router for navigation and manages the 
 * loading of custom fonts while displaying a splash screen 
 * until the fonts are fully loaded.
 * 
 * Dependencies:
 * - expo-router: For managing navigation between screens.
 * - expo-font: For loading custom fonts.
 * - expo-splash-screen: For controlling the splash screen visibility.
 * - react: For using React hooks such as useEffect.
 */

import { Stack } from "expo-router"; // Importing Stack for navigation
import { useFonts } from "expo-font"; // Importing useFonts for loading custom fonts
import * as SplashScreen from 'expo-splash-screen'; // Importing SplashScreen for managing splash screen
import { useEffect } from "react"; // Importing useEffect for side effects in functional components
import { FormProvider } from '../contexts/FormContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync(); // Prevents the splash screen from hiding automatically

/**
 * RootLayout Function Component
 * 
 * This function component is responsible for rendering the main 
 * layout of the application. It loads custom fonts and manages 
 * the splash screen visibility based on the font loading status.
 * 
 * Returns:
 * - A Stack component that contains the main application screens.
 */
export default function RootLayout() {
  // Load custom fonts and store the loading status
  const [loaded] = useFonts({
    'outfit': require('../../assets/fonts/Outfit-Regular.ttf'), // Regular font
    'outfit-medium': require('../../assets/fonts/Outfit-Medium.ttf'), // Medium font
    'outfit-bold': require('../../assets/fonts/Outfit-Bold.ttf'), // Bold font
  });

  // Effect to hide the splash screen once fonts are loaded
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync(); // Hide the splash screen when fonts are loaded
    }
  }, [loaded]); // Dependency array includes 'loaded' to trigger effect on change

  // If fonts are not loaded yet, return null to prevent rendering
  if (!loaded) return null;

  // Render the Stack component for navigation
  return (
    <FormProvider>
      <Stack screenOptions={{headerShown: false}}> {/* Hides the header for all screens */}
        <Stack.Screen name="(tabs)" /> {/* Main screen of the application */}
      </Stack>
    </FormProvider>
  );
}
