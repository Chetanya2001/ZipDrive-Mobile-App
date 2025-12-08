import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const COLORS = {
  background: "#0a1220",
  button: "#01d28e",
  buttonDark: "#2d3748",
  text: "#ffffff",
  textMuted: "#a0aec0",
  border: "#2d3748",
  inputBg: "#1a2332",
};

interface Step1CarDetailsProps {
  onNext: (data: FormData) => void;
  defaultValues?: Partial<FormData>;
}

interface FormData {
  make: string;
  model: string;
  year: string;
  description: string;
}

const Step1CarDetails: React.FC<Step1CarDetailsProps> = ({
  onNext,
  defaultValues = {},
}) => {
  const [formData, setFormData] = useState<FormData>({
    make: defaultValues.make || "",
    model: defaultValues.model || "",
    year: defaultValues.year || "",
    description: defaultValues.description || "",
  });

  const [showMakeModal, setShowMakeModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);

  const carMakes = [
    "Toyota",
    "Honda",
    "Ford",
    "Chevrolet",
    "BMW",
    "Mercedes-Benz",
    "Audi",
    "Volkswagen",
    "Nissan",
    "Hyundai",
    "Kia",
    "Mazda",
    "Lexus",
    "Subaru",
    "Tesla",
    "Porsche",
    "Jeep",
    "Ram",
    "Dodge",
    "GMC",
    "Cadillac",
    "Volvo",
    "Jaguar",
    "Land Rover",
  ];

  const getCarModels = (make: string) => {
    const modelsByMake: { [key: string]: string[] } = {
      Toyota: [
        "Camry",
        "Corolla",
        "RAV4",
        "Highlander",
        "Tacoma",
        "Tundra",
        "Prius",
        "4Runner",
      ],
      Honda: [
        "Civic",
        "Accord",
        "CR-V",
        "Pilot",
        "Odyssey",
        "HR-V",
        "Ridgeline",
      ],
      Ford: [
        "F-150",
        "Mustang",
        "Explorer",
        "Escape",
        "Edge",
        "Bronco",
        "Ranger",
      ],
      Chevrolet: [
        "Silverado",
        "Tahoe",
        "Equinox",
        "Malibu",
        "Traverse",
        "Camaro",
        "Colorado",
      ],
      BMW: ["3 Series", "5 Series", "X3", "X5", "7 Series", "X1", "4 Series"],
      Tesla: ["Model 3", "Model S", "Model X", "Model Y"],
    };

    return (
      modelsByMake[make] || [
        "Sedan",
        "SUV",
        "Truck",
        "Coupe",
        "Hatchback",
        "Convertible",
        "Wagon",
        "Minivan",
        "Crossover",
      ]
    );
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (formData.make && formData.model && formData.year) {
      onNext(formData);
    }
  };

  const isFormValid = formData.make && formData.model && formData.year;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>Step 1 of 6: Car Details</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "16.66%" }]} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Tell us about your car</Text>
        <Text style={styles.subtitle}>
          Start by providing the basic details of your vehicle.
        </Text>

        {/* Make Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Make</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowMakeModal(true)}
          >
            <Text
              style={
                formData.make ? styles.dropdownText : styles.dropdownPlaceholder
              }
            >
              {formData.make || "Select Make"}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Model Field */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, !formData.make && styles.labelDisabled]}>
            Model
          </Text>
          <TouchableOpacity
            style={[styles.dropdown, !formData.make && styles.dropdownDisabled]}
            onPress={() => formData.make && setShowModelModal(true)}
            disabled={!formData.make}
          >
            <Text
              style={
                formData.model
                  ? styles.dropdownText
                  : styles.dropdownPlaceholder
              }
            >
              {formData.model || "Select Model"}
            </Text>
            <View style={styles.modelIcon} />
          </TouchableOpacity>
        </View>

        {/* Year Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Year</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Year"
            placeholderTextColor={COLORS.textMuted}
            value={formData.year}
            onChangeText={(text) => {
              // Only allow numbers
              const numericText = text.replace(/[^0-9]/g, "");
              updateField("year", numericText);
            }}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        {/* Description Field */}
        <View style={styles.fieldContainer}>
          <View style={styles.descriptionHeader}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.charCount}>
              {formData.description.length}/200
            </Text>
          </View>
          <TextInput
            style={styles.textArea}
            placeholder="Describe your car's features and condition. (e.g., low mileage, new tires, non-smoker)."
            placeholderTextColor={COLORS.textMuted}
            value={formData.description}
            onChangeText={(text) => {
              if (text.length <= 200) {
                updateField("description", text);
              }
            }}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.nextButton, !isFormValid && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!isFormValid}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Make Modal */}
      <Modal
        visible={showMakeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMakeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMakeModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Make</Text>
              <TouchableOpacity onPress={() => setShowMakeModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {carMakes.map((make) => (
                <TouchableOpacity
                  key={make}
                  style={styles.modalItem}
                  onPress={() => {
                    console.log("Selected make:", make);
                    setFormData((prev) => ({
                      ...prev,
                      make: make,
                      model: "",
                    }));
                    setShowMakeModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalItemText}>{make}</Text>
                  {formData.make === make && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
              <View style={{ height: 20 }} />
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Model Modal */}
      <Modal
        visible={showModelModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModelModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowModelModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Model</Text>
              <TouchableOpacity onPress={() => setShowModelModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {getCarModels(formData.make).map((model) => (
                <TouchableOpacity
                  key={model}
                  style={styles.modalItem}
                  onPress={() => {
                    console.log("Selected model:", model);
                    setFormData((prev) => ({
                      ...prev,
                      model: model,
                    }));
                    setShowModelModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalItemText}>{model}</Text>
                  {formData.model === model && (
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
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  progressSection: {
    marginBottom: 32,
  },
  progressText: {
    color: COLORS.textMuted,
    fontSize: 16,
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.buttonDark,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.button,
  },
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
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 8,
  },
  labelDisabled: {
    color: COLORS.textMuted,
    opacity: 0.6,
  },
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
  dropdownDisabled: {
    opacity: 0.5,
  },
  dropdownText: {
    fontSize: 16,
    color: COLORS.text,
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
  dropdownIcon: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  modelIcon: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.textMuted,
    opacity: 0.3,
    borderRadius: 2,
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
  descriptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  charCount: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  textArea: {
    padding: 16,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    fontSize: 16,
    color: COLORS.text,
    minHeight: 140,
  },
  nextButton: {
    marginTop: 8,
    padding: 18,
    backgroundColor: COLORS.buttonDark,
    borderRadius: 8,
    alignItems: "center",
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
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
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
  },
  modalClose: {
    fontSize: 24,
    color: COLORS.textMuted,
    fontWeight: "300",
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
  checkmark: {
    fontSize: 20,
    color: COLORS.button,
    fontWeight: "600",
  },
});

export default Step1CarDetails;
