// PremiumCarRentalScreen.tsx
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

// Types
interface Car {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
  rating: number;
  type: string;
}

interface CategoryProps {
  icon: string;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

// Premium Category Button
const CategoryButton = memo<CategoryProps>(
  ({ icon, label, isActive, onPress }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View
        style={[styles.categoryButton, isActive && styles.categoryButtonActive]}
      >
        <Text
          style={[styles.categoryIcon, isActive && styles.categoryIconActive]}
        >
          {icon}
        </Text>
        <Text
          style={[styles.categoryLabel, isActive && styles.categoryLabelActive]}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  )
);

CategoryButton.displayName = "CategoryButton";

// Premium Car Card with Glassmorphism
const CarCard = memo<{ car: Car }>(({ car }) => (
  <TouchableOpacity style={styles.carCard} activeOpacity={0.9}>
    <LinearGradient
      colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]}
      style={styles.cardGradient}
    >
      {/* Car Image */}
      <View style={styles.carImageContainer}>
        <Image
          source={{ uri: car.image }}
          style={styles.carImage}
          resizeMode="contain"
        />
      </View>

      {/* Glass Panel */}
      <View style={styles.glassPanel}>
        <View style={styles.carInfo}>
          <View>
            <Text style={styles.carBrand}>{car.brand}</Text>
            <Text style={styles.carName}>{car.name}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingStar}>⭐</Text>
            <Text style={styles.ratingText}>{car.rating}</Text>
          </View>
        </View>

        <View style={styles.carFooter}>
          <View>
            <Text style={styles.priceLabel}>Per Day</Text>
            <Text style={styles.priceValue}>${car.price}</Text>
          </View>
          <TouchableOpacity style={styles.bookButton}>
            <LinearGradient
              colors={["#0EA5E9", "#0284C7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bookButtonGradient}
            >
              <Text style={styles.bookButtonText}>Book</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  </TouchableOpacity>
));

CarCard.displayName = "CarCard";

// Main Screen
const PremiumCarRentalScreen: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("luxury");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "luxury", icon: "👑", label: "Luxury" },
    { id: "sports", icon: "🏎️", label: "Sports" },
    { id: "suv", icon: "🚙", label: "SUV" },
    { id: "electric", icon: "⚡", label: "Electric" },
  ];

  const cars: Car[] = [
    {
      id: "1",
      name: "Model S Plaid",
      brand: "TESLA",
      price: "299",
      image:
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80",
      rating: 4.9,
      type: "luxury",
    },
    {
      id: "2",
      name: "Aventador SVJ",
      brand: "LAMBORGHINI",
      price: "899",
      image:
        "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
      rating: 5.0,
      type: "sports",
    },
    {
      id: "3",
      name: "Range Rover",
      brand: "LAND ROVER",
      price: "449",
      image:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
      rating: 4.8,
      type: "suv",
    },
  ];

  const handleCategoryPress = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Gradient Background */}
      <LinearGradient
        colors={["#0F172A", "#1E293B", "#0F172A"]}
        style={styles.backgroundGradient}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>Chetanya</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileIcon}>
              <Text style={styles.profileText}>C</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar with Glassmorphism */}
        <View style={styles.searchContainer}>
          <View style={styles.glassSearch}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search luxury cars..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Featured Banner */}
        <View style={styles.featuredBanner}>
          <LinearGradient
            colors={["rgba(14, 165, 233, 0.2)", "rgba(2, 132, 199, 0.1)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bannerGradient}
          >
            <View style={styles.bannerContent}>
              <View style={styles.bannerText}>
                <Text style={styles.bannerTitle}>EXCLUSIVE</Text>
                <Text style={styles.bannerSubtitle}>Premium Fleet</Text>
                <Text style={styles.bannerDescription}>
                  Experience luxury at its finest
                </Text>
              </View>
              <View style={styles.bannerBadge}>
                <Text style={styles.badgeText}>NEW</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>CATEGORIES</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <CategoryButton
                key={category.id}
                icon={category.icon}
                label={category.label}
                isActive={activeCategory === category.id}
                onPress={() => handleCategoryPress(category.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Cars Grid */}
        <View style={styles.carsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AVAILABLE NOW</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.carsGrid}>
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </View>
        </View>

        {/* Stats Panel */}
        <View style={styles.statsPanel}>
          <View style={styles.glassStat}>
            <Text style={styles.statValue}>2.5K+</Text>
            <Text style={styles.statLabel}>Rides</Text>
          </View>
          <View style={styles.glassStat}>
            <Text style={styles.statValue}>4.9★</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.glassStat}>
            <Text style={styles.statValue}>500+</Text>
            <Text style={styles.statLabel}>Cars</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  userName: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 4,
    letterSpacing: 0.5,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
  },
  profileIcon: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(14, 165, 233, 0.3)",
    borderWidth: 2,
    borderColor: "rgba(14, 165, 233, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0EA5E9",
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  glassSearch: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  featuredBanner: {
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 24,
    overflow: "hidden",
    height: 140,
  },
  bannerGradient: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  bannerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0EA5E9",
    letterSpacing: 2,
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  bannerDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
  },
  bannerBadge: {
    backgroundColor: "#0EA5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  categoriesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.5)",
    letterSpacing: 2,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  categoryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  categoryButtonActive: {
    backgroundColor: "rgba(14, 165, 233, 0.2)",
    borderColor: "#0EA5E9",
  },
  categoryIcon: {
    fontSize: 20,
  },
  categoryIconActive: {
    fontSize: 20,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.6)",
  },
  categoryLabelActive: {
    color: "#FFFFFF",
  },
  carsSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0EA5E9",
  },
  carsGrid: {
    paddingHorizontal: 24,
    gap: 16,
  },
  carCard: {
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 8,
  },
  cardGradient: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 28,
    overflow: "hidden",
  },
  carImageContainer: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  carImage: {
    width: "85%",
    height: "100%",
  },
  glassPanel: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.15)",
    padding: 20,
  },
  carInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  carBrand: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0EA5E9",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  carName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  ratingStar: {
    fontSize: 14,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  carFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 4,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  bookButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  bookButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  bookButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  statsPanel: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
  },
  glassStat: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.5)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});

export default PremiumCarRentalScreen;
