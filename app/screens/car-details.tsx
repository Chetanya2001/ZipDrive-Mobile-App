import { useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
} from "react-native";
import { useCarStore } from "../store/carStore";
import { hs, vs, ms } from "../../utils/responsive";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function CarDetailsScreen() {
  const route = useRoute();
  const { id } = route.params as { id: number };

  const { getCarDetails, carDetails, loading } = useCarStore();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    getCarDetails(id);
  }, [id]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  if (loading || !carDetails) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#01d28e" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f1820" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Carousel */}
        {carDetails.photos?.length > 0 ? (
          <View style={styles.carouselWrapper}>
            <FlatList
              data={carDetails.photos}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              keyExtractor={(item) => item.photo_url}
              decelerationRate="fast"
              snapToInterval={SCREEN_WIDTH}
              renderItem={({ item }) => (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: item.photo_url }}
                    style={styles.photo}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlay} />
                </View>
              )}
            />

            {/* Pagination Dots */}
            {carDetails.photos.length > 1 && (
              <View style={styles.paginationContainer}>
                {carDetails.photos.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === activeIndex && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.emptyPhoto}>
            <Text style={styles.emptyPhotoText}>No Photo Available</Text>
          </View>
        )}

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.titleRow}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>
                  {carDetails.make} {carDetails.model}
                </Text>
                <Text style={styles.year}>{carDetails.year}</Text>
              </View>
            </View>
            {/* <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>Sports Car</Text>
            </View> */}
          </View>

          {/* Description Section */}
          {carDetails.description && (
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Description</Text>
              <Text style={styles.description}>{carDetails.description}</Text>
            </View>
          )}

          {/* Features Section */}
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Features</Text>

            <View style={styles.featuresGrid}>
              {Object.entries(carDetails.features).map(([key, value]) => {
                if (!value) return null;

                const featureName = key.replace(/_/g, " ");
                let icon = "⚙️";

                if (key.includes("ac")) icon = "❄️";
                else if (key.includes("music")) icon = "🎵";
                else if (key.includes("gps")) icon = "📍";
                else if (key.includes("automatic")) icon = "⚙️";
                else if (key.includes("bluetooth")) icon = "📶";
                else if (key.includes("sunroof")) icon = "☀️";

                return (
                  <View key={key} style={styles.featureCard}>
                    <View style={styles.featureIconContainer}>
                      <Text style={styles.featureIcon}>{icon}</Text>
                    </View>
                    <Text style={styles.featureName}>
                      {featureName.charAt(0).toUpperCase() +
                        featureName.slice(1)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.rentButton}
          activeOpacity={0.8}
          onPress={() => console.log("Book Now pressed")}
        >
          <Text style={styles.rentButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1820",
  },
  scrollView: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f1820",
  },
  loadingText: {
    color: "#8b92a8",
    marginTop: vs(10),
    fontSize: ms(14),
  },
  carouselWrapper: {
    position: "relative",
    height: vs(320),
    backgroundColor: "#000",
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: vs(320),
    position: "relative",
  },
  photo: {
    width: SCREEN_WIDTH,
    height: vs(320),
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: vs(80),
    backgroundColor: "rgba(15, 24, 32, 0.3)",
  },
  shadowOverlay1: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: vs(100),
    backgroundColor: "rgba(15, 24, 32, 0.4)",
  },
  shadowOverlay2: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: vs(50),
    backgroundColor: "rgba(15, 24, 32, 0.8)",
  },
  emptyPhoto: {
    width: "100%",
    height: vs(320),
    backgroundColor: "#1a2332",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyPhotoText: {
    color: "#8b92a8",
    fontSize: ms(14),
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: vs(20),
    left: 0,
    right: 0,
    zIndex: 10,
  },
  paginationDot: {
    width: hs(8),
    height: hs(8),
    borderRadius: hs(4),
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: hs(4),
  },
  paginationDotActive: {
    backgroundColor: "#01d28e",
    width: hs(24),
  },
  contentContainer: {
    backgroundColor: "#0f1820",
    borderTopLeftRadius: ms(24),
    borderTopRightRadius: ms(24),
    marginTop: vs(-32),
    paddingTop: vs(24),
    paddingBottom: vs(100),
    zIndex: 2,
  },
  headerSection: {
    paddingHorizontal: hs(20),
    paddingBottom: vs(16),
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: vs(12),
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: ms(26),
    fontWeight: "700",
    marginBottom: vs(4),
  },
  year: {
    color: "#8b92a8",
    fontSize: ms(16),
    fontWeight: "500",
  },
  categoryBadge: {
    backgroundColor: "#1a2332",
    paddingHorizontal: hs(16),
    paddingVertical: vs(8),
    borderRadius: ms(12),
    alignSelf: "flex-start",
  },
  categoryText: {
    color: "#01d28e",
    fontSize: ms(13),
    fontWeight: "600",
  },
  section: {
    paddingHorizontal: hs(20),
    marginTop: vs(24),
  },
  sectionHeading: {
    color: "#fff",
    fontSize: ms(20),
    fontWeight: "700",
    marginBottom: vs(16),
  },
  description: {
    color: "#8b92a8",
    fontSize: ms(14),
    lineHeight: ms(22),
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: hs(-6),
  },
  featureCard: {
    width: `${100 / 3 - 4}%`,
    backgroundColor: "#1a2332",
    borderRadius: ms(16),
    padding: hs(16),
    margin: hs(6),
    alignItems: "center",
    justifyContent: "center",
    minHeight: vs(110),
  },
  featureIconContainer: {
    width: hs(48),
    height: hs(48),
    borderRadius: hs(24),
    backgroundColor: "rgba(1, 210, 142, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: vs(8),
  },
  featureIcon: {
    fontSize: ms(24),
  },
  featureName: {
    color: "#fff",
    fontSize: ms(12),
    textAlign: "center",
    fontWeight: "500",
  },
  bottomSpacing: {
    height: vs(20),
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#0f1820",
    paddingHorizontal: hs(20),
    paddingTop: vs(12),
    paddingBottom: Platform.OS === "ios" ? vs(32) : vs(20),
    borderTopWidth: 1,
    borderTopColor: "#1a2332",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  rentButton: {
    backgroundColor: "#01d28e",
    borderRadius: ms(16),
    paddingVertical: vs(16),
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#01d28e",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  rentButtonText: {
    color: "#0f1820",
    fontSize: ms(16),
    fontWeight: "700",
  },
});
