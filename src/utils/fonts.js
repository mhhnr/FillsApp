import { useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const useAppFonts = () => {
  const onLayoutRootView = useCallback(async () => {
    try {
      await SplashScreen.hideAsync();
    } catch (error) {
      console.error('Error hiding splash screen:', error);
    }
  }, []);

  return { fontsLoaded: true, onLayoutRootView };
}; 