import axios from "axios";
import { create } from "zustand";
import { API_CONFIG } from "../../config/api";
import useAuthStore from "./authStore";

type CarState = {
  loading: boolean;
  addCar: (data: any) => Promise<any>;
  uploadRC: (data: any) => Promise<any>;
};

export const useAddCarStore = create<CarState>((set) => ({
  loading: false,

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

  // ✅ FULLY FIXED: Matches WEB API field names + Web/Native compatibility
  uploadRC: async (data) => {
    const token = useAuthStore.getState().token;

    console.log("🔍 RAW DATA RECEIVED:", data);

    // 🔥 WEB-SPECIFIC: Create proper File objects from blob URIs
    const createFileFromUri = async (fileObj: any, name: string) => {
      try {
        const response = await fetch(fileObj.uri);
        const blob = await response.blob();
        return new File([blob], name, {
          type: fileObj.mimeType || fileObj.type || "image/png",
        });
      } catch (error) {
        console.error("❌ File creation failed:", error);
        // Fallback object for React Native
        return {
          uri: fileObj.uri,
          type: fileObj.mimeType || fileObj.type || "image/png",
          name: name,
        } as any;
      }
    };

    const formData = new FormData();

    // ✅ MATCH WEB API FIELD NAMES EXACTLY
    formData.append("car_id", data.car_id?.toString() || "");
    formData.append("owner_name", data.ownerName || "");
    formData.append("rc_number", data.registrationNo || "");
    formData.append("rc_valid_till", data.rcValidTill || "");
    formData.append("city_of_registration", data.cityOfRegistration || "");
    formData.append("hand_type", data.handType || "First");
    formData.append("registration_type", data.registrationType || "Private");

    // 🔥 PROCESS FRONT IMAGE
    if (data.rcFrontFile) {
      const frontFileName = `rc_front_${Date.now()}.png`;
      const frontFile = await createFileFromUri(
        data.rcFrontFile,
        frontFileName
      );
      console.log("📤 FRONT FILE:", frontFile);
      formData.append("rc_image_front", frontFile);
    } else {
      console.error("❌ NO FRONT FILE");
    }

    // 🔥 PROCESS BACK IMAGE
    if (data.rcBackFile) {
      const backFileName = `rc_back_${Date.now()}.png`;
      const backFile = await createFileFromUri(data.rcBackFile, backFileName);
      console.log("📤 BACK FILE:", backFile);
      formData.append("rc_image_back", backFile);
    } else {
      console.error("❌ NO BACK FILE");
    }

    set({ loading: true });
    try {
      const res = await axios.post(
        `${API_CONFIG.BASE_URL}/cars/addRC`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // ✅ LET BROWSER SET Content-Type WITH BOUNDARY AUTOMATICALLY
          },
          // ✅ DON'T transform FormData
          transformRequest: [(formData) => formData],
        }
      );

      console.log("✅ RC UPLOAD SUCCESS:", res.data);
      return res.data;
    } catch (error: any) {
      console.error("❌ RC UPLOAD ERROR:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
