import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../../configs/FirebaseConfig';

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

  const LogoutButton = () => (
    <TouchableOpacity 
      onPress={handleLogout} 
      style={{ marginRight: 15 }}
    >
      <Text style={{ color: '#007AFF', fontSize: 16 }}>Logout</Text>
    </TouchableOpacity>
  );

  return (
    <Tabs screenOptions={{
      headerRight: () => <LogoutButton />,
    }}>
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
        name="formChoose"
        options={{
          title: "Choose Form",
          tabBarIcon: ({ color }) => (
            <Ionicons name="document-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="makeForm"
        options={{
          title: "Make Form",
          tabBarIcon: ({ color }) => (
            <Ionicons name="create-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="savedForms"
        options={{
          title: "Saved Forms",
          tabBarIcon: ({ color }) => (
            <Ionicons name="save-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 