import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import AppProvider from '@/context/AppContext';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppProvider>
        <Stack>
          <Stack.Screen name='auth/login' options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="create-table" options={{ presentation:'modal',title:"Create Table"}} />

          <Stack.Screen name="+not-found" />
          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
              title: "View & Print Bill"
            }}
          />
        </Stack>
      </AppProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
