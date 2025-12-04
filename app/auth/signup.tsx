import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { hs, ms, vs } from "../../utils/responsive";
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

  useEffect(() => {
    if (!loading && useAuthStore.getState().user && !errorMessage) {
      onRegisterSuccess?.();
      onClose?.();
      router.replace("/(tabs)");
    }
  }, [loading]);

  const handleChange = (name: keyof UserRegister, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleRoleToggle = () => {
    setFormData((prev) => ({
      ...prev,
      role: prev.role === "guest" ? "host" : "guest",
    }));
  };

  const handleSubmit = async () => {
    setErrorMessage("");

    if (!formData.email || !formData.password || !formData.first_name) {
      setErrorMessage("Please fill required fields");
      return;
    }

    try {
      const name = `${formData.first_name} ${formData.last_name}`.trim();

      await signup(
        name,
        formData.email,
        formData.password,
        formData.role,
        formData.phone
      );
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
          padding: hs(24),
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ gap: vs(24) }}>
          {onClose && (
            <TouchableOpacity
              onPress={onClose}
              style={{ alignSelf: "flex-end" }}
              hitSlop={{
                top: hs(12),
                bottom: hs(12),
                left: hs(12),
                right: hs(12),
              }}
            >
              <Text
                style={{
                  fontSize: ms(26),
                  color: COLORS.textMuted,
                  fontWeight: "bold",
                }}
              >
                ×
              </Text>
            </TouchableOpacity>
          )}

          <Text
            style={{
              fontSize: ms(30),
              fontWeight: "700",
              color: COLORS.text,
            }}
          >
            Create Account
          </Text>

          {/* Role Toggle */}
          <View style={{ gap: vs(10) }}>
            <Text
              style={{
                fontSize: ms(16),
                fontWeight: "600",
                color: COLORS.text,
              }}
            >
              Role: {formData.role}
            </Text>

            <TouchableOpacity
              onPress={handleRoleToggle}
              disabled={loading}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: vs(12),
                paddingHorizontal: hs(16),
                width: hs(130),
                borderRadius: ms(24),
                borderWidth: 2,
                justifyContent:
                  formData.role === "host" ? "flex-end" : "flex-start",
                borderColor:
                  formData.role === "host" ? COLORS.button : COLORS.inputBorder,
                backgroundColor:
                  formData.role === "host"
                    ? COLORS.button + "25"
                    : COLORS.inputBg,
              }}
            >
              <Text
                style={{
                  fontSize: ms(14),
                  fontWeight: "600",
                  color:
                    formData.role === "host" ? COLORS.button : COLORS.textMuted,
                }}
              >
                {formData.role}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={{ gap: vs(18) }}>
            {/* First & Last Name */}
            <View style={{ flexDirection: "row", gap: hs(12) }}>
              {/* First */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: ms(12),
                    fontWeight: "600",
                    color: COLORS.textMuted,
                    marginBottom: vs(6),
                    letterSpacing: 0.5,
                  }}
                >
                  First Name
                </Text>
                <TextInput
                  style={{
                    borderWidth: 2,
                    borderColor: COLORS.inputBorder,
                    backgroundColor: COLORS.inputBg,
                    padding: hs(14),
                    borderRadius: ms(10),
                    fontSize: ms(15),
                    color: COLORS.text,
                  }}
                  placeholder="First Name"
                  placeholderTextColor={COLORS.textMuted}
                  value={formData.first_name}
                  onChangeText={(value) => handleChange("first_name", value)}
                />
              </View>

              {/* Last */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: ms(12),
                    fontWeight: "600",
                    color: COLORS.textMuted,
                    marginBottom: vs(6),
                    letterSpacing: 0.5,
                  }}
                >
                  Last Name
                </Text>
                <TextInput
                  style={{
                    borderWidth: 2,
                    borderColor: COLORS.inputBorder,
                    backgroundColor: COLORS.inputBg,
                    padding: hs(14),
                    borderRadius: ms(10),
                    fontSize: ms(15),
                    color: COLORS.text,
                  }}
                  placeholder="Last Name"
                  placeholderTextColor={COLORS.textMuted}
                  value={formData.last_name}
                  onChangeText={(value) => handleChange("last_name", value)}
                />
              </View>
            </View>

            {/* Email */}
            <View>
              <Text
                style={{
                  fontSize: ms(12),
                  fontWeight: "600",
                  color: COLORS.textMuted,
                  marginBottom: vs(6),
                }}
              >
                Email
              </Text>
              <TextInput
                style={{
                  borderWidth: 2,
                  borderColor: errorMessage
                    ? COLORS.errorBorder
                    : COLORS.inputBorder,
                  backgroundColor: COLORS.inputBg,
                  padding: hs(14),
                  borderRadius: ms(10),
                  fontSize: ms(15),
                  color: COLORS.text,
                }}
                placeholder="Email"
                placeholderTextColor={COLORS.textMuted}
                value={formData.email}
                onChangeText={(value) => handleChange("email", value)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Error */}
            {errorMessage ? (
              <View
                style={{
                  backgroundColor: COLORS.errorBg,
                  padding: hs(12),
                  borderRadius: ms(10),
                  borderLeftWidth: 4,
                  borderLeftColor: COLORS.errorBorder,
                }}
              >
                <Text style={{ color: COLORS.text, fontSize: ms(14) }}>
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            {/* Phone */}
            <View>
              <Text
                style={{
                  fontSize: ms(12),
                  fontWeight: "600",
                  color: COLORS.textMuted,
                  marginBottom: vs(6),
                }}
              >
                Phone
              </Text>
              <TextInput
                style={{
                  borderWidth: 2,
                  borderColor: COLORS.inputBorder,
                  backgroundColor: COLORS.inputBg,
                  padding: hs(14),
                  borderRadius: ms(10),
                  fontSize: ms(15),
                  color: COLORS.text,
                }}
                placeholder="Phone Number"
                placeholderTextColor={COLORS.textMuted}
                value={formData.phone}
                keyboardType="phone-pad"
                onChangeText={(value) => handleChange("phone", value)}
              />
            </View>

            {/* Password */}
            <View>
              <Text
                style={{
                  fontSize: ms(12),
                  fontWeight: "600",
                  color: COLORS.textMuted,
                  marginBottom: vs(6),
                }}
              >
                Password
              </Text>
              <TextInput
                style={{
                  borderWidth: 2,
                  borderColor: COLORS.inputBorder,
                  backgroundColor: COLORS.inputBg,
                  padding: hs(14),
                  borderRadius: ms(10),
                  fontSize: ms(15),
                  color: COLORS.text,
                }}
                placeholder="Password"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry
                value={formData.password}
                onChangeText={(value) => handleChange("password", value)}
              />
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={{
                paddingVertical: vs(14),
                borderRadius: ms(12),
                alignItems: "center",
                backgroundColor: loading ? COLORS.buttonDark : COLORS.button,
              }}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.background} />
              ) : (
                <Text
                  style={{
                    color: COLORS.background,
                    fontSize: ms(16),
                    fontWeight: "600",
                  }}
                >
                  Register
                </Text>
              )}
            </TouchableOpacity>

            {/* Login Switch */}
            {onSwitch && (
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: COLORS.textMuted, fontSize: ms(14) }}>
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
