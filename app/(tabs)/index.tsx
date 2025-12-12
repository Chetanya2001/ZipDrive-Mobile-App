// ZipDrivePremiumScreen.tsx - Fully Dynamic (No Hardcoded Data)
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { hs, ms, vs } from "../../utils/responsive";
import { useCarStore } from "../store/carStore";

const { width, height } = Dimensions.get("window");

/* ---------------------- Types ---------------------- */
interface Feature {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
}

interface FeatureCardProps {
  feature: Feature;
}

/* ---------------------- Features (Static - OK to keep) ---------------------- */
const FEATURES: Feature[] = [
  {
    id: "f1",
    emoji: "🚘",
    title: "Premium Fleet",
    subtitle: "BMW, Audi, Mercedes & more",
  },
  {
    id: "f2",
    emoji: "⚡",
    title: "Instant Booking",
    subtitle: "Unlock & drive instantly",
  },
  {
    id: "f3",
    emoji: "💎",
    title: "Elite Support",
    subtitle: "24/7 assistance",
  },
];

/* ---------------------- Small Cards ---------------------- */
const FeatureCard = memo<FeatureCardProps>(({ feature }) => (
  <BlurView intensity={60} tint="dark" style={styles.featureCard}>
    <View style={styles.featureIcon}>
      <Text style={styles.featureEmoji}>{feature.emoji}</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.featureTitle}>{feature.title}</Text>
      <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
    </View>
  </BlurView>
));
FeatureCard.displayName = "FeatureCard";

/* ---------------------- Screen ---------------------- */
const ZipDrivePremiumScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const heroScale = useRef(new Animated.Value(1)).current;
  const heroImageAnim = useRef(new Animated.Value(1)).current;

  // Car Store
  const { cars, loading: carsLoading, getCars } = useCarStore();

  // Fetch cars on mount
  useEffect(() => {
    getCars();
  }, [getCars]);

  // Hero breathing animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(heroScale, {
          toValue: 1.03,
          duration: 3500,
          useNativeDriver: true,
        }),
        Animated.timing(heroScale, {
          toValue: 1,
          duration: 3500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [heroScale]);

  const androidTopPadding = Platform.select({
    android: StatusBar.currentHeight,
    default: 0,
  });

  // Get hero image from first available car
  const heroImageUri =
    cars.length > 0 ? cars[0].photos?.[0] || cars[0].image || null : null;

  // Render car cards (fully dynamic)
  const renderCarCards = () => {
    if (carsLoading || cars.length === 0) {
      return Array(5)
        .fill(null)
        .map((_, i) => (
          <BlurView
            key={`skeleton-${i}`}
            intensity={70}
            tint="dark"
            style={styles.carCard}
          >
            <View style={styles.skeletonThumb} />
            <View style={styles.carMeta}>
              <View style={styles.skeletonText} />
              <View style={[styles.skeletonText, { width: "60%" }]} />
            </View>
          </BlurView>
        ));
    }

    return cars.slice(0, 8).map((car: any) => {
      const firstPhoto = car.photos?.[0]?.photo_url || car.image;
      const displayName =
        car.name || `${car.make} ${car.model}` || "Premium Car";
      const displayPrice = car.price_per_hour
        ? `₹${car.price_per_hour}/hr`
        : car.price
        ? `₹${car.price}/day`
        : "Contact for price";

      return (
        <TouchableOpacity
          key={car.id}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate("screens/car-details", { id: car.id })
          }
        >
          <BlurView intensity={70} tint="dark" style={styles.carCard}>
            {firstPhoto ? (
              <Image
                source={{ uri: firstPhoto }}
                style={styles.carThumb}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.noImageThumb}>
                <Text style={styles.noImageText}>🚗</Text>
              </View>
            )}
            <View style={styles.carMeta}>
              <Text style={styles.carTitle} numberOfLines={1}>
                {displayName}
              </Text>
              <Text style={styles.carPrice}>{displayPrice}</Text>
            </View>
          </BlurView>
        </TouchableOpacity>
      );
    });
  };

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: androidTopPadding }]}>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: vs(40) }}
      >
        {/* ---- HERO ---- */}
        <View style={styles.heroWrap}>
          <Animated.View
            style={[
              styles.heroContainer,
              { transform: [{ scale: heroScale }] },
            ]}
          >
            {heroImageUri ? (
              <Animated.Image
                source={{ uri: heroImageUri }}
                style={[styles.heroImage, { opacity: heroImageAnim }]}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.heroPlaceholder}>
                <Text style={styles.heroPlaceholderText}>🚗</Text>
              </View>
            )}

            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.65)"]}
              style={styles.heroGradient}
            />

            <BlurView intensity={80} tint="dark" style={styles.heroCard}>
              <View>
                <Text style={styles.heroCardTitle}>Drive Luxury Today</Text>
                <Text style={styles.heroCardSubtitle}>
                  {carsLoading
                    ? "Discovering premium cars..."
                    : cars.length > 0
                    ? `${cars.length} premium cars available`
                    : "No cars available"}
                </Text>
              </View>
            </BlurView>
          </Animated.View>
        </View>

        {/* ---- FEATURES ---- */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why ZipDrive</Text>
          <View style={styles.featuresRow}>
            {FEATURES.map((f) => (
              <FeatureCard key={f.id} feature={f} />
            ))}
          </View>
        </View>

        {/* ---- SHOWCASE ---- */}
        <View style={styles.showcaseSection}>
          <Text style={styles.sectionTitle}>
            {carsLoading ? "Loading..." : "Handpicked for you"}
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {renderCarCards()}
          </ScrollView>
        </View>

        {/* ---- CTA ---- */}
        <View style={styles.ctaWrap}>
          <LinearGradient colors={[BUTTON, BUTTON]} style={styles.ctaFill}>
            <Text style={styles.ctaText}>Start your ride</Text>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ZipDrivePremiumScreen;

/* ---------------------- Styles ---------------------- */
const THEME_BG = "#0a1220";
const BUTTON = "#01d28e";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: THEME_BG },

  /* HERO */
  heroWrap: { marginTop: vs(18), paddingHorizontal: hs(18) },
  heroContainer: {
    height: height * 0.45,
    borderRadius: hs(20),
    overflow: "hidden",
    position: "relative",
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  heroPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#1a2332",
    justifyContent: "center",
    alignItems: "center",
  },
  heroPlaceholderText: {
    fontSize: ms(80),
    opacity: 0.3,
  },
  heroGradient: { ...StyleSheet.absoluteFillObject },
  heroCard: {
    position: "absolute",
    bottom: vs(16),
    left: hs(16),
    right: hs(16),
    borderRadius: hs(16),
    padding: hs(16),
  },
  heroCardTitle: { color: "#fff", fontSize: ms(20), fontWeight: "800" },
  heroCardSubtitle: {
    color: "#d9f0ff",
    marginTop: vs(4),
    fontSize: ms(12),
  },

  /* FEATURES */
  featuresSection: { marginTop: vs(25), paddingHorizontal: hs(18) },
  sectionTitle: {
    color: "#fff",
    fontSize: ms(18),
    fontWeight: "800",
    marginBottom: vs(14),
  },
  featuresRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: "48%",
    padding: hs(12),
    borderRadius: hs(12),
    marginBottom: vs(12),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  featureIcon: {
    width: hs(40),
    height: hs(40),
    borderRadius: hs(10),
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: hs(12),
  },
  featureEmoji: { fontSize: ms(20), color: "#fff" },
  featureTitle: { color: "#fff", fontSize: ms(14), fontWeight: "700" },
  featureSubtitle: { color: "#d9f0ff", fontSize: ms(12) },

  /* SHOWCASE */
  showcaseSection: { marginTop: vs(20), paddingHorizontal: hs(18) },
  carCard: {
    width: hs(200),
    marginRight: hs(12),
    borderRadius: hs(14),
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  carThumb: { width: "100%", height: vs(120) },
  noImageThumb: {
    width: "100%",
    height: vs(120),
    backgroundColor: "#1a2332",
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: { fontSize: ms(40) },
  carMeta: { padding: hs(10) },
  carTitle: { color: "#fff", fontSize: ms(14), fontWeight: "700" },
  carPrice: { color: "#cafff3", fontSize: ms(12), marginTop: vs(4) },

  // Skeleton
  skeletonThumb: {
    width: "100%",
    height: vs(120),
    backgroundColor: "#1a2332",
  },
  skeletonText: {
    height: vs(12),
    backgroundColor: "#1a2332",
    borderRadius: hs(4),
    marginTop: vs(6),
  },

  /* CTA */
  ctaWrap: { marginTop: vs(30), paddingHorizontal: hs(18) },
  ctaFill: {
    padding: hs(14),
    borderRadius: hs(12),
    alignItems: "center",
  },
  ctaText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: ms(16),
    letterSpacing: 0.5,
  },
});
