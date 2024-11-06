

import { Stack } from "expo-router"; // Importing Stack for navigation
import { View } from "react-native"; // Importing View for styling
import { useAppFonts } from '../utils/fonts';  // Adjust the path based on file location
import AppLoading from '../components/AppLoading';
import { FormProvider } from '../contexts/FormContext';


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
