import { Stack } from "expo-router";
import { FormProvider } from '../contexts/FormContext';

export default function RootLayout() {
  return (
    <FormProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="viewTemplate" 
          options={{ 
            presentation: 'modal',
            title: 'View Template',
            headerShown: true
          }} 
        />
        <Stack.Screen 
          name="fillForm" 
          options={{ 
            headerShown: true,
            title: 'Fill Form'
          }} 
        />
        <Stack.Screen 
          name="viewFilledForm" 
          options={{ 
            headerShown: false
          }} 
        />
      </Stack>
    </FormProvider>
  );
}
