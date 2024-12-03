import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../../configs/FirebaseConfig";
import { AppIcons } from "../../utils/icons";
import LogoutButton from "../../components/LogoutButton";

export default function TabLayout() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs>
        <Tabs.Screen
          name="talk"
          options={{
            title: "Talk",
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 24 }}>{AppIcons.home}</Text>
            ),
            headerRight: () => <LogoutButton onLogout={handleLogout} />,
          }}
        />
        <Tabs.Screen
          name="templates"
          options={{
            title: "Templates",
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 24 }}>{AppIcons.document}</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="forms"
          options={{
            title: "Forms",
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 24 }}>{AppIcons.folder}</Text>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}