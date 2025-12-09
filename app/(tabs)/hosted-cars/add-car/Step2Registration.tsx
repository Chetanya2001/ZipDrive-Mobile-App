import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
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

interface Step2RegistrationProps {
  onNext: (data: RegistrationData) => void;
  onBack: () => void;
  defaultValues?: Partial<RegistrationData>;
  carId: number;
}

interface RegistrationData {
  ownerName: string;
  registrationNo: string;
  cityOfRegistration: string;
  rcValidTill: string;
  handType: "First" | "Second";
  registrationType: "Private" | "Commercial";
  rcFrontFile?: any;
  rcBackFile?: any;
}

const Step2Registration: React.FC<Step2RegistrationProps> = ({
  onNext,
  onBack,
  defaultValues = {},
  carId,
}) => {
  const uploadRC = useAddCarStore((state) => state.uploadRC);

  const [formData, setFormData] = useState<RegistrationData>({
    ownerName: defaultValues.ownerName || "",
    registrationNo: defaultValues.registrationNo || "",
    cityOfRegistration: defaultValues.cityOfRegistration || "",
    rcValidTill: defaultValues.rcValidTill || "",
    handType: defaultValues.handType || "First",
    registrationType: defaultValues.registrationType || "Private",
    rcFrontFile: defaultValues.rcFrontFile,
    rcBackFile: defaultValues.rcBackFile,
  });

  // Date picker state
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Modals
  const [showCityModal, setShowCityModal] = useState(false);
  const [showRegistrationTypeModal, setShowRegistrationTypeModal] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const cities = [
    "Delhi",
    "Agra",
    "Noida",
    "Meerut",
    "Gurgaon",
    "Faridabad",
    "Ghaziabad",
  ];

  // Initialize date if editing
  useEffect(() => {
    if (defaultValues.rcValidTill) {
      try {
        setDate(new Date(defaultValues.rcValidTill));
      } catch (error) {
        console.error("Invalid date:", error);
      }
    }
  }, [defaultValues.rcValidTill]);

  const updateField = (field: keyof RegistrationData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async (type: "front" | "back") => {
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
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets[0]) {
        const field = type === "front" ? "rcFrontFile" : "rcBackFile";
        updateField(field, result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  // Date Picker Handlers
  const onDatePress = () => {
    // Ensure touch feedback
    console.log("Calendar icon pressed");
    setShowDatePicker(true);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowDatePicker(Platform.OS === "ios");
      return;
    }

    const currentDate = selectedDate || date;
    setDate(currentDate);

    // For Android, close immediately after selection
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    // Format date as YYYY-MM-DD
    const formattedDate = currentDate.toISOString().split("T")[0];
    updateField("rcValidTill", formattedDate);
  };

  const closeDatePicker = () => {
    setShowDatePicker(false);
  };

  const handleNext = async () => {
    // Validation
    if (
      !formData.ownerName ||
      !formData.registrationNo ||
      !formData.cityOfRegistration ||
      !formData.rcValidTill
    ) {
      Alert.alert("Missing Fields", "Please fill all required fields");
      return;
    }

    if (!formData.rcFrontFile || !formData.rcBackFile) {
      Alert.alert(
        "Missing Images",
        "Please upload both RC front and back images"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await uploadRC({ car_id: carId, ...formData });
      console.log("✅ RC Upload Success:", response);
      onNext(formData);
    } catch (error: any) {
      console.error("❌ RC Upload Error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to upload RC details.";

      if (
        errorMessage.toLowerCase().includes("duplicate") ||
        errorMessage.includes("unique")
      ) {
        Alert.alert(
          "Duplicate Registration",
          `Registration number "${formData.registrationNo}" already exists in the system.`
        );
      } else {
        Alert.alert("Upload Failed", errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.ownerName &&
    formData.registrationNo &&
    formData.cityOfRegistration &&
    formData.rcValidTill &&
    formData.rcFrontFile &&
    formData.rcBackFile;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={styles.title}>Registration Details</Text>
        <Text style={styles.subtitle}>
          Provide your vehicle's registration information.
        </Text>

        {/* Owner Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Owner Name (as in RC)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter owner name"
            placeholderTextColor={COLORS.textMuted}
            value={formData.ownerName}
            onChangeText={(text) => updateField("ownerName", text)}
          />
        </View>

        {/* Registration Number */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Registration Number</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., UP80EL9999"
            placeholderTextColor={COLORS.textMuted}
            value={formData.registrationNo}
            onChangeText={(text) =>
              updateField("registrationNo", text.toUpperCase())
            }
            autoCapitalize="characters"
          />
        </View>

        {/* City of Registration */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Car Location</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowCityModal(true)}
            activeOpacity={0.7}
          >
            <Text
              style={
                formData.cityOfRegistration
                  ? styles.dropdownText
                  : styles.dropdownPlaceholder
              }
            >
              {formData.cityOfRegistration || "Select City"}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* RC Valid Till - Calendar */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>RC Valid Till</Text>
          <TouchableOpacity
            style={styles.datePickerContainer}
            onPress={onDatePress}
            activeOpacity={0.7}
          >
            <View style={styles.dateInputWrapper}>
              <Text
                style={[
                  styles.dateInput,
                  !formData.rcValidTill && styles.datePlaceholder,
                ]}
              >
                {formData.rcValidTill || "Select Date (YYYY-MM-DD)"}
              </Text>
              <Text style={styles.calendarIcon}>📅</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Hand Type Toggle */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Car Hand Type</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                formData.handType === "First" && styles.toggleButtonActive,
              ]}
              onPress={() => updateField("handType", "First")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  formData.handType === "First" &&
                    styles.toggleButtonTextActive,
                ]}
              >
                First Hand
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                formData.handType === "Second" && styles.toggleButtonActive,
              ]}
              onPress={() => updateField("handType", "Second")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  formData.handType === "Second" &&
                    styles.toggleButtonTextActive,
                ]}
              >
                Second Hand
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Registration Type */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Registration Type</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowRegistrationTypeModal(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownText}>{formData.registrationType}</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* RC Front Upload */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Upload RC Front</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => pickImage("front")}
            activeOpacity={0.7}
          >
            {formData.rcFrontFile ? (
              <View style={styles.uploadedContainer}>
                <Image
                  source={{ uri: formData.rcFrontFile.uri }}
                  style={styles.uploadedImage}
                  resizeMode="cover"
                />
                <View style={styles.uploadedBadge}>
                  <Text style={styles.uploadedText}>
                    ✓ Front Image Uploaded
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Text style={styles.uploadIcon}>📷</Text>
                <Text style={styles.uploadText}>Tap to upload RC front</Text>
                <Text style={styles.uploadSubtext}>
                  Clear photo of RC front side
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* RC Back Upload */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Upload RC Back</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => pickImage("back")}
            activeOpacity={0.7}
          >
            {formData.rcBackFile ? (
              <View style={styles.uploadedContainer}>
                <Image
                  source={{ uri: formData.rcBackFile.uri }}
                  style={styles.uploadedImage}
                  resizeMode="cover"
                />
                <View style={styles.uploadedBadge}>
                  <Text style={styles.uploadedText}>✓ Back Image Uploaded</Text>
                </View>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Text style={styles.uploadIcon}>📷</Text>
                <Text style={styles.uploadText}>Tap to upload RC back</Text>
                <Text style={styles.uploadSubtext}>
                  Clear photo of RC back side
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

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

      {/* Native Date Picker - Android (Dialog) */}
      {showDatePicker && Platform.OS === "android" && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
          maximumDate={new Date(2040, 11, 31)}
        />
      )}

      {/* Native Date Picker - iOS (Modal Spinner) */}
      {showDatePicker && Platform.OS === "ios" && (
        <Modal
          transparent
          visible={showDatePicker}
          animationType="slide"
          onRequestClose={closeDatePicker}
        >
          <TouchableOpacity
            style={styles.iosDatePickerOverlay}
            activeOpacity={1}
            onPress={closeDatePicker}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
              style={styles.iosDatePickerContainer}
            >
              <View style={styles.iosDatePickerHeader}>
                <TouchableOpacity onPress={closeDatePicker}>
                  <Text style={styles.iosCancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.iosDatePickerTitle}>Select Date</Text>
                <TouchableOpacity onPress={closeDatePicker}>
                  <Text style={styles.iosDoneText}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={onDateChange}
                minimumDate={new Date()}
                maximumDate={new Date(2040, 11, 31)}
                textColor={COLORS.text}
                style={styles.iosDatePicker}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}

      {/* City Modal */}
      <Modal
        visible={showCityModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCityModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCityModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select City</Text>
              <TouchableOpacity onPress={() => setShowCityModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {cities.map((city) => (
                <TouchableOpacity
                  key={city}
                  style={styles.modalItem}
                  onPress={() => {
                    updateField("cityOfRegistration", city);
                    setShowCityModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalItemText}>{city}</Text>
                  {formData.cityOfRegistration === city && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
              <View style={{ height: 20 }} />
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Registration Type Modal */}
      <Modal
        visible={showRegistrationTypeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRegistrationTypeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowRegistrationTypeModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Registration Type</Text>
              <TouchableOpacity
                onPress={() => setShowRegistrationTypeModal(false)}
              >
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {["Private", "Commercial"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.modalItem}
                  onPress={() => {
                    updateField(
                      "registrationType",
                      type as "Private" | "Commercial"
                    );
                    setShowRegistrationTypeModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalItemText}>{type}</Text>
                  {formData.registrationType === type && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
              <View style={{ height: 20 }} />
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
    marginBottom: 8,
  },
  input: {
    padding: 16,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    fontSize: 16,
    color: COLORS.text,
  },
  datePickerContainer: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
  },
  dateInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  dateInput: { flex: 1, fontSize: 16, color: COLORS.text },
  datePlaceholder: { color: COLORS.textMuted },
  calendarIcon: { fontSize: 24, marginLeft: 8 },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
  },
  dropdownText: { fontSize: 16, color: COLORS.text },
  dropdownPlaceholder: { fontSize: 16, color: COLORS.textMuted },
  dropdownIcon: { fontSize: 12, color: COLORS.textMuted },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    padding: 4,
    gap: 4,
  },
  toggleButton: {
    flex: 1,
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
  },
  toggleButtonActive: { backgroundColor: COLORS.button },
  toggleButtonText: {
    fontSize: 16,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
  toggleButtonTextActive: { color: COLORS.background, fontWeight: "600" },
  uploadButton: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 20,
    backgroundColor: COLORS.inputBg,
    overflow: "hidden",
  },
  uploadPlaceholder: { alignItems: "center", paddingVertical: 10 },
  uploadIcon: { fontSize: 48, marginBottom: 12 },
  uploadText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "500",
    marginBottom: 4,
  },
  uploadSubtext: { fontSize: 14, color: COLORS.textMuted },
  uploadedContainer: { alignItems: "center" },
  uploadedImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  uploadedBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  uploadedText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
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
  nextButtonText: { fontSize: 18, fontWeight: "600", color: COLORS.background },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    backgroundColor: COLORS.inputBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
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
  modalClose: { fontSize: 24, color: COLORS.textMuted, fontWeight: "300" },
  modalList: { maxHeight: 400 },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalItemText: { fontSize: 16, color: COLORS.text },
  checkmark: { fontSize: 20, color: COLORS.button, fontWeight: "600" },

  // iOS Date Picker Styles
  iosDatePickerOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  iosDatePickerContainer: {
    backgroundColor: COLORS.inputBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  iosDatePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iosDatePickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  iosCancelText: { fontSize: 17, color: COLORS.textMuted },
  iosDoneText: { fontSize: 17, color: COLORS.button, fontWeight: "600" },
  iosDatePicker: {
    height: 200,
  },
});

export default Step2Registration;
