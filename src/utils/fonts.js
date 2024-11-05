import { useCallback, useEffect, useState } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const loadFonts = () => {
  return Font.loadAsync({
    'outfit': require('../../assets/fonts/Outfit-Regular.ttf'),
    'outfit-regular': require('../../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('../../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold': require('../../assets/fonts/Outfit-Bold.ttf'),
    'Outfit-Regular': require('../../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Medium': require('../../assets/fonts/Outfit-Medium.ttf'),
    'Outfit-Bold': require('../../assets/fonts/Outfit-Bold.ttf'),
  });
};

export const useAppFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to ensure fonts are ready
        setFontsLoaded(true);
      } catch (error) {
        console.warn('Error loading fonts:', error);
        setFontsLoaded(false);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return { fontsLoaded, onLayoutRootView };
}; 