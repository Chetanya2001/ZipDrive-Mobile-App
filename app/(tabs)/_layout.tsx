// app/(tabs)/_layout.tsx
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useAuthStore } from "../store/authStore";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const user = useAuthStore((state) => state.user);
  const isHost = user?.role === "host";

  console.log("Role:", user?.role, "| Showing host tabs?", isHost);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarButton: HapticTab,
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      {/* My Bookings – Host Only */}
      <Tabs.Screen
        name="my-bookings"
        options={{
          title: "My Bookings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="book-outline" // ← best looking booking icon
              // name="calendar-outline"  // alternative
              // name="clipboard-outline" // another good one
              size={size}
              color={color}
            />
          ),
          // Clean href – works perfectly even with strict TS
          href: isHost ? "/my-bookings" : null,
        }}
      />

      {/* Explore – Guest Only */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
          href: !isHost ? ("/explore" as any) : null,
        }}
      />

      {/* Profile – Always */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
