// ZipDrivePremiumScreen.tsx - Data Sync Only
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
  View,
} from "react-native";

import { hs, ms, vs } from "../../utils/responsive";
import { useCarStore } from "../store/carStore"; // ⭐ ADDED: Car Store

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

/* ---------------------- Data ---------------------- */
const CAR_IMAGES = [
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1170&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1170&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1170&auto=format&fit=crop",
];

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
  const heroScale = useRef(new Animated.Value(1)).current;
  const heroImageAnim = useRef(new Animated.Value(1)).current;
  const indexRef = useRef(0);

  // ⭐ ADDED: Car Store - Data Only
  const { cars, loading: carsLoading, getCars } = useCarStore();

  // ⭐ ADDED: Fetch cars on mount
  useEffect(() => {
    getCars();
  }, [getCars]);

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

    const interval = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % CAR_IMAGES.length;
      heroImageAnim.setValue(0);

      Animated.timing(heroImageAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const activeImage = CAR_IMAGES[indexRef.current];

  const androidTopPadding = Platform.select({
    android: StatusBar.currentHeight,
    default: 0,
  });

  // ⭐ UPDATED: Use real car data in showcase
  const renderCarCards = () => {
    if (carsLoading) {
      return CAR_IMAGES.map((uri, i) => (
        <BlurView
          key={`loading-${i}`}
          intensity={70}
          tint="dark"
          style={styles.carCard}
        >
          <Image source={{ uri }} style={styles.carThumb} resizeMode="cover" />
          <View style={styles.carMeta}>
            <Text style={styles.carTitle}>Loading...</Text>
            <Text style={styles.carPrice}>Fetching cars</Text>
          </View>
        </BlurView>
      ));
    }

    return cars.slice(0, 5).map((car: any) => {
      const firstPhoto = car.photos?.[0] || car.image || CAR_IMAGES[0];
      const displayName = car.name || car.make || `Car ${car.id}`;
      const displayPrice = car.price_per_hour
        ? `₹${car.price_per_hour}/hr`
        : `₹${car.price}/hr`;

      return (
        <BlurView
          key={car.id}
          intensity={70}
          tint="dark"
          style={styles.carCard}
        >
          <Image
            source={{ uri: firstPhoto }}
            style={styles.carThumb}
            resizeMode="cover"
          />
          <View style={styles.carMeta}>
            <Text style={styles.carTitle} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={styles.carPrice}>{displayPrice}</Text>
          </View>
        </BlurView>
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
            <Animated.Image
              source={{ uri: activeImage }}
              style={[styles.heroImage, { opacity: heroImageAnim }]}
              resizeMode="cover"
            />

            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.65)"]}
              style={styles.heroGradient}
            />

            <BlurView intensity={80} tint="dark" style={styles.heroCard}>
              <View>
                <Text style={styles.heroCardTitle}>Drive Luxury Today</Text>
                <Text style={styles.heroCardSubtitle}>
                  {carsLoading
                    ? "Loading premium cars..."
                    : `${cars.length} premium cars available`}
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

        {/* ---- SHOWCASE ---- ⭐ DATA SYNCED */}
        <View style={styles.showcaseSection}>
          <Text style={styles.sectionTitle}>Handpicked for you</Text>

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

/* ---------------------- Styles (unchanged) ---------------------- */
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
  heroGradient: { ...StyleSheet.absoluteFillObject },

  heroCard: {
    position: "absolute",
    bottom: vs(16),
    left: hs(16),
    right: hs(16),
    borderRadius: hs(16),
    padding: hs(16),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroCardTitle: { color: "#fff", fontSize: ms(20), fontWeight: "800" },
  heroCardSubtitle: {
    color: "#d9f0ff",
    marginTop: vs(4),
    fontSize: ms(12),
  },

  heroCardActions: { flexDirection: "row", alignItems: "center" },
  ghostText: { color: "#fff", marginRight: hs(12), fontSize: ms(14) },

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
  carMeta: { padding: hs(10) },
  carTitle: { color: "#fff", fontSize: ms(14), fontWeight: "700" },
  carPrice: { color: "#cafff3", fontSize: ms(12), marginTop: vs(4) },

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
