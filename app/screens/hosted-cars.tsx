// app/(tabs)/hosted-cars.tsx

import React, { useEffect, memo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import useHostedCarsStore from "../store/hostedCarStore";
import useAuthStore from "../store/authStore";

// ────────────────────── REAL BACKEND CAR TYPE ──────────────────────
export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price_per_hour: number;
  kms_driven?: number;
  available_from?: string;
  available_till?: string;
  documents: {
    rc_image_front?: string;
    rc_image_back?: string;
    owner_name?: string;
    insurance_company?: string;
    insurance_image?: string;
    rc_number?: string;
    rc_valid_till?: string;
    city_of_registration?: string;
  } | null;
  photos: string[]; // ← this is what comes from CarPhoto model
}

// ────────────────────── COMPONENTS ──────────────────────
const Header = memo(() => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, backgroundColor: "#0a1220e1a" }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Listed Cars</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Add Car</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const CarCard = memo(({ car }: { car: Car }) => {
  const router = useRouter();
  const mainPhoto = car.photos[0] || null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/car-details/${car.id}` as any)}
    >
      {mainPhoto ? (
        <Image source={{ uri: mainPhoto }} style={styles.carImage} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>No Photo</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.carName}>
          {car.make} {car.model}
        </Text>
        <Text style={styles.year}>• {car.year}</Text>

        <Text style={styles.price}>
          ₹{car.price_per_hour}
          <Text style={styles.perHour}> / hour</Text>
        </Text>

        {car.documents?.rc_number && (
          <Text style={styles.rc}>RC: {car.documents.rc_number}</Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.photosCount}>{car.photos.length} photos</Text>
          <Text style={styles.viewDetails}>View Details →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const EmptyState = () => (
  <View style={styles.empty}>
    <Text style={styles.emptyIcon}>Car</Text>
    <Text style={styles.emptyTitle}>No cars listed yet</Text>
    <Text style={styles.emptySubtitle}>
      Tap "+ Add Car" to list your first vehicle
    </Text>
  </View>
);

// ────────────────────── MAIN SCREEN ──────────────────────
export default function HostedCarsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { cars, loading, error, fetchMyCars } = useHostedCarsStore();

  useEffect(() => {
    if (user?.role === "host") {
      fetchMyCars();
    }
  }, [user]);

  const handleRefresh = () => fetchMyCars();

  if (loading && cars.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#01d28e" />
        <Text style={styles.loadingText}>Loading your cars...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load cars</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchMyCars}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header />

      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CarCard car={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={<EmptyState />}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/add-car" as any)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────── STYLES ──────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0e1a" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0e1a",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#fff" },
  addBtn: {
    backgroundColor: "#01d28e",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addBtnText: { color: "#000", fontWeight: "600" },

  list: { padding: 16, paddingBottom: 100 },

  card: {
    backgroundColor: "#1a2332",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 5,
  },
  carImage: { width: "100%", height: 200 },
  placeholder: {
    height: 200,
    backgroundColor: "#2d3748",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: { color: "#8b92a8", fontSize: 16 },

  info: { padding: 16 },
  carName: { fontSize: 20, fontWeight: "700", color: "#fff" },
  year: { fontSize: 16, color: "#8b92a8", marginTop: 4 },
  price: { fontSize: 22, fontWeight: "800", color: "#01d28e", marginTop: 8 },
  perHour: { fontSize: 14, color: "#8b92a8" },
  rc: { fontSize: 14, color: "#8b92a8", marginTop: 6 },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  photosCount: { color: "#8b92a8", fontSize: 14 },
  viewDetails: { color: "#01d28e", fontWeight: "600" },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: { fontSize: 80, marginBottom: 20 },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  emptySubtitle: { fontSize: 16, color: "#8b92a8", textAlign: "center" },

  loadingText: { marginTop: 16, color: "#8b92a8" },
  errorText: { color: "#ef4444", fontSize: 18, marginBottom: 16 },
  retryBtn: {
    backgroundColor: "#01d28e",
    padding: 12,
    borderRadius: 20,
    paddingHorizontal: 24,
  },
  retryText: { color: "#000", fontWeight: "700" },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#01d28e",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  fabText: { fontSize: 32, fontWeight: "300", color: "#000" },
});
