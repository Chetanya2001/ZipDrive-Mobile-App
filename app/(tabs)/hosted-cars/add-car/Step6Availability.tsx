import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Alert,
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

interface Step6AvailabilityProps {
  onNext: (data: AvailabilityData) => void;
  onBack: () => void;
  defaultValues?: Partial<AvailabilityData>;
  carId: number;
}

interface AvailabilityData {
  car_id: number;
  price_per_hour: number;
  available_from: string;
  available_till: string;
}

const Step6Availability: React.FC<Step6AvailabilityProps> = ({
  onNext,
  onBack,
  defaultValues = {},
  carId,
}) => {
  const uploadAvailability = useAddCarStore(
    (state) => state.uploadAvailability
  );

  const [formData, setFormData] = useState({
    pricePerHour: defaultValues.price_per_hour?.toString() || "",
    availableFrom: defaultValues.available_from || "",
    availableTill: defaultValues.available_till || "",
  });

  // Date picker state
  const [dateFrom, setDateFrom] = useState<Date>(new Date());
  const [dateTill, setDateTill] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<"from" | "till" | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  // Initialize dates if editing
  useEffect(() => {
    if (defaultValues.available_from) {
      try {
        setDateFrom(new Date(defaultValues.available_from));
      } catch (error) {
        console.error("Invalid from date:", error);
      }
    }
    if (defaultValues.available_till) {
      try {
        setDateTill(new Date(defaultValues.available_till));
      } catch (error) {
        console.error("Invalid till date:", error);
      }
    }
  }, [defaultValues.available_from, defaultValues.available_till]);

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Date Picker Handlers
  const onDatePress = (type: "from" | "till") => {
    console.log(`Calendar icon pressed for ${type}`);
    setShowDatePicker(type);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowDatePicker(null);
      return;
    }

    if (!selectedDate) return;

    const currentType = showDatePicker;
    if (!currentType) return;

    // For Android, close immediately after selection
    if (Platform.OS === "android") {
      setShowDatePicker(null);
    }

    // Format date as YYYY-MM-DD
    const formattedDate = selectedDate.toISOString().split("T")[0];

    if (currentType === "from") {
      setDateFrom(selectedDate);
      updateField("availableFrom", formattedDate);
    } else {
      setDateTill(selectedDate);
      updateField("availableTill", formattedDate);
    }
  };

  const closeDatePicker = () => {
    setShowDatePicker(null);
  };

  const handleFinish = async () => {
    // Validation
    if (
      !formData.pricePerHour ||
      !formData.availableFrom ||
      !formData.availableTill
    ) {
      Alert.alert("Missing Fields", "Please fill all required fields");
      return;
    }

    const pricePerHour = parseFloat(formData.pricePerHour);
    if (isNaN(pricePerHour) || pricePerHour <= 0) {
      Alert.alert("Invalid Price", "Please enter a valid price per hour");
      return;
    }

    // Check if available_till is after available_from
    const fromDate = new Date(formData.availableFrom);
    const tillDate = new Date(formData.availableTill);
    if (tillDate <= fromDate) {
      Alert.alert(
        "Invalid Date Range",
        "Available till date must be after available from date"
      );
      return;
    }

    const data: AvailabilityData = {
      car_id: carId,
      price_per_hour: pricePerHour,
      available_from: formData.availableFrom,
      available_till: formData.availableTill,
    };

    setLoading(true);
    try {
      const response = await uploadAvailability(data);
      console.log("✅ Availability Upload Success:", response);
      onNext(data);
    } catch (error: any) {
      console.error("❌ Availability Upload Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to upload availability details.";
      Alert.alert("Upload Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.pricePerHour &&
    formData.availableFrom &&
    formData.availableTill &&
    parseFloat(formData.pricePerHour) > 0;

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
            Step 6 of 6: Availability & Pricing
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "100%" }]} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Availability & Pricing</Text>
        <Text style={styles.subtitle}>
          Set your vehicle's availability period and rental price.
        </Text>

        {/* Price Per Hour */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Price Per Hour (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter price per hour"
            placeholderTextColor={COLORS.textMuted}
            value={formData.pricePerHour}
            onChangeText={(text) => {
              // Allow only numbers and decimal point
              const cleaned = text.replace(/[^0-9.]/g, "");
              updateField("pricePerHour", cleaned);
            }}
            keyboardType="decimal-pad"
          />
          <Text style={styles.helperText}>
            Set a competitive hourly rental rate for your vehicle
          </Text>
        </View>

        {/* Available From - Calendar */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Available From</Text>
          <TouchableOpacity
            style={styles.datePickerContainer}
            onPress={() => onDatePress("from")}
            activeOpacity={0.7}
          >
            <View style={styles.dateInputWrapper}>
              <Text
                style={[
                  styles.dateInput,
                  !formData.availableFrom && styles.datePlaceholder,
                ]}
              >
                {formData.availableFrom || "Select Start Date (YYYY-MM-DD)"}
              </Text>
              <Text style={styles.calendarIcon}>📅</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Available Till - Calendar */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Available Till</Text>
          <TouchableOpacity
            style={styles.datePickerContainer}
            onPress={() => onDatePress("till")}
            activeOpacity={0.7}
          >
            <View style={styles.dateInputWrapper}>
              <Text
                style={[
                  styles.dateInput,
                  !formData.availableTill && styles.datePlaceholder,
                ]}
              >
                {formData.availableTill || "Select End Date (YYYY-MM-DD)"}
              </Text>
              <Text style={styles.calendarIcon}>📅</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Pricing Tips:</Text>
            <Text style={styles.infoText}>
              • Research similar vehicles in your area{"\n"}• Consider vehicle
              condition and features{"\n"}• Factor in fuel, maintenance, and
              insurance{"\n"}• You can adjust pricing later if needed
            </Text>
          </View>
        </View>

        {/* Summary Card */}
        {isFormValid && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>📋 Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Hourly Rate:</Text>
              <Text style={styles.summaryValue}>
                ₹{formData.pricePerHour}/hr
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Available From:</Text>
              <Text style={styles.summaryValue}>{formData.availableFrom}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Available Till:</Text>
              <Text style={styles.summaryValue}>{formData.availableTill}</Text>
            </View>
            {formData.availableFrom && formData.availableTill && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Duration:</Text>
                <Text style={styles.summaryValue}>
                  {Math.ceil(
                    (new Date(formData.availableTill).getTime() -
                      new Date(formData.availableFrom).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </Text>
              </View>
            )}
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
            onPress={handleFinish}
            disabled={!isFormValid || loading}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {loading ? "Submitting..." : "Complete Setup ✓"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Native Date Picker - Android (Dialog) */}
      {showDatePicker && Platform.OS === "android" && (
        <DateTimePicker
          value={showDatePicker === "from" ? dateFrom : dateTill}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
          maximumDate={new Date(2030, 11, 31)}
        />
      )}

      {/* Native Date Picker - iOS (Modal Spinner) */}
      {showDatePicker && Platform.OS === "ios" && (
        <Modal
          transparent
          visible={!!showDatePicker}
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
                <Text style={styles.iosDatePickerTitle}>
                  Select {showDatePicker === "from" ? "Start" : "End"} Date
                </Text>
                <TouchableOpacity onPress={closeDatePicker}>
                  <Text style={styles.iosDoneText}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={showDatePicker === "from" ? dateFrom : dateTill}
                mode="date"
                display="spinner"
                onChange={onDateChange}
                minimumDate={new Date()}
                maximumDate={new Date(2030, 11, 31)}
                textColor={COLORS.text}
                style={styles.iosDatePicker}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
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
  helperText: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 8,
    fontStyle: "italic",
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
  summaryCard: {
    backgroundColor: COLORS.inputBg,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.button,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  summaryLabel: {
    fontSize: 15,
    color: COLORS.textMuted,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
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

export default Step6Availability;
