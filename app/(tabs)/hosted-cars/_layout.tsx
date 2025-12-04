import { Stack } from "expo-router";

export default function MyHostedCars() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
