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
import { useAddCarStore } from "../../../store/addCarStore"; // Adjust path as needed

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

interface Step3InsuranceProps {
  onNext: () => void;
  onBack: () => void;
  carId: number; // Must be passed from previous step after adding car
}

const Step3Insurance: React.FC<Step3InsuranceProps> = ({
  onNext,
  onBack,
  carId,
}) => {
  const [insuranceCompany, setInsuranceCompany] = useState("");
  const [idvValue, setIdvValue] = useState(""); // Optional: if your backend supports IDV
  const [expiryDate, setExpiryDate] = useState("");
  const [insuranceImage, setInsuranceImage] = useState<any>(null);

  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  const { addInsurance, loading } = useAddCarStore();

  const insuranceCompanies = [
    "ICICI Lombard",
    "HDFC ERGO",
    "Bajaj Allianz",
    "TATA AIG",
    "Reliance General Insurance",
    "National Insurance",
    "New India Assurance",
    "Oriental Insurance",
    "United India Insurance",
    "Digit Insurance",
    "Acko General Insurance",
    "Go Digit General Insurance",
    "Royal Sundaram",
    "Cholamandalam MS",
    "Future Generali",
    "Liberty General Insurance",
    "Shriram General Insurance",
    "Bharti AXA General Insurance",
    "Kotak Mahindra General Insurance",
    "Magma HDI General Insurance",
    "Raheja QBE General Insurance",
    "SBI General Insurance",
    "Universal Sompo General Insurance",
    "Iffco Tokio General Insurance",
    "Other",
  ];

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Please allow access to photos");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setInsuranceImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setExpiryDate(currentDate.toISOString().split("T")[0]);

    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
  };

  const handleSubmit = async () => {
    if (!insuranceCompany) {
      Alert.alert("Required", "Please select insurance company");
      return;
    }
    if (!expiryDate) {
      Alert.alert("Required", "Please select expiry date");
      return;
    }
    if (!insuranceImage) {
      Alert.alert("Required", "Please upload insurance document image");
      return;
    }

    try {
      await addInsurance({
        car_id: carId,
        insurance_company: insuranceCompany,
        insurance_idv_value: idvValue ? parseInt(idvValue) : 0, // optional
        insurance_valid_till: expiryDate,
        insurance_image: insuranceImage,
      });

      Alert.alert("Success", "Insurance details uploaded successfully!", [
        { text: "OK", onPress: onNext },
      ]);
    } catch (error: any) {
      console.error("Insurance upload failed:", error);
      Alert.alert(
        "Upload Failed",
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  const isFormValid = insuranceCompany && expiryDate && insuranceImage;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>
            Step 3 of 6: Insurance Details
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "50%" }]} />
          </View>
        </View>

        <Text style={styles.title}>Insurance Details</Text>
        <Text style={styles.subtitle}>Add your current insurance policy</Text>

        {/* Insurance Company */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Insurance Company *</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowCompanyModal(true)}
          >
            <Text
              style={
                insuranceCompany
                  ? styles.dropdownText
                  : styles.dropdownPlaceholder
              }
            >
              {insuranceCompany || "Select Company"}
            </Text>
            <Text style={styles.dropdownIcon}>Down Arrow</Text>
          </TouchableOpacity>
        </View>

        {/* Optional: IDV Value */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>IDV Value (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 450000"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="numeric"
            value={idvValue}
            onChangeText={setIdvValue}
          />
        </View>

        {/* Expiry Date */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Valid Till *</Text>
          <TouchableOpacity
            style={styles.datePickerContainer}
            onPress={() => setShowDatePicker(true)}
          >
            <Text
              style={[styles.dateInput, !expiryDate && styles.datePlaceholder]}
            >
              {expiryDate || "Select expiry date"}
            </Text>
            <Text style={styles.calendarIcon}>Calendar</Text>
          </TouchableOpacity>
        </View>

        {/* Insurance Document Image */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Insurance Document Image *</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            {insuranceImage ? (
              <View style={styles.uploadedContainer}>
                <Image
                  source={{ uri: insuranceImage.uri }}
                  style={styles.uploadedImage}
                />
                <View style={styles.uploadedBadge}>
                  <Text style={styles.uploadedText}>Image Selected</Text>
                </View>
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Text style={styles.uploadIcon}>Document</Text>
                <Text style={styles.uploadText}>
                  Tap to upload insurance copy
                </Text>
                <Text style={styles.uploadSubtext}>
                  Clear photo (front side)
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nextButton,
              (!isFormValid || loading) && styles.nextButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid || loading}
          >
            <Text style={styles.nextButtonText}>
              {loading ? "Uploading..." : "Next"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          minimumDate={new Date()}
          maximumDate={new Date(2040, 0, 1)}
          onChange={onDateChange}
          display={Platform.OS === "ios" ? "spinner" : "default"}
        />
      )}

      {/* Company Modal */}
      <Modal visible={showCompanyModal} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCompanyModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Insurance Company</Text>
              <TouchableOpacity onPress={() => setShowCompanyModal(false)}>
                <Text style={styles.modalClose}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {insuranceCompanies.map((company) => (
                <TouchableOpacity
                  key={company}
                  style={styles.modalItem}
                  onPress={() => {
                    setInsuranceCompany(company);
                    setShowCompanyModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{company}</Text>
                  {insuranceCompany === company && (
                    <Text style={styles.checkmark}>Check</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1 },
  scrollContent: { padding: 20 },
  progressSection: { marginBottom: 32 },
  progressText: { color: COLORS.textMuted, fontSize: 16, marginBottom: 12 },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.buttonDark,
    borderRadius: 3,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.button,
    borderRadius: 3,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: COLORS.textMuted, marginBottom: 32 },
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    fontSize: 16,
  },
  dropdown: {
    padding: 16,
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: { color: COLORS.text, fontSize: 16 },
  dropdownPlaceholder: { color: COLORS.textMuted, fontSize: 16 },
  dropdownIcon: { color: COLORS.textMuted },
  datePickerContainer: {
    padding: 16,
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateInput: { color: COLORS.text, fontSize: 16 },
  datePlaceholder: { color: COLORS.textMuted },
  calendarIcon: { fontSize: 20 },
  uploadButton: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: COLORS.inputBg,
  },
  uploadPlaceholder: { padding: 30, alignItems: "center" },
  uploadIcon: { fontSize: 48, marginBottom: 12 },
  uploadText: { fontSize: 16, color: COLORS.text, fontWeight: "500" },
  uploadSubtext: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
  uploadedContainer: { alignItems: "center" },
  uploadedImage: { width: "100%", height: 200, borderRadius: 8 },
  uploadedBadge: {
    position: "absolute",
    bottom: 12,
    backgroundColor: COLORS.success,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  uploadedText: { color: COLORS.text, fontWeight: "600" },
  buttonContainer: { flexDirection: "row", gap: 12, marginTop: 30 },
  backButton: {
    flex: 1,
    padding: 18,
    backgroundColor: COLORS.buttonDark,
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: { color: COLORS.text, fontSize: 18, fontWeight: "600" },
  nextButton: {
    flex: 2,
    padding: 18,
    backgroundColor: COLORS.button,
    borderRadius: 8,
    alignItems: "center",
  },
  nextButtonDisabled: { backgroundColor: COLORS.buttonDark, opacity: 0.6 },
  nextButtonText: { color: COLORS.background, fontSize: 18, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.inputBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: { fontSize: 20, fontWeight: "600", color: COLORS.text },
  modalClose: { fontSize: 24, color: COLORS.textMuted },
  modalItem: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalItemText: { fontSize: 16, color: COLORS.text },
  checkmark: { color: COLORS.button, fontWeight: "bold" },
});

export default Step3Insurance;
