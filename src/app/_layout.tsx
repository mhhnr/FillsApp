import { Stack } from "expo-router";
import { useFonts, Outfit_400Regular, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { View , ActivityIndicator} from 'react-native';
import React from 'react';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen 
        name="(form)" 
        options={{headerShown:true, title:'form'}}
      />
      <Stack.Screen 
        name="savedforms" 
        options={{headerShown:true, title:'savedforms'}}
      />
      <Stack.Screen 
        name="record" 
        options={{headerShown:true, title:'record'}}
      />
    </Stack>
  );
}
