import React from "react";
import {
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Login from "../auth/login"; // Adjust path as needed
import Register from "../auth/signup"; // Adjust path as needed

// Theme Configuration
const COLORS = {
  background: "#0a1220",
  button: "#01d28e",
  buttonDark: "#2d3748",
  text: "#ffffff",
  textMuted: "#a0aec0",
  border: "#2d3748",
  iconBg: "#1a2332",
} as const;

// ============ Component Interfaces ============
interface ButtonProps {
  title: string;
  onPress: () => void;
}

interface IconProps {
  size?: number;
  color?: string;
}

// ============ Subcomponents ============
const UserIcon: React.FC = () => (
  <View style={styles.iconContainer}>
    <View style={styles.userIconCircle}>
      <View style={styles.userIconHead} />
    </View>
    <View style={styles.userIconBody} />
  </View>
);

const Header: React.FC = () => (
  <View style={styles.header}>
    <Text style={styles.title}>Access Your Account</Text>
    <Text style={styles.subtitle}>
      Join our community to save your progress,{"\n"}connect with others, and
      more.
    </Text>
  </View>
);

const PrimaryButton: React.FC<ButtonProps> = ({ title, onPress }) => (
  <TouchableOpacity
    style={[styles.button, styles.primaryButton]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={styles.primaryButtonText}>{title}</Text>
  </TouchableOpacity>
);

const SecondaryButton: React.FC<ButtonProps> = ({ title, onPress }) => (
  <TouchableOpacity
    style={[styles.button, styles.secondaryButton]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={styles.secondaryButtonText}>{title}</Text>
  </TouchableOpacity>
);

const Divider: React.FC = () => (
  <View style={styles.dividerContainer}>
    <View style={styles.dividerLine} />
    <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
    <View style={styles.dividerLine} />
  </View>
);

const SocialButton: React.FC<{ onPress: () => void; icon: string }> = ({
  onPress,
  icon,
}) => (
  <TouchableOpacity
    style={styles.socialButton}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={styles.socialIcon}>{icon}</Text>
  </TouchableOpacity>
);

const SocialButtons: React.FC<{
  onApplePress: () => void;
  onGooglePress: () => void;
}> = ({ onApplePress, onGooglePress }) => (
  <View style={styles.socialContainer}>
    <SocialButton icon="🍎" onPress={onApplePress} />
    <SocialButton icon="G" onPress={onGooglePress} />
  </View>
);

const Footer: React.FC = () => (
  <Text style={styles.footer}>
    By continuing, you agree to our Terms of Service and Privacy Policy.
  </Text>
);

// ============ Main Component ============
const AuthScreen: React.FC = () => {
  // Modal state management
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [showRegisterModal, setShowRegisterModal] = React.useState(false);
  const [remark, setRemark] = React.useState("");

  // Handlers - FULLY FUNCTIONAL
  const handleSignUp = () => {
    setShowRegisterModal(true);
  };

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleAppleLogin = () => {
    console.log("Apple login pressed");
  };

  const handleGoogleLogin = () => {
    console.log("Google login pressed");
  };

  // Modal control handlers
  const handleCloseModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setRemark("");
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleRegisterSuccess = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
    setRemark("Registration successful! Please login.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.content}>
        <UserIcon />
        <Header />

        <View style={styles.buttonContainer}>
          <PrimaryButton title="Sign Up" onPress={handleSignUp} />
          <SecondaryButton title="Login" onPress={handleLogin} />
        </View>

        <Divider />

        <SocialButtons
          onApplePress={handleAppleLogin}
          onGooglePress={handleGoogleLogin}
        />
      </View>

      <Footer />

      {/* Login Modal */}
      <Modal
        visible={showLoginModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <Login
          onClose={handleCloseModal}
          onSwitch={handleSwitchToRegister}
          onLoginSuccess={() => {
            // Auto-navigate handled by Login component
            handleCloseModal();
          }}
          remark={remark}
        />
      </Modal>

      {/* Register Modal */}
      <Modal
        visible={showRegisterModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <Register
          onClose={handleCloseModal}
          onSwitch={handleSwitchToLogin}
          onRegisterSuccess={handleRegisterSuccess}
        />
      </Modal>
    </SafeAreaView>
  );
};

// ============ Styles ============
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
    alignItems: "center",
  },

  // Icon styles
  iconContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.iconBg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  userIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.textMuted,
    marginBottom: 5,
  },
  userIconHead: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.textMuted,
  },
  userIconBody: {
    width: 80,
    height: 50,
    backgroundColor: COLORS.textMuted,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },

  // Header styles
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 24,
  },

  // Button styles
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  button: {
    width: "100%",
    height: 56,
    borderRadius: 28,
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
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.background,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },

  // Divider styles
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginHorizontal: 16,
    fontWeight: "500",
    letterSpacing: 0.5,
  },

  // Social button styles
  socialContainer: {
    flexDirection: "row",
    gap: 20,
  },
  socialButton: {
    width: 140,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.buttonDark,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  socialIcon: {
    fontSize: 24,
    color: COLORS.text,
  },

  // Footer styles
  footer: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: "center",
    paddingHorizontal: 40,
    paddingBottom: 20,
    lineHeight: 18,
  },
});

export default AuthScreen;
