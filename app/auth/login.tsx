import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../store/authStore";

const COLORS = {
  background: "#0a1220",
  button: "#01d28e",
  buttonDark: "#2d3748",
  text: "#ffffff",
  textMuted: "#a0aec0",
  border: "#2d3748",
  iconBg: "#1a2332",
  inputBg: "#1a2332",
  inputBorder: "#2d3748",
  errorBg: "#7f1d1d",
  errorBorder: "#dc2626",
  successBg: "#166534",
  successBorder: "#22c55e",
} as const;

interface JwtPayload {
  id: number;
  email: string;
  role: "admin" | "host" | "guest";
  iat: number;
  exp: number;
}

interface LoginProps {
  onClose?: () => void;
  onSwitch?: () => void;
  onLoginSuccess?: (userData: {
    id: number;
    email: string;
    role: "admin" | "host" | "guest";
    token: string;
  }) => void;
  remark?: string;
}

export default function Login({
  onClose,
  onSwitch,
  onLoginSuccess,
  remark,
}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, loading, token, user } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    if (token && user) {
      handleLoginSuccess();
    }
  }, [token, user]);

  const handleLoginSuccess = async () => {
    try {
      console.log("🔵 handleLoginSuccess() triggered");
      if (!token) throw new Error("No token returned from server");

      const decoded: JwtPayload = jwtDecode(token);
      console.log("🟢 Decoded token:", decoded);
      const userData = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role as "admin" | "host" | "guest",
        token,
      };

      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }
      console.log("🟣 Closing modal...");
      onClose?.();
      // navigate to main tabs
      console.log("🟢 Attempting navigation to: /(tabs)/");
      router.replace("/(tabs)");
      // Route to home page based on user role

      // Close modal AFTER navigation
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
      Alert.alert("Login Failed", err.message || "Login failed");
    }
  };

  const handleLogin = async () => {
    setError("");
    try {
      await login(email, password);
      // navigate to the main tabs screen after successful login
      if (token || user) {
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
      Alert.alert("Login Failed", err.message || "Login failed");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 28,
        }}
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: COLORS.background }}
      >
        <View style={{ flex: 1, justifyContent: "center", gap: 28 }}>
          {onClose && (
            <TouchableOpacity
              onPress={onClose}
              style={{ alignSelf: "flex-end" }}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Text
                style={{
                  fontSize: 28,
                  color: COLORS.textMuted,
                  fontWeight: "bold",
                }}
              >
                ×
              </Text>
            </TouchableOpacity>
          )}

          <View>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "700",
                color: COLORS.text,
                marginBottom: 8,
              }}
            >
              Welcome back
            </Text>
            <Text style={{ color: COLORS.textMuted, fontSize: 16 }}>
              Please enter your details to sign in.
            </Text>
          </View>

          {remark && (
            <View
              style={{
                backgroundColor: COLORS.successBg,
                padding: 16,
                borderRadius: 12,
                borderLeftWidth: 4,
                borderLeftColor: COLORS.successBorder,
              }}
            >
              <Text style={{ color: COLORS.text, fontSize: 16 }}>{remark}</Text>
            </View>
          )}

          <View style={{ gap: 24 }}>
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: COLORS.textMuted,
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Email
              </Text>
              <TextInput
                style={{
                  borderWidth: 2,
                  borderColor: error ? COLORS.errorBorder : COLORS.inputBorder,
                  backgroundColor: COLORS.inputBg,
                  padding: 16,
                  borderRadius: 12,
                  fontSize: 16,
                  color: COLORS.text,
                }}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: COLORS.textMuted,
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Password
              </Text>
              <TextInput
                style={{
                  borderWidth: 2,
                  borderColor: error ? COLORS.errorBorder : COLORS.inputBorder,
                  backgroundColor: COLORS.inputBg,
                  padding: 16,
                  borderRadius: 12,
                  fontSize: 16,
                  color: COLORS.text,
                }}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {error ? (
              <View
                style={{
                  backgroundColor: COLORS.errorBg,
                  padding: 16,
                  borderRadius: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: COLORS.errorBorder,
                }}
              >
                <Text style={{ color: COLORS.text, fontSize: 16 }}>
                  {error}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[
                {
                  padding: 18,
                  borderRadius: 14,
                  alignItems: "center",
                },
                loading
                  ? { backgroundColor: COLORS.buttonDark }
                  : { backgroundColor: COLORS.button },
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.background} />
              ) : (
                <Text
                  style={{
                    color: COLORS.background,
                    fontSize: 18,
                    fontWeight: "600",
                  }}
                >
                  Sign in
                </Text>
              )}
            </TouchableOpacity>

            {onSwitch && (
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: COLORS.textMuted, fontSize: 16 }}>
                  Don't have an account?{" "}
                  <Text
                    onPress={onSwitch}
                    style={{
                      color: COLORS.button,
                      fontWeight: "600",
                    }}
                  >
                    Click To Register
                  </Text>
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
