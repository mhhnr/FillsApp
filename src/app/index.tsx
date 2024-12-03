import { View } from "react-native";
import Login from "../components/Login";
import { auth } from "../configs/FirebaseConfig";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import AppLoading from "../components/AppLoading";
import { useFormContext } from "../contexts/FormContext";
import type { User } from "firebase/auth";

export default function Index() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { loadData } = useFormContext();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [loadData]);

  if (authLoading) {
    return <AppLoading />;
  }

  return (
    <View style={{ flex: 1 }}>
      {user ? <Redirect href="/(tabs)/templates" /> : <Login />}
    </View>
  );
}
