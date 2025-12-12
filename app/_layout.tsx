// app/_layout.tsx
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Font from "expo-font";
import { Stack } from "expo-router"; // ← Add this import
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Providers } from "./providers";

export const unstable_settings = {
  initialRouteName: "splash",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Font.loadAsync({});
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <Providers>
      <SafeAreaProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack screenOptions={{ headerShown: false }}>
            {/* This loads your tab navigator */}
            <Stack.Screen name="(tabs)" />

            {/* Full-screen routes outside tabs */}
            <Stack.Screen name="screens/car-details" />

            {/* Add more screens here later, e.g. booking flow, auth modals, etc. */}
          </Stack>

          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </Providers>
  );
}
