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
import { View } from "react-native"; // Importing View for styling
import { useAppFonts } from '../utils/fonts';  // Adjust the path based on file location
import AppLoading from '../components/AppLoading';
import { FormProvider } from '../contexts/FormContext';

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
  const { fontsLoaded, onLayoutRootView } = useAppFonts();

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <FormProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </FormProvider>
    </View>
  );
}
