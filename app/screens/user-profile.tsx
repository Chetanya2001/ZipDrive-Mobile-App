import React from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { hs, ms, vs } from "../../utils/responsive";
import useAuthStore from "../store/authStore";

// Theme Colors
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

// Header Component
const Header = ({ onEditPress }: { onEditPress: () => void }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>Profile</Text>
    <TouchableOpacity onPress={onEditPress}>
      <Text style={styles.editButton}>Edit</Text>
    </TouchableOpacity>
  </View>
);

// Profile Info Component
const ProfileInfo = () => (
  <View style={styles.profileContainer}>
    <View style={styles.avatarContainer}>
      <Image
        source={{ uri: "https://i.pravatar.cc/300?img=12" }}
        style={styles.avatar}
      />
      <View style={styles.verifiedBadge}>
        <Text style={styles.checkmark}>✓</Text>
      </View>
    </View>

    <Text style={styles.userName}>Alex Johnson</Text>

    <View style={styles.badgeContainer}>
      <View style={styles.superhostBadge}>
        <Text style={styles.superhostText}>SUPERHOST</Text>
      </View>
      <Text style={styles.rating}>• 4.9 Stars</Text>
    </View>

    <Text style={styles.memberSince}>Member since 2021</Text>
  </View>
);

// Menu Item Component
const MenuItem = ({
  icon,
  title,
  subtitle,
  onPress,
  isLast = false,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  isLast?: boolean;
}) => (
  <>
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <View style={styles.iconContainer}>
          <Text style={styles.menuIcon}>{icon}</Text>
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
    {!isLast && <View style={styles.divider} />}
  </>
);

// Section Component
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionCard}>{children}</View>
  </View>
);

// Logout Button Component
const LogoutButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.logoutButton} onPress={onPress}>
    <View style={styles.logoutIconContainer}>
      <Text style={styles.logoutIcon}>⎋</Text>
    </View>
    <Text style={styles.logoutText}>Log Out</Text>
  </TouchableOpacity>
);

// ============ MAIN SCREEN ============
const UserProfileScreen = () => {
  const { user, logout } = useAuthStore();
  const handleEdit = () => console.log("Edit profile");
  const handleMyCars = () => console.log("My Cars");
  const handleMyBookings = () => console.log("My Bookings");
  const handleAccountSettings = () => console.log("Account Settings");
  const handleHelpSupport = () => console.log("Help & Support");
  const handleLogout = async () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try {
            await logout(); // Clears Zustand + AsyncStorage
            console.log("✅ User logged out successfully");
          } catch (error) {
            console.error("❌ Logout error:", error);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header onEditPress={handleEdit} />
        <ProfileInfo />

        {/* <Section title="Hosting">
          <MenuItem icon="🚗" title="My Cars" onPress={handleMyCars} />
          <MenuItem
            icon="📅"
            title="My Bookings"
            subtitle="2 active, 14 past"
            onPress={handleMyBookings}
            isLast
          />
        </Section> */}

        {/* <Section title="Account">
          <MenuItem
            icon="⚙"
            title="Account Settings"
            onPress={handleAccountSettings}
          />
          <MenuItem
            icon="?"
            title="Help & Support"
            onPress={handleHelpSupport}
            isLast
          />
        </Section> */}

        <LogoutButton onPress={handleLogout} />

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============ STYLES ============
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    paddingBottom: vs(30),
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: hs(20),
    paddingTop: vs(8),
    paddingBottom: vs(12),
  },

  headerTitle: {
    fontSize: ms(24),
    fontWeight: "700",
    color: COLORS.text,
  },

  editButton: {
    fontSize: ms(16),
    fontWeight: "600",
    color: COLORS.button,
  },

  // Profile Section
  profileContainer: {
    alignItems: "center",
    paddingHorizontal: hs(20),
    paddingTop: vs(8),
    paddingBottom: vs(24),
  },

  avatarContainer: {
    position: "relative",
    marginBottom: vs(12),
  },

  avatar: {
    width: hs(100),
    height: hs(100),
    borderRadius: hs(50),
  },

  verifiedBadge: {
    position: "absolute",
    bottom: vs(0),
    right: hs(0),
    width: hs(30),
    height: hs(30),
    borderRadius: hs(15),
    backgroundColor: COLORS.button,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: hs(3),
    borderColor: COLORS.background,
  },

  checkmark: {
    fontSize: ms(16),
    fontWeight: "700",
    color: COLORS.background,
  },

  userName: {
    fontSize: ms(22),
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: vs(8),
  },

  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: vs(4),
  },

  superhostBadge: {
    backgroundColor: COLORS.button,
    paddingHorizontal: hs(10),
    paddingVertical: vs(4),
    borderRadius: hs(12),
  },

  superhostText: {
    fontSize: ms(10),
    fontWeight: "700",
    color: COLORS.background,
    letterSpacing: 0.5,
  },

  rating: {
    fontSize: ms(14),
    fontWeight: "400",
    color: COLORS.text,
    marginLeft: hs(6),
  },

  memberSince: {
    fontSize: ms(13),
    color: COLORS.textMuted,
  },

  // Section
  section: {
    marginBottom: vs(16),
    paddingHorizontal: hs(20),
  },

  sectionTitle: {
    fontSize: ms(18),
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: vs(10),
  },

  sectionCard: {
    backgroundColor: COLORS.buttonDark,
    borderRadius: hs(16),
    overflow: "hidden",
  },

  // Menu Item
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: vs(14),
    paddingHorizontal: hs(16),
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: hs(40),
    height: hs(40),
    borderRadius: hs(20),
    backgroundColor: COLORS.iconBg,
    justifyContent: "center",
    alignItems: "center",
    marginRight: hs(12),
  },

  menuIcon: {
    fontSize: ms(18),
  },

  menuTextContainer: {
    flex: 1,
  },

  menuTitle: {
    fontSize: ms(15),
    fontWeight: "500",
    color: COLORS.text,
  },

  menuSubtitle: {
    fontSize: ms(12),
    color: COLORS.textMuted,
    marginTop: vs(2),
  },

  chevron: {
    fontSize: ms(26),
    color: COLORS.textMuted,
    fontWeight: "300",
  },

  divider: {
    height: vs(1),
    backgroundColor: COLORS.border,
    marginLeft: hs(68),
  },

  // Logout Button
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: hs(20),
    marginTop: vs(4),
    paddingVertical: vs(14),
    backgroundColor: "transparent",
    borderRadius: hs(16),
    borderWidth: hs(1.5),
    borderColor: "#dc2626",
  },

  logoutIconContainer: {
    marginRight: hs(6),
  },

  logoutIcon: {
    fontSize: ms(18),
    color: "#dc2626",
  },

  logoutText: {
    fontSize: ms(15),
    fontWeight: "600",
    color: "#dc2626",
  },

  // Version
  version: {
    fontSize: ms(11),
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: vs(20),
    marginBottom: vs(16),
  },
});

export default UserProfileScreen;
