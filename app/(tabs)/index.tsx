// ZipDrivePremiumScreen.tsx
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

  useEffect(() => {
    // Pulsing Hero Animation
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

    // Image switching every 6 sec
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

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ---- TOP BAR ---- */}
        <View style={styles.topBar}>
          <View style={styles.logoRow}>
            <LinearGradient colors={[THEME_BG, BUTTON]} style={styles.logoMark}>
              <Text style={styles.logoEmoji}>🚗</Text>
            </LinearGradient>
            <Text style={styles.brand}>ZipDrive</Text>
          </View>

          <View style={styles.topActions}>
            <Text style={styles.topActionText}>Log in</Text>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Sign up</Text>
            </View>
          </View>
        </View>

        {/* ---- HERO (FIXED VERSION) ---- */}

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
                  Premium cars, flexible plans
                </Text>
              </View>

              <View style={styles.heroCardActions}>
                <TouchableOpacity>
                  <Text style={styles.ghostText}>Browse</Text>
                </TouchableOpacity>
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
          <Text style={styles.sectionTitle}>Handpicked for you</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CAR_IMAGES.map((uri, i) => (
              <BlurView
                key={uri}
                intensity={70}
                tint="dark"
                style={styles.carCard}
              >
                <Image
                  source={{ uri }}
                  style={styles.carThumb}
                  resizeMode="cover"
                />
                <View style={styles.carMeta}>
                  <Text style={styles.carTitle}>Model {i + 1}</Text>
                  <Text style={styles.carPrice}>₹4,999 / day</Text>
                </View>
              </BlurView>
            ))}
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

  /* TOP BAR */
  topBar: {
    paddingTop: 15,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoRow: { flexDirection: "row", alignItems: "center" },
  logoMark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  logoEmoji: { fontSize: 18 },
  brand: { color: "#fff", fontSize: 20, fontWeight: "700", marginLeft: 10 },

  topActions: { flexDirection: "row", alignItems: "center" },
  topActionText: { color: "#cdd7f5", marginRight: 14, fontSize: 14 },
  pill: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillText: { color: "#fff", fontWeight: "600" },

  /* HERO */
  heroWrap: { marginTop: 18, paddingHorizontal: 18 },
  heroContainer: {
    height: height * 0.45,
    borderRadius: 20,
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
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroCardTitle: { color: "#fff", fontSize: 20, fontWeight: "800" },
  heroCardSubtitle: { color: "#d9f0ff", marginTop: 4, fontSize: 12 },

  heroCardActions: { flexDirection: "row", alignItems: "center" },
  ghostText: { color: "#fff", marginRight: 12, fontSize: 14 },

  /* FEATURES */
  featuresSection: { marginTop: 25, paddingHorizontal: 18 },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 14,
  },
  featuresRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: "48%",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  featureEmoji: { fontSize: 20, color: "#fff" },
  featureTitle: { color: "#fff", fontSize: 14, fontWeight: "700" },
  featureSubtitle: { color: "#d9f0ff", fontSize: 12 },

  /* SHOWCASE */
  showcaseSection: { marginTop: 20, paddingHorizontal: 18 },
  carCard: {
    width: 200,
    marginRight: 12,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  carThumb: { width: "100%", height: 120 },
  carMeta: { padding: 10 },
  carTitle: { color: "#fff", fontSize: 14, fontWeight: "700" },
  carPrice: { color: "#cafff3", fontSize: 12, marginTop: 4 },

  /* CTA */
  ctaWrap: { marginTop: 30, paddingHorizontal: 18 },
  ctaFill: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
