import { View } from "react-native";
import Login from "../components/Login";
import { auth } from "../configs/FirebaseConfig";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useAppFonts } from "../utils/fonts";
import AppLoading from "../components/AppLoading";

export default function Index() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { fontsLoaded, onLayoutRootView } = useAppFonts();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (!fontsLoaded || authLoading) {
    return <AppLoading />;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {user ? <Redirect href="/(tabs)/talk" /> : <Login />}
    </View>
  );
}
