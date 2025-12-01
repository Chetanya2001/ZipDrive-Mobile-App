// app/splash.tsx
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export default function SplashScreen() {
  const scaleAnim = useRef(new Animated.Value(0)).current; // start tiny

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1.2, // end size
      duration: 2500, // total time on splash
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        // go directly to first tab screen to avoid black flash
        router.replace("/(tabs)");
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/images/splash.png")}
        style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 180,
  },
});
