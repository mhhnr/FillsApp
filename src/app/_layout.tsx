import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    'outfit': require('../../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('../../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold': require('../../assets/fonts/Outfit-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
