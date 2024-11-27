import { Stack } from "expo-router";
import { FormProvider } from '../contexts/FormContext';
import { FormDataProvider } from '../contexts/FormDataContext';

export default function RootLayout() {
  return (
    <FormProvider>
      <FormDataProvider>
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
      </FormDataProvider>
    </FormProvider>
  );
}
