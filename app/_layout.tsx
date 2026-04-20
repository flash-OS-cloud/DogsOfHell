import { Stack } from "expo-router";
import "../global.css";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    // <SafeAreaProvider>
    //   <Stack screenOptions={{ headerShown: false }}/>
    // </SafeAreaProvider>
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
