import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Maven Pro - Primary brand font
    'Maven Pro': require('../assets/fonts/MavenPro-Regular.ttf'),
    'Maven Pro-Medium': require('../assets/fonts/MavenPro-Medium.ttf'),
    'Maven Pro-SemiBold': require('../assets/fonts/MavenPro-SemiBold.ttf'),
    'Maven Pro-Bold': require('../assets/fonts/MavenPro-Bold.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Auth Flow */}
        <Stack.Screen name="(auth)/welcome" options={{ title: 'Welcome' }} />
        <Stack.Screen name="(auth)/permissions" options={{ title: 'Permissions' }} />

        {/* Main Tabs */}
        <Stack.Screen name="(tabs)/index" options={{ title: 'Home' }} />
        <Stack.Screen name="(tabs)/history" options={{ title: 'History' }} />
        <Stack.Screen name="(tabs)/settings" options={{ title: 'Settings' }} />
        <Stack.Screen name="(tabs)/profile" options={{ title: 'Profile' }} />

        {/* Session Flow */}
        <Stack.Screen name="session/description" options={{ title: 'Describe' }} />
        <Stack.Screen name="session/capture" options={{ title: 'Capture' }} />
        <Stack.Screen name="session/analysis" options={{ title: 'Analysis' }} />

        {/* Tidy Mode */}
        <Stack.Screen name="session/tidy/mode-select" options={{ title: 'Guidance Mode' }} />
        <Stack.Screen name="session/tidy/step-text" options={{ title: 'Step' }} />
        <Stack.Screen name="session/tidy/step-voice" options={{ title: 'Step' }} />
        <Stack.Screen name="session/tidy/complete" options={{ title: 'Complete' }} />

        {/* Restructure Mode */}
        <Stack.Screen name="session/restructure/generating" options={{ title: 'Generating' }} />
        <Stack.Screen name="session/restructure/diagram" options={{ title: 'Layout Plan' }} />
        <Stack.Screen name="session/restructure/step" options={{ title: 'Step' }} />
        <Stack.Screen name="session/restructure/complete" options={{ title: 'Complete' }} />
      </Stack>
    </ThemeProvider>
  );
}
