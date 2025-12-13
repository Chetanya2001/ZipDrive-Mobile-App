import { useColorScheme } from "@/hooks/use-color-scheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ZipYourTrip from "../screens/zip-your-trip";
import { useAuthStore } from "../store/authStore";
import HostedCarsLayout from "./hosted-cars/_layout";
import HomeScreen from "./index";
import MyBookingsScreen from "./my-bookings";
import ProfileScreen from "./profile";
const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const user = useAuthStore((state) => state.user);
  const isHost = user?.role === "host";
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const activeColor = "#01d28e";
  const inactiveColor = "#8b92a8";
  const tabBarBackground = "#0a1220";
  const borderTopColor = "#1a2332";

  // 👇 ONLY CHANGE: Professional dynamic padding
  const dynamicBottom = insets.bottom > 0 ? insets.bottom + 8 : 12;
  const dynamicHeight = 60 + (insets.bottom > 0 ? insets.bottom : 0);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: tabBarBackground,
          borderTopColor: borderTopColor,
          height: dynamicHeight,
          paddingBottom: dynamicBottom,
          paddingTop: 12,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        lazy: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ZipYourTrip"
        component={ZipYourTrip}
        options={{
          title: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={26} color={color} />
          ),
        }}
      />

      {isHost && (
        <Tab.Screen
          name="HostedCars"
          component={HostedCarsLayout}
          options={{
            title: "Hosted Cars",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="car-sport" size={26} color={color} />
            ),
          }}
        />
      )}

      {isHost && (
        <Tab.Screen
          name="MyBookings"
          component={MyBookingsScreen}
          options={{
            title: "Bookings",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" size={26} color={color} />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
