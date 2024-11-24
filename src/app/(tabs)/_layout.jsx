import { Tabs } from "expo-router";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppFonts } from "../../utils/fonts";
import LogoutButton from "../../components/LogoutButton";
import { useRouter } from "expo-router";
import { auth } from "../../configs/FirebaseConfig";

export default function TabLayout() {
  const router = useRouter();
  const { fontsLoaded, onLayoutRootView } = useAppFonts();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Tabs 
        screenOptions={{
          headerRight: () => <LogoutButton onLogout={handleLogout} />,
        }}
      >
        <Tabs.Screen
          name="talk"
          options={{
            title: "Talk",
            tabBarIcon: ({ color }) => (
              <Ionicons name="mic-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="templates"
          options={{
            title: "Templates",
            tabBarIcon: ({ color }) => (
              <Ionicons name="document-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="forms"
          options={{
            title: "Forms",
            tabBarIcon: ({ color }) => (
              <Ionicons name="folder-outline" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}