import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }



  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name='auth/login' options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="create-table" options={{ presentation: 'modal', title: "Create Table" }} />
        <Stack.Screen name="assign-players" options={{
          title: "Assign Players", headerLeft: () =>
            navigation.canGoBack() ? (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
              style={{ marginLeft: 10, marginRight: -10 }}
              >
                <Ionicons name="arrow-back" size={20} />
              </TouchableOpacity>
            ) : null,
        }} />
        <Stack.Screen name="match-tracker" options={{
          title: "Match Tracker", headerLeft: () =>
            navigation.canGoBack() ? (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
              style={{ marginLeft: 10, marginRight: -10 }}
              >
                <Ionicons name="arrow-back" size={20} />
              </TouchableOpacity>
            ) : null,
        }} />

          <Stack.Screen name="billing" options={{
          title: "Billing", headerLeft: () =>
              <TouchableOpacity
                onPress={() => router.navigate("/(tabs)")}
              style={{  marginRight:20,position:"relative",top:1}}
              >
                <Ionicons name="arrow-back" size={25} />
              </TouchableOpacity>
        }} />


        <Stack.Screen name="+not-found" />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            title: "View & Print Bill"
          }}
        />

      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
