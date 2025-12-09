import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
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
  warning: "#f59e0b",
};

interface Step5ImagesProps {
  onNext: (data: ImagesData) => void;
  onBack: () => void;
  defaultValues?: Partial<ImagesData>;
  carId: number;
}

interface ImagesData {
  images: any[];
}

const Step5Images: React.FC<Step5ImagesProps> = ({
  onNext,
  onBack,
  defaultValues = {},
  carId,
}) => {
  const addImage = useAddCarStore((state) => state.addImage);

  const [images, setImages] = useState<any[]>(defaultValues.images || []);
  const [loading, setLoading] = useState(false);

  const pickImages = async () => {
    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant camera roll permissions to upload images"
        );
        return;
      }

      // Launch image picker with multiple selection
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        aspect: [16, 9],
      });

      if (!result.canceled && result.assets.length > 0) {
        // Check total images limit (max 10)
        if (images.length + result.assets.length > 10) {
          Alert.alert(
            "Too Many Images",
            `You can upload a maximum of 10 images. You currently have ${images.length} image(s).`
          );
          return;
        }

        setImages((prev) => [...prev, ...result.assets]);
      }
    } catch (error) {
      console.error("Error picking images:", error);
      Alert.alert("Error", "Failed to pick images. Please try again.");
    }
  };

  const pickSingleImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant camera roll permissions to upload images"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        aspect: [16, 9],
      });

      if (!result.canceled && result.assets[0]) {
        if (images.length >= 10) {
          Alert.alert(
            "Limit Reached",
            "You can upload a maximum of 10 images."
          );
          return;
        }
        setImages((prev) => [...prev, result.assets[0]]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const removeImage = (index: number) => {
    Alert.alert("Remove Image", "Are you sure you want to remove this image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          setImages((prev) => prev.filter((_, i) => i !== index));
        },
      },
    ]);
  };

  const handleNext = async () => {
    // Validation
    if (images.length === 0) {
      Alert.alert(
        "No Images Selected",
        "Please upload at least 3 images of your vehicle"
      );
      return;
    }

    if (images.length < 3) {
      Alert.alert(
        "Minimum Images Required",
        `Please upload at least 3 images. You currently have ${images.length} image(s).`
      );
      return;
    }

    setLoading(true);
    try {
      const response = await addImage({ car_id: carId, images });
      console.log("✅ Images Upload Success:", response);
      onNext({ images });
    } catch (error: any) {
      console.error("❌ Images Upload Error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to upload images.";
      Alert.alert("Upload Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = images.length >= 3;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>Step 5 of 6: Vehicle Images</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "83.33%" }]} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Vehicle Images</Text>
        <Text style={styles.subtitle}>
          Upload clear, high-quality images of your vehicle from different
          angles.
        </Text>

        {/* Image Requirements */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>📸</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Image Guidelines:</Text>
            <Text style={styles.infoText}>
              • Minimum 3 images required{"\n"}• Maximum 10 images allowed{"\n"}
              • Include front, back, sides, and interior{"\n"}• Use good
              lighting and clear shots
            </Text>
          </View>
        </View>

        {/* Upload Buttons */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Upload Images ({images.length}/10)</Text>
          <View style={styles.uploadButtonsRow}>
            <TouchableOpacity
              style={[styles.uploadButton, styles.uploadButtonPrimary]}
              onPress={pickSingleImage}
              activeOpacity={0.7}
              disabled={images.length >= 10}
            >
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadButtonText}>Add Single Image</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.uploadButton, styles.uploadButtonSecondary]}
              onPress={pickImages}
              activeOpacity={0.7}
              disabled={images.length >= 10}
            >
              <Text style={styles.uploadIcon}>🖼️</Text>
              <Text style={styles.uploadButtonText}>Add Multiple</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Images Grid */}
        {images.length > 0 && (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Selected Images ({images.length}):</Text>
            <View style={styles.imagesGrid}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageCard}>
                  <Image
                    source={{ uri: image.uri }}
                    style={styles.imagePreview}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlay}>
                    <View style={styles.imageNumber}>
                      <Text style={styles.imageNumberText}>{index + 1}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeImage(index)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.removeButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Status Message */}
        {images.length > 0 && images.length < 3 && (
          <View style={[styles.statusBox, styles.statusWarning]}>
            <Text style={styles.statusIcon}>⚠️</Text>
            <Text style={styles.statusText}>
              {3 - images.length} more image(s) needed to continue
            </Text>
          </View>
        )}

        {images.length >= 3 && (
          <View style={[styles.statusBox, styles.statusSuccess]}>
            <Text style={styles.statusIcon}>✓</Text>
            <Text style={styles.statusText}>
              Great! You have enough images to proceed
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nextButton,
              (!isFormValid || loading) && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!isFormValid || loading}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {loading ? "Uploading..." : "Next Step →"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

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
    marginBottom: 12,
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
  infoIcon: { fontSize: 24 },
  infoContent: { flex: 1 },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  uploadButtonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  uploadButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    gap: 8,
  },
  uploadButtonPrimary: {
    borderColor: COLORS.button,
    backgroundColor: COLORS.inputBg,
  },
  uploadButtonSecondary: {
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBg,
  },
  uploadIcon: { fontSize: 32 },
  uploadButtonText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
    textAlign: "center",
  },
  imagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  imageCard: {
    width: "48%",
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: COLORS.inputBg,
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 8,
    justifyContent: "space-between",
  },
  imageNumber: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.button,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageNumberText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.background,
  },
  removeButton: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.error,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "700",
  },
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    gap: 12,
    marginBottom: 24,
  },
  statusWarning: {
    backgroundColor: `${COLORS.warning}20`,
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  statusSuccess: {
    backgroundColor: `${COLORS.success}20`,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  statusIcon: { fontSize: 20 },
  statusText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
    flex: 1,
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
});

export default Step5Images;
