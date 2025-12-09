import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StatusBar, StyleSheet, Text, View } from "react-native";

import Step1CarDetails from "./Step1CarDetails";
import Step2Registration from "./Step2Registration";
import Step3Insurance from "./Step3Insurance";
import Step4Features from "./Step4Features";
import Step5Images from "./Step5Images";
import Step6Availability from "./Step6Availability";

import { useAddCarStore } from "../../../store/addCarStore"; // Adjust path if needed

const steps = [
  "Car Details",
  "Registration Details",
  "Insurance",
  "Features",
  "Images",
  "Availability",
];

export default function AddCarWizard() {
  const router = useRouter();
  const { addCar, loading } = useAddCarStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [carId, setCarId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    console.log("AddCarWizard Loaded");
  }, []);

  // Step 1: Create Car → Get carId
  const handleStep1Next = async (data: any) => {
    try {
      const response = await addCar({
        make: data.make,
        model: data.model,
        year: data.year,
        description: data.description || "",
        // Add any other fields your addCar API expects
      });

      const newCarId = response.car_id || response.id;
      if (!newCarId) {
        throw new Error("Car ID not returned");
      }

      setCarId(newCarId);
      setFormData((prev: any) => ({ ...prev, ...data }));
      setCurrentStep(1);

      console.log("Car created successfully:", newCarId);
    } catch (error: any) {
      console.error("Failed to add car:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to create car. Please try again."
      );
    }
  };

  // All other steps: just save data and go next
  const handleNext = (data?: any) => {
    if (data) {
      setFormData((prev: any) => ({ ...prev, ...data }));
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep === 0) {
      router.back();
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = () => {
    Alert.alert(
      "Success",
      "Your car has been added successfully!",
      [
        {
          text: "View My Cars",
          onPress: () => router.replace("/(tabs)/hosted-cars"),
        },
      ],
      { cancelable: false }
    );
  };

  // Show loading if adding car
  if (loading && currentStep === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Creating your car...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Progress Header */}
      <Text style={styles.title}>{steps[currentStep]}</Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentStep + 1) / steps.length) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep + 1} of {steps.length}
        </Text>
      </View>

      {/* Steps */}
      {currentStep === 0 && (
        <Step1CarDetails onNext={handleStep1Next} defaultValues={formData} />
      )}

      {currentStep === 1 && carId && (
        <Step2Registration
          onNext={handleNext}
          onBack={handleBack}
          carId={carId}
          defaultValues={formData}
        />
      )}

      {currentStep === 2 && carId && (
        <Step3Insurance onNext={handleNext} onBack={handleBack} carId={carId} />
      )}

      {currentStep === 3 && carId && (
        <Step4Features
          onNext={handleNext}
          onBack={handleBack}
          carId={carId}
          defaultValues={formData}
        />
      )}

      {currentStep === 4 && carId && (
        <Step5Images
          onNext={handleNext}
          onBack={handleBack}
          carId={carId}
          defaultValues={formData}
        />
      )}

      {currentStep === 5 && carId && (
        <Step6Availability
          onNext={handleFinalSubmit}
          onBack={handleBack}
          carId={carId}
          defaultValues={formData}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0e1a",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    width: "100%",
    backgroundColor: "#2d3748",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#01d28e",
    borderRadius: 4,
  },
  progressText: {
    color: "#a0aec0",
    fontSize: 14,
  },
});
