// app/(tabs)/hosted-cars.tsx

import React, { memo, useCallback } from "react";
import {
  FlatList,
  Image,
  ListRenderItem,
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
  statusAvailable: "#8b92a8",
  statusBooked: "#f59e0b",
} as const;

// ────────────────────── TYPES & DATA ──────────────────────
interface Car {
  id: string;
  title: string;
  status: "available" | "booked";
  image: string;
}

const CARS_DATA: Car[] = [
  {
    id: "1",
    title: "Tesla Model 3",
    status: "available",
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929ceb63?w=800&h=400&fit=crop",
  },
  {
    id: "2",
    title: "Ford Mustang Mach-E",
    status: "booked",
    image:
      "https://images.unsplash.com/photo-1615212776469-5be61d68bc3f?w=800&h=400&fit=crop",
  },
  {
    id: "3",
    title: "BMW i4",
    status: "available",
    image:
      "https://images.unsplash.com/photo-1641397536942-9a3d5362368b?w=800&h=400&fit=crop",
  },
];

// ────────────────────── COMPONENTS ──────────────────────
const Header = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{ paddingTop: insets.top, backgroundColor: COLORS.background }}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Hosted Cars</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CarCard = memo(({ car }: { car: Car }) => (
  <View style={styles.card}>
    <Image
      source={{ uri: car.image }}
      style={styles.cardImage}
      resizeMode="cover"
    />

    <View style={styles.cardFooter}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardTitle}>{car.title}</Text>
        <View style={styles.statusContainer}>
          {car.status === "booked" && <Text style={styles.statusDot}>•</Text>}
          <Text
            style={[
              styles.statusText,
              car.status === "booked"
                ? { color: COLORS.statusBooked }
                : { color: COLORS.statusAvailable },
            ]}
          >
            {car.status.charAt(0).toUpperCase() + car.status.slice(1)}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.detailsButton}>
        <Text style={styles.detailsText}>Details</Text>
      </TouchableOpacity>
    </View>
  </View>
));

const AddCarButton = () => (
  <TouchableOpacity style={styles.addButton}>
    <Text style={styles.addText}>+ Add a Car</Text>
  </TouchableOpacity>
);

const EmptyState = ({ message }: { message: string }) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

// ────────────────────── MAIN SCREEN ──────────────────────
export default function MyHostedCarsScreen() {
  const renderItem: ListRenderItem<Car> = useCallback(
    ({ item }) => <CarCard car={item} />,
    []
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <Header />

      {CARS_DATA.length === 0 ? (
        <EmptyState message="No hosted cars" />
      ) : (
        <FlatList
          data={CARS_DATA}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<AddCarButton />}
        />
      )}
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
  headerTitle: { fontSize: 24, fontWeight: "700", color: COLORS.text, flex: 1 },
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  searchIcon: { fontSize: 20, color: COLORS.text },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: 180, borderRadius: 16 },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  cardLeft: { flex: 1 },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  statusContainer: { flexDirection: "row", alignItems: "center" },
  statusDot: { fontSize: 16, color: COLORS.statusBooked, marginRight: 4 },
  statusText: { fontSize: 14, fontWeight: "500" },
  detailsButton: {
    backgroundColor: "rgba(139, 146, 168, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  detailsText: { fontSize: 14, fontWeight: "600", color: COLORS.text },

  addButton: {
    backgroundColor: COLORS.button,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  addText: { fontSize: 16, fontWeight: "700", color: COLORS.text },

  emptyState: { flex: 1, paddingVertical: 80, alignItems: "center" },
  emptyText: { fontSize: 16, color: COLORS.textMuted },
});
