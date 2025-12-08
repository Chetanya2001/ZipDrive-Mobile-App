import React from "react";
import {
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { hs, ms, vs } from "../../utils/responsive";
import Login from "../auth/login";
import Register from "../auth/signup";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// Theme
const COLORS = {
  background: "#0a1220",
  button: "#01d28e",
  buttonDark: "#2d3748",
  text: "#ffffff",
  textMuted: "#a0aec0",
  border: "#2d3748",
  iconBg: "#1a2332",
} as const;

// ============ COMPONENTS ============
const UserIcon = () => (
  <View style={styles.iconContainer}>
    <View style={styles.userHead} />
    <View style={styles.userBody} />
  </View>
);

const Header = () => (
  <View style={styles.header}>
    <Text style={styles.title}>Access Your Account</Text>
    <Text style={styles.subtitle}>
      Join our community to save your progress, connect{"\n"}with others, and
      more.
    </Text>
  </View>
);

const PrimaryButton = ({ title, onPress }: any) => (
  <TouchableOpacity
    style={[styles.button, styles.primaryButton]}
    onPress={onPress}
  >
    <Text style={styles.primaryButtonText}>{title}</Text>
  </TouchableOpacity>
);

const SecondaryButton = ({ title, onPress }: any) => (
  <TouchableOpacity
    style={[styles.button, styles.secondaryButton]}
    onPress={onPress}
  >
    <Text style={styles.secondaryButtonText}>{title}</Text>
  </TouchableOpacity>
);

const Divider = () => (
  <View style={styles.dividerContainer}>
    <View style={styles.dividerLine} />
    <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
    <View style={styles.dividerLine} />
  </View>
);

const SocialButton = ({ onPress, icon }: any) => (
  <TouchableOpacity style={styles.socialButton} onPress={onPress}>
    <Text style={styles.socialIcon}>{icon}</Text>
  </TouchableOpacity>
);

const SocialButtons = ({ onApplePress, onGooglePress }: any) => (
  <View style={styles.socialContainer}>
    <SocialButton icon="🍎" onPress={onApplePress} />
    <SocialButton icon="G" onPress={onGooglePress} />
  </View>
);

const Footer = () => (
  <Text style={styles.footer}>
    By continuing, you agree to our Terms of Service and Privacy Policy.
  </Text>
);

// ============ MAIN SCREEN ============
const AuthScreen = () => {
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [showRegisterModal, setShowRegisterModal] = React.useState(false);
  const [remark, setRemark] = React.useState("");

  const handleClose = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setRemark("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* ScrollView solves small device overflow */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <UserIcon />
        <Header />

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Sign Up"
            onPress={() => setShowRegisterModal(true)}
          />
          <SecondaryButton
            title="Login"
            onPress={() => setShowLoginModal(true)}
          />
        </View>

        <Divider />

        <SocialButtons
          onApplePress={() => console.log("apple")}
          onGooglePress={() => console.log("google")}
        />

        <Footer />
      </ScrollView>

      {/* Login Modal */}
      <Modal visible={showLoginModal} animationType="slide">
        <Login
          onClose={handleClose}
          onSwitch={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
          onLoginSuccess={handleClose}
          remark={remark}
        />
      </Modal>

      {/* Register Modal */}
      <Modal visible={showRegisterModal} animationType="slide">
        <Register
          onClose={handleClose}
          onSwitch={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
          onRegisterSuccess={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
            setRemark("Registration successful! Please login.");
          }}
        />
      </Modal>
    </SafeAreaView>
  );
};

// ============ STYLES ============
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ✅ FIXED: Proper top spacing
  scrollContent: {
    paddingHorizontal: hs(20),
    paddingTop: vs(50), // ✅ Increased from vs(30)
    paddingBottom: vs(80), // ✅ Increased for FAB/FAB space
    alignItems: "center",
    flexGrow: 1, // ✅ Ensures full height
  },

  // ✅ Add top margin to UserIcon for breathing room
  iconContainer: {
    width: hs(90),
    height: hs(90),
    borderRadius: hs(45),
    backgroundColor: COLORS.iconBg,
    justifyContent: "center",
    alignItems: "center",
    marginTop: vs(20), // ✅ EXTRA top spacing
    marginBottom: vs(24), // ✅ Slightly more bottom
  },

  // ✅ Rest unchanged...
  userHead: {
    width: hs(30),
    height: hs(30),
    borderRadius: hs(15),
    backgroundColor: COLORS.textMuted,
  },

  userBody: {
    width: hs(45),
    height: hs(25),
    borderRadius: hs(12),
    marginTop: vs(6),
    backgroundColor: COLORS.textMuted,
  },

  header: {
    alignItems: "center",
    marginBottom: vs(32), // ✅ Increased spacing
  },

  title: {
    fontSize: ms(22),
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: vs(12), // ✅ Increased from vs(8)
    textAlign: "center",
  },

  subtitle: {
    fontSize: ms(13),
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: ms(18),
  },

  // ... rest of styles unchanged
  buttonContainer: {
    width: "100%",
    gap: vs(10),
    marginBottom: vs(20),
  },

  button: {
    width: "100%",
    height: vs(44),
    borderRadius: hs(22),
    justifyContent: "center",
    alignItems: "center",
  },

  primaryButton: {
    backgroundColor: COLORS.button,
  },

  secondaryButton: {
    backgroundColor: COLORS.buttonDark,
  },

  primaryButtonText: {
    fontSize: ms(15),
    fontWeight: "600",
    color: COLORS.background,
  },

  secondaryButtonText: {
    fontSize: ms(15),
    fontWeight: "600",
    color: COLORS.text,
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: vs(15),
  },

  dividerLine: {
    flex: 1,
    height: vs(1),
    backgroundColor: COLORS.border,
  },

  dividerText: {
    fontSize: ms(11),
    color: COLORS.textMuted,
    marginHorizontal: hs(10),
  },

  socialContainer: {
    flexDirection: "row",
    gap: hs(15),
  },

  socialButton: {
    width: hs(100),
    height: vs(44),
    borderRadius: hs(22),
    backgroundColor: COLORS.buttonDark,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: hs(1),
    borderColor: COLORS.border,
  },

  socialIcon: {
    fontSize: ms(20),
    color: COLORS.text,
  },

  footer: {
    fontSize: ms(10.5),
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: vs(24), // ✅ Increased
    lineHeight: ms(14),
    paddingHorizontal: hs(15),
  },
});

export default AuthScreen;
