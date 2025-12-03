import { useRouter } from "expo-router";
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

export interface UserRegister {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  role: "guest" | "host";
}

interface RegisterProps {
  onClose?: () => void;
  onSwitch?: () => void;
  onRegisterSuccess?: () => void;
}

export default function Register({
  onClose,
  onSwitch,
  onRegisterSuccess,
}: RegisterProps) {
  const [formData, setFormData] = useState<UserRegister>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    role: "guest",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const { signup, loading } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && useAuthStore.getState().user && !errorMessage) {
      if (onRegisterSuccess) {
        onRegisterSuccess();
      } else {
        router.replace("/(tabs)");
      }
      onClose?.();
    }
  }, [loading]);

  const handleChange = (name: keyof UserRegister, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleRoleToggle = () => {
    setFormData((prev) => ({
      ...prev,
      role: prev.role === "guest" ? "host" : "guest",
    }));
  };

  // In your Register component (only this function changes)
  const handleSubmit = async () => {
    setErrorMessage("");

    if (!formData.email || !formData.password || !formData.first_name) {
      setErrorMessage("Please fill required fields");
      return;
    }

    try {
      const name = `${formData.first_name} ${formData.last_name}`.trim();

      // THIS IS THE ONLY LINE THAT CHANGES
      await signup(
        name,
        formData.email,
        formData.password,
        formData.role, // ← send "host" or "guest"
        formData.phone // ← send phone number
      );

      // Success → useEffect will redirect
    } catch (err: any) {
      const errorMsg = err.message || "Registration failed";
      setErrorMessage(errorMsg);
      Alert.alert("Registration Failed", errorMsg);
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
              style={{ fontSize: 32, fontWeight: "700", color: COLORS.text }}
            >
              Create Account
            </Text>
          </View>

          <View style={{ gap: 12 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: COLORS.text,
              }}
            >
              Role: {formData.role === "guest" ? "guest" : "host"}
            </Text>
            <TouchableOpacity
              style={[
                {
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  borderRadius: 25,
                  borderWidth: 2,
                  width: 140,
                  justifyContent:
                    formData.role === "host" ? "flex-end" : "flex-start",
                  paddingHorizontal: 20,
                },
                formData.role === "host"
                  ? {
                      borderColor: COLORS.button,
                      backgroundColor: COLORS.button + "20",
                    }
                  : {
                      borderColor: COLORS.border,
                      backgroundColor: COLORS.inputBg,
                    },
              ]}
              onPress={handleRoleToggle}
              disabled={loading}
            >
              <Text
                style={[
                  {
                    fontSize: 16,
                    fontWeight: "600",
                  },
                  formData.role === "host"
                    ? { color: COLORS.button }
                    : { color: COLORS.textMuted },
                ]}
              >
                {formData.role === "host" ? "Host" : "Guest"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 24 }}>
            <View style={{ flexDirection: "row", gap: 16 }}>
              <View style={{ flex: 1 }}>
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
                  First Name
                </Text>
                <TextInput
                  style={{
                    borderWidth: 2,
                    borderColor: COLORS.inputBorder,
                    backgroundColor: COLORS.inputBg,
                    padding: 16,
                    borderRadius: 12,
                    fontSize: 16,
                    color: COLORS.text,
                  }}
                  placeholder="First Name"
                  placeholderTextColor={COLORS.textMuted}
                  value={formData.first_name}
                  onChangeText={(value) => handleChange("first_name", value)}
                  editable={!loading}
                />
              </View>
              <View style={{ flex: 1 }}>
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
                  Last Name
                </Text>
                <TextInput
                  style={{
                    borderWidth: 2,
                    borderColor: COLORS.inputBorder,
                    backgroundColor: COLORS.inputBg,
                    padding: 16,
                    borderRadius: 12,
                    fontSize: 16,
                    color: COLORS.text,
                  }}
                  placeholder="Last Name"
                  placeholderTextColor={COLORS.textMuted}
                  value={formData.last_name}
                  onChangeText={(value) => handleChange("last_name", value)}
                  editable={!loading}
                />
              </View>
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
                Email
              </Text>
              <TextInput
                style={[
                  {
                    borderWidth: 2,
                    borderColor: COLORS.inputBorder,
                    backgroundColor: COLORS.inputBg,
                    padding: 16,
                    borderRadius: 12,
                    fontSize: 16,
                    color: COLORS.text,
                  },
                  errorMessage ? { borderColor: COLORS.errorBorder } : {},
                ]}
                placeholder="Email"
                placeholderTextColor={COLORS.textMuted}
                value={formData.email}
                onChangeText={(value) => handleChange("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            {errorMessage ? (
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
                  {errorMessage}
                </Text>
              </View>
            ) : null}

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
                Phone
              </Text>
              <TextInput
                style={{
                  borderWidth: 2,
                  borderColor: COLORS.inputBorder,
                  backgroundColor: COLORS.inputBg,
                  padding: 16,
                  borderRadius: 12,
                  fontSize: 16,
                  color: COLORS.text,
                }}
                placeholder="Phone Number"
                placeholderTextColor={COLORS.textMuted}
                value={formData.phone}
                onChangeText={(value) => handleChange("phone", value)}
                keyboardType="phone-pad"
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
                  borderColor: COLORS.inputBorder,
                  backgroundColor: COLORS.inputBg,
                  padding: 16,
                  borderRadius: 12,
                  fontSize: 16,
                  color: COLORS.text,
                }}
                placeholder="Password"
                placeholderTextColor={COLORS.textMuted}
                value={formData.password}
                onChangeText={(value) => handleChange("password", value)}
                secureTextEntry
                editable={!loading}
              />
            </View>

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
              onPress={handleSubmit}
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
                  Register
                </Text>
              )}
            </TouchableOpacity>

            {onSwitch && (
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: COLORS.textMuted, fontSize: 16 }}>
                  Already have an account?{" "}
                  <Text
                    onPress={onSwitch}
                    style={{
                      color: COLORS.button,
                      fontWeight: "600",
                    }}
                  >
                    Login
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
