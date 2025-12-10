import { useRoute } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useCarStore } from "../store/carStore";

export default function CarDetailsScreen() {
  const route = useRoute();
  const { id } = route.params as { id: number };

  const { getCarDetails, carDetails, loading } = useCarStore();

  useEffect(() => {
    getCarDetails(id);
  }, [id]);

  if (loading || !carDetails) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#01d28e" />
        <Text style={{ color: "#8b92a8", marginTop: 10 }}>
          Loading details...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Photos */}
      {carDetails.photos?.length > 0 ? (
        <Image
          source={{ uri: carDetails.photos[0].photo_url }}
          style={styles.photo}
        />
      ) : (
        <View style={styles.emptyPhoto}>
          <Text style={{ color: "#8b92a8" }}>No Photo</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.title}>
          {carDetails.make} {carDetails.model}
        </Text>

        <Text style={styles.year}>Year: {carDetails.year}</Text>

        <Text style={styles.price}>
          ₹{carDetails.price_per_hour}
          <Text style={styles.perHour}> / hour</Text>
        </Text>

        {/* Description */}
        {carDetails.description && (
          <Text style={styles.description}>{carDetails.description}</Text>
        )}
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.heading}>Features</Text>

        {Object.entries(carDetails.features).map(([key, value]) =>
          value ? (
            <Text key={key} style={styles.featureItem}>
              • {key.replace(/_/g, " ")}
            </Text>
          ) : null
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0e1a" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0e1a",
  },
  photo: { width: "100%", height: 250 },
  emptyPhoto: {
    width: "100%",
    height: 250,
    backgroundColor: "#1a2332",
    justifyContent: "center",
    alignItems: "center",
  },
  section: { padding: 16 },
  title: { color: "#fff", fontSize: 26, fontWeight: "700" },
  year: { color: "#8b92a8", fontSize: 18, marginTop: 6 },
  price: { color: "#01d28e", fontSize: 28, marginTop: 10 },
  perHour: { color: "#8b92a8", fontSize: 14 },
  description: { color: "#8b92a8", marginTop: 12, lineHeight: 20 },
  heading: { color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 10 },
  featureItem: { color: "#8b92a8", fontSize: 16, marginBottom: 4 },
  docItem: { color: "#8b92a8", fontSize: 16, marginBottom: 6 },
  docImage: { width: "100%", height: 180, borderRadius: 10, marginTop: 12 },
});
