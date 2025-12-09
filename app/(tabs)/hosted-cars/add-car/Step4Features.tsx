import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAddCarStore } from "../../../store/addCarStore";

const COLORS = {
  background: "#0a1220",
  button: "#01d28e",
  buttonDark: "#2d3748",
  text: "#ffffff",
  textMuted: "#a0aec0",
  border: "#2d3748",
  inputBg: "#1a2332",
  success: "#10b981",
  error: "#ef4444",
};

interface Step4FeaturesProps {
  onNext: (data: CarFeatures) => void;
  onBack: () => void;
  defaultValues?: Partial<CarFeatures>;
  carId: number;
}

export interface CarFeatures {
  car_id: number;
  airconditions: boolean;
  child_seat: boolean;
  gps: boolean;
  luggage: boolean;
  music: boolean;
  seat_belt: boolean;
  sleeping_bed: boolean;
  water: boolean;
  bluetooth: boolean;
  onboard_computer: boolean;
  audio_input: boolean;
  long_term_trips: boolean;
  car_kit: boolean;
  remote_central_locking: boolean;
  climate_control: boolean;
}

interface FeatureItem {
  key: keyof Omit<CarFeatures, "car_id">;
  label: string;
  icon: string;
}

const FEATURES: FeatureItem[] = [
  { key: "airconditions", label: "Air Conditioning", icon: "❄️" },
  { key: "child_seat", label: "Child Seat", icon: "👶" },
  { key: "gps", label: "GPS Navigation", icon: "📍" },
  { key: "luggage", label: "Luggage Space", icon: "🧳" },
  { key: "music", label: "Music System", icon: "🎵" },
  { key: "seat_belt", label: "Seat Belt", icon: "🔒" },
  { key: "sleeping_bed", label: "Sleeping Bed", icon: "🛏️" },
  { key: "water", label: "Water", icon: "💧" },
  { key: "bluetooth", label: "Bluetooth", icon: "📱" },
  { key: "onboard_computer", label: "Onboard Computer", icon: "💻" },
  { key: "audio_input", label: "Audio Input", icon: "🎧" },
  { key: "long_term_trips", label: "Long Term Trips", icon: "🚗" },
  { key: "car_kit", label: "Car Kit", icon: "🧰" },
  {
    key: "remote_central_locking",
    label: "Remote Central Locking",
    icon: "🔑",
  },
  { key: "climate_control", label: "Climate Control", icon: "🌡️" },
];

const Step4Features: React.FC<Step4FeaturesProps> = ({
  onNext,
  onBack,
  defaultValues = {},
  carId,
}) => {
  const addCarFeatures = useAddCarStore((s) => s.addCarFeatures);

  const [features, setFeatures] = useState<CarFeatures>({
    car_id: carId,
    airconditions: defaultValues.airconditions || false,
    child_seat: defaultValues.child_seat || false,
    gps: defaultValues.gps || false,
    luggage: defaultValues.luggage || false,
    music: defaultValues.music || false,
    seat_belt: defaultValues.seat_belt || false,
    sleeping_bed: defaultValues.sleeping_bed || false,
    water: defaultValues.water || false,
    bluetooth: defaultValues.bluetooth || false,
    onboard_computer: defaultValues.onboard_computer || false,
    audio_input: defaultValues.audio_input || false,
    long_term_trips: defaultValues.long_term_trips || false,
    car_kit: defaultValues.car_kit || false,
    remote_central_locking: defaultValues.remote_central_locking || false,
    climate_control: defaultValues.climate_control || false,
  });

  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleFeature = (key: keyof Omit<CarFeatures, "car_id">) => {
    setFeatures((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const selectedCount = FEATURES.filter((f) => features[f.key]).length;

  const filteredFeatures = FEATURES.filter((feature) =>
    feature.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ⭐⭐⭐ API CALL IS HERE ⭐⭐⭐
  const handleNext = async () => {
    if (selectedCount === 0) {
      Alert.alert(
        "No Features Selected",
        "Please select at least one feature."
      );
      return;
    }

    setLoading(true);

    try {
      console.log(">>> POSTING FEATURES TO API", features);

      const res = await addCarFeatures(features);

      console.log(">>> API RESPONSE", res);

      if (!res || res.error) {
        Alert.alert("Error", "Failed to save features.");
        return;
      }

      // Move to next screen ✔
      onNext(features);
    } catch (err) {
      console.log("FEATURES ERROR", err);
      Alert.alert("Error", "Something went wrong while saving features.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = selectedCount > 0;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>Step 4 of 6: Vehicle Features</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "66.67%" }]} />
          </View>
        </View>

        <Text style={styles.title}>Vehicle Features</Text>
        <Text style={styles.subtitle}>
          Select the features available in your vehicle.
        </Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Select Features ({selectedCount} selected)
          </Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowFeaturesModal(true)}
          >
            <Text style={styles.selectButtonText}>
              {selectedCount === 0
                ? "Tap to select features"
                : "Tap to modify selection"}
            </Text>
            <Text style={styles.selectButtonIcon}>➕</Text>
          </TouchableOpacity>
        </View>

        {selectedCount > 0 && (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Selected Features:</Text>

            <View style={styles.pillsContainer}>
              {FEATURES.filter((f) => features[f.key]).map((feature) => (
                <View key={feature.key} style={styles.pill}>
                  <Text style={styles.pillIcon}>{feature.icon}</Text>
                  <Text style={styles.pillText}>{feature.label}</Text>

                  <TouchableOpacity onPress={() => toggleFeature(feature.key)}>
                    <Text style={styles.pillRemove}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Select all the features your vehicle offers.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nextButton,
              (!isFormValid || loading) && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!isFormValid || loading}
          >
            <Text style={styles.nextButtonText}>
              {loading ? "Saving..." : "Next Step →"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* MODAL FOR FEATURES LIST */}
      <Modal
        visible={showFeaturesModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFeaturesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Features</Text>
              <TouchableOpacity onPress={() => setShowFeaturesModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search features..."
                placeholderTextColor={COLORS.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Text style={styles.searchClear}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.selectedCount}>
              <Text style={styles.selectedCountText}>
                {selectedCount} features selected
              </Text>
            </View>

            <ScrollView style={styles.modalList}>
              {filteredFeatures.map((feature) => {
                const isSelected = features[feature.key];

                return (
                  <TouchableOpacity
                    key={feature.key}
                    style={[
                      styles.modalItem,
                      isSelected && styles.modalItemSelected,
                    ]}
                    onPress={() => toggleFeature(feature.key)}
                  >
                    <View style={styles.modalItemContent}>
                      <View
                        style={[
                          styles.checkbox,
                          isSelected && styles.checkboxSelected,
                        ]}
                      >
                        {isSelected && (
                          <Text style={styles.checkboxCheck}>✓</Text>
                        )}
                      </View>

                      <Text style={styles.featureIcon}>{feature.icon}</Text>

                      <Text
                        style={[
                          styles.modalItemText,
                          isSelected && styles.modalItemTextSelected,
                        ]}
                      >
                        {feature.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}

              {filteredFeatures.length === 0 && (
                <View style={styles.noResults}>
                  <Text style={styles.noResultsText}>No features found</Text>
                  <Text style={styles.noResultsSubtext}>
                    Try a different search term
                  </Text>
                </View>
              )}

              <View style={{ height: 20 }} />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => setShowFeaturesModal(false)}
              >
                <Text style={styles.doneButtonText}>
                  Done ({selectedCount})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

/* ---- STYLES ---- */
const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  progressSection: { marginBottom: 32 },
  progressText: { color: COLORS.textMuted, fontSize: 16, marginBottom: 12 },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.buttonDark,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: COLORS.button },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: 32,
    lineHeight: 24,
  },
  fieldContainer: { marginBottom: 24 },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 8,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: COLORS.inputBg,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: COLORS.border,
    borderRadius: 12,
  },
  selectButtonText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
  },
  selectButtonIcon: {
    fontSize: 24,
    color: COLORS.button,
  },
  pillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 16,
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.button,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 10,
    borderRadius: 20,
    gap: 6,
  },
  pillIcon: {
    fontSize: 16,
  },
  pillText: {
    fontSize: 14,
    color: COLORS.background,
    fontWeight: "600",
  },
  pillRemove: {
    fontSize: 16,
    color: COLORS.background,
    fontWeight: "600",
    marginLeft: 2,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: COLORS.inputBg,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
    gap: 12,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  buttonContainer: { flexDirection: "row", gap: 12, marginTop: 20 },
  backButton: {
    flex: 1,
    padding: 18,
    backgroundColor: COLORS.buttonDark,
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: { fontSize: 18, fontWeight: "600", color: COLORS.text },
  nextButton: {
    flex: 2,
    padding: 18,
    backgroundColor: COLORS.button,
    borderRadius: 8,
    alignItems: "center",
  },
  nextButtonDisabled: { opacity: 0.5, backgroundColor: COLORS.buttonDark },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.background,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginTop: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: { fontSize: 20, fontWeight: "600", color: COLORS.text },
  modalClose: { fontSize: 28, color: COLORS.textMuted, fontWeight: "300" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  searchClear: {
    fontSize: 20,
    color: COLORS.textMuted,
    paddingHorizontal: 8,
  },
  selectedCount: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  selectedCountText: {
    fontSize: 14,
    color: COLORS.button,
    fontWeight: "600",
  },
  modalList: { flex: 1 },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalItemSelected: {
    backgroundColor: COLORS.inputBg,
  },
  modalItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: COLORS.button,
    borderColor: COLORS.button,
  },
  checkboxCheck: {
    fontSize: 16,
    color: COLORS.background,
    fontWeight: "700",
  },
  featureIcon: {
    fontSize: 20,
  },
  modalItemText: { fontSize: 16, color: COLORS.text, flex: 1 },
  modalItemTextSelected: { fontWeight: "600" },
  noResults: {
    padding: 40,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 18,
    color: COLORS.textMuted,
    fontWeight: "600",
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  doneButton: {
    backgroundColor: COLORS.button,
    padding: 18,
    borderRadius: 8,
    alignItems: "center",
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.background,
  },
});

export default Step4Features;
