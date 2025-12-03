// app/(tabs)/my-bookings.tsx

import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ────────────────────── THEME ──────────────────────
const COLORS = {
  background: "#0a1220",
  button: "#01d28e",
  cardBg: "#1a2332",
  text: "#ffffff",
  textMuted: "#8b92a8",
  statusConfirmed: "#01d28e",
} as const;

// ────────────────────── TYPES & DATA ──────────────────────
type TabType = "upcoming" | "completed" | "cancelled";

interface Booking {
  id: string;
  status: "confirmed" | "cancelled";
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
}

const BOOKINGS_DATA: Record<TabType, Booking[]> = {
  upcoming: [
    {
      id: "1",
      status: "confirmed",
      title: "Deep Tissue Massage",
      date: "Mon, 28 Oct",
      time: "10:00 AM",
      location: "Serenity Spa, Downtown",
      image:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
    },
    {
      id: "2",
      status: "confirmed",
      title: "Classic Haircut",
      date: "Wed, 30 Oct",
      time: "04:30 PM",
      location: "The Barber Shop",
      image:
        "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop",
    },
  ],
  completed: [
    {
      id: "3",
      status: "confirmed",
      title: "Swedish Massage",
      date: "Mon, 21 Oct",
      time: "02:00 PM",
      location: "Wellness Center",
      image:
        "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=300&fit=crop",
    },
  ],
  cancelled: [
    {
      id: "4",
      status: "cancelled",
      title: "Facial Treatment",
      date: "Fri, 18 Oct",
      time: "11:00 AM",
      location: "Beauty Studio",
      image:
        "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop",
    },
  ],
};

// ────────────────────── COMPONENTS ──────────────────────
const Header = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Bookings</Text>

        <View style={styles.headerSpacer} />
      </View>
    </View>
  );
};

const TabBar = ({
  activeTab,
  onChange,
}: {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}) => (
  <View style={styles.tabContainer}>
    {(["upcoming", "completed", "cancelled"] as const).map((tab) => (
      <TouchableOpacity
        key={tab}
        onPress={() => onChange(tab)}
        style={styles.tab}
      >
        <Text
          style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </Text>
        {activeTab === tab && <View style={styles.tabIndicator} />}
      </TouchableOpacity>
    ))}
  </View>
);

const BookingCard = ({ booking }: { booking: Booking }) => (
  <View style={styles.card}>
    <View style={styles.cardContent}>
      <View style={styles.cardLeft}>
        <View
          style={[
            styles.statusBadge,
            booking.status === "cancelled" && styles.statusCancelled,
          ]}
        >
          <Text style={styles.statusText}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>

        <Text style={styles.cardTitle}>{booking.title}</Text>
        <Text style={styles.cardDateTime}>
          {booking.date} • {booking.time}
        </Text>
        <Text style={styles.cardLocation}>{booking.location}</Text>
      </View>

      <Image source={{ uri: booking.image }} style={styles.cardImage} />
    </View>
  </View>
);

const EmptyState = ({ message }: { message: string }) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

// ────────────────────── MAIN SCREEN ──────────────────────
export default function MyBookingsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <Header />
      <TabBar activeTab={activeTab} onChange={setActiveTab} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {BOOKINGS_DATA[activeTab].length === 0 ? (
          <EmptyState message={`No ${activeTab} bookings`} />
        ) : (
          BOOKINGS_DATA[activeTab].map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

// ────────────────────── STYLES ──────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: { fontSize: 28, color: COLORS.text, fontWeight: "200" },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    flex: 1,
    textAlign: "center",
    marginRight: 40,
  },
  headerSpacer: { width: 40 },

  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 30,
  },
  tab: { paddingVertical: 8, position: "relative" },
  tabText: { fontSize: 16, fontWeight: "600", color: COLORS.textMuted },
  tabTextActive: { color: COLORS.button },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.button,
    borderRadius: 2,
  },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
  },
  cardContent: { flexDirection: "row", padding: 20 },
  cardLeft: { flex: 1, paddingRight: 16 },
  cardImage: { width: 120, height: 140, borderRadius: 16 },

  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(1, 210, 142, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  statusCancelled: { backgroundColor: "rgba(239, 68, 68, 0.15)" },
  statusText: {
    color: COLORS.statusConfirmed,
    fontSize: 12,
    fontWeight: "600",
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  cardDateTime: { fontSize: 14, color: COLORS.textMuted, marginBottom: 4 },
  cardLocation: { fontSize: 14, color: COLORS.textMuted, marginBottom: 16 },

  emptyState: { paddingVertical: 80, alignItems: "center" },
  emptyText: { fontSize: 16, color: COLORS.textMuted },
});
