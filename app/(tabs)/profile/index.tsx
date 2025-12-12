import React from "react";
import { ActivityIndicator, View } from "react-native";
import AuthScreen from "../../screens/auth-screen";
import UserProfileScreen from "../../screens/user-profile"; // Your profile component
import useAuthStore from "../../store/authStore"; // Adjust path to your authStore

const ProfileHome = () => {
  const { user, loading: authLoading } = useAuthStore();

  // Show loading while auth state initializes
  if (authLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0a1f1a",
        }}
      >
        <ActivityIndicator size="large" color="#01d28e" />
      </View>
    );
  }

  // Redirect to auth if no user (not logged in)
  if (!user) {
    return <AuthScreen />;
  }

  // Show profile to authenticated users
  return <UserProfileScreen />;
};

export default ProfileHome;
