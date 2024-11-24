import { View } from "react-native";
import Login from "../components/Login";
import { auth } from "../configs/FirebaseConfig";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useAppFonts } from "../utils/fonts";
import AppLoading from "../components/AppLoading";
import { useFormContext } from "../contexts/FormContext";
import type { User } from "firebase/auth";
import * as SplashScreen from 'expo-splash-screen';

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { fontsLoaded, onLayoutRootView } = useAppFonts();
  const { loadData } = useFormContext();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          await loadData();
        } catch (error) {
          console.error('Error loading data:', error);
        }
      }
      setAuthLoading(false);
      await SplashScreen.hideAsync();
    });

    return () => unsubscribe();
  }, [loadData]);

  if (!fontsLoaded || authLoading) {
    return <AppLoading />;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {user ? <Redirect href="/(tabs)/savedForms" /> : <Login />}
    </View>
  );
}
