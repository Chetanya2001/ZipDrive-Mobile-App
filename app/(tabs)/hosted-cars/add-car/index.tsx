import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";

import Step1CarDetails from "./Step1CarDetails";
import Step2Registration from "./Step2Registration";
import Step3Insurance from "./Step3Insurance";
import Step4Features from "./Step4Features";
import Step5Images from "./Step5Images";
import Step6Availability from "./Step6Availability";

import { useAddCarStore } from "../../../store/addCarStore";

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
  const addCar = useAddCarStore((state) => state.addCar);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [carId, setCarId] = useState<number | null>(null);

  // ✅ MOVED useEffect INSIDE component
  useEffect(() => {
    console.log("ADD CAR SCREEN LOADED");
  }, []);

  const handleNext = async (data: any) => {
    if (currentStep === 0) {
      const response = await addCar({
        make: data.make,
        model: data.model,
        year: data.year,
        description: data.description,
      });
      setCarId(response.car_id);
      setFormData((prev: any) => ({ ...prev, ...data }));
      setCurrentStep(1);
      return;
    }
    setFormData((prev: any) => ({ ...prev, ...data }));
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep === 0) {
      router.back();
      return;
    }
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    console.log("Car Added Successfully:", { carId, ...formData });
    router.replace("/(tabs)/hosted-cars");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>{steps[currentStep]}</Text>

      {currentStep === 0 && (
        <Step1CarDetails onNext={handleNext} defaultValues={formData} />
      )}
      {currentStep === 1 && (
        <Step2Registration
          onNext={handleNext}
          onBack={handleBack}
          carId={carId!}
          defaultValues={formData}
        />
      )}
      {currentStep === 2 && (
        <Step3Insurance
          onNext={handleNext}
          onBack={handleBack}
          carId={carId!}
          defaultValues={formData}
        />
      )}
      {currentStep === 3 && (
        <Step4Features
          onNext={handleNext}
          onBack={handleBack}
          carId={carId!}
          defaultValues={formData}
        />
      )}
      {currentStep === 4 && (
        <Step5Images
          onNext={handleNext}
          onBack={handleBack}
          carId={carId!}
          defaultValues={formData}
        />
      )}
      {currentStep === 5 && (
        <Step6Availability
          onNext={handleSubmit}
          onBack={handleBack}
          carId={carId!}
          defaultValues={formData}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0e1a", padding: 16 },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
});
