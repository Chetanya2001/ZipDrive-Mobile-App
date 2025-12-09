// store/addCarStore.ts
import axios from "axios";
import { create } from "zustand";
import { API_CONFIG } from "../../config/api";
import useAuthStore from "./authStore";

type CarState = {
  loading: boolean;
  addCar: (data: any) => Promise<any>;
  uploadRC: (data: any) => Promise<any>;
  addInsurance: (data: any) => Promise<any>;
  addCarFeatures: (data: any) => Promise<any>;
};

export const useAddCarStore = create<CarState>((set) => ({
  loading: false,

  //──────────────────────────────────────────────────────────────
  // ADD CAR
  //──────────────────────────────────────────────────────────────
  addCar: async (data) => {
    const token = useAuthStore.getState().token;

    set({ loading: true });
    try {
      const res = await axios.post(`${API_CONFIG.BASE_URL}/cars/addCar`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } finally {
      set({ loading: false });
    }
  },

  //──────────────────────────────────────────────────────────────
  // UPLOAD RC (EXPO SAFE)
  //──────────────────────────────────────────────────────────────
  uploadRC: async (data) => {
    const token = useAuthStore.getState().token;

    const formData = new FormData();

    // Text fields
    formData.append("car_id", String(data.car_id));
    formData.append("owner_name", data.ownerName);
    formData.append("rc_number", data.registrationNo);
    formData.append("rc_valid_till", data.rcValidTill);
    formData.append("city_of_registration", data.cityOfRegistration);
    formData.append("hand_type", data.handType || "First");
    formData.append("registration_type", data.registrationType || "Private");

    // FRONT IMAGE → MATCH BACKEND EXACT FIELD
    if (data.rcFrontFile?.uri) {
      formData.append("rc_image_front", {
        uri: data.rcFrontFile.uri,
        name: "rc_front.jpg",
        type: data.rcFrontFile.mimeType || "image/jpeg",
      } as any);
    }

    // BACK IMAGE → MATCH BACKEND EXACT FIELD
    if (data.rcBackFile?.uri) {
      formData.append("rc_image_back", {
        uri: data.rcBackFile.uri,
        name: "rc_back.jpg",
        type: data.rcBackFile.mimeType || "image/jpeg",
      } as any);
    }

    set({ loading: true });

    try {
      const res = await axios.post(
        `${API_CONFIG.BASE_URL}/cars/addRC`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          transformRequest: (data) => data,
        }
      );

      console.log("RC Uploaded:", res.data);
      return res.data;
    } catch (error) {
      console.log("❌ RC Upload Error:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  //──────────────────────────────────────────────────────────────
  // ADD INSURANCE (EXPO SAFE)
  //──────────────────────────────────────────────────────────────
  addInsurance: async (data) => {
    const token = useAuthStore.getState().token;

    const formData = new FormData();

    formData.append("car_id", String(data.car_id));
    formData.append("insurance_company", data.insurance_company);
    formData.append("insurance_valid_till", data.insurance_valid_till);

    if (data.insurance_idv_value) {
      formData.append("insurance_idv_value", String(data.insurance_idv_value));
    }

    // 🔥 ABSOLUTELY REQUIRED FOR EXPO
    if (data.insurance_image?.uri) {
      formData.append("insurance_image", {
        uri: data.insurance_image.uri,
        name: `insurance_${Date.now()}.jpg`, // REQUIRED
        type:
          data.insurance_image.mimeType ||
          data.insurance_image.type ||
          "image/jpeg",
      } as any);
    }

    set({ loading: true });

    try {
      const res = await axios.post(
        `${API_CONFIG.BASE_URL}/cars/addInsurance`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          transformRequest: (data) => data,
        }
      );

      return res.data;
    } catch (error: any) {
      console.log("INSURANCE ERROR:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  addCarFeatures: async (carFeaturesData: any) => {
    const token = useAuthStore.getState().token;

    if (!token) {
      throw new Error("Authentication token not found");
    }

    set({ loading: true });

    try {
      console.log("Sending Car Features Data:", carFeaturesData);

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/car-features`, // ← adjust if you use API_CONFIG instead
        carFeaturesData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Car Features Added:", response.data);
      return response.data; // { message, data } or the created object
    } catch (error: any) {
      console.error(
        "Failed to add car features:",
        error.response?.data || error.message
      );
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
