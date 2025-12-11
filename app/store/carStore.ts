import axios from "axios";
import { create } from "zustand";
import { API_CONFIG } from "../../config/api";
import { useAuthStore } from "./authStore"; // ⬅️ import auth store

export interface Car {
  id: number;
  name?: string;
  brand?: string;
  make: string;
  price: number;
  model: string;
  year: number;
  location?: string;
  price_per_hour: number | null;
  kms_driven?: number;
  available_from?: string | null;
  available_till?: string | null;
  image?: string | null;
  photos?: string[];
  reviews?: string[];
  documents?: {
    car_id: number;
    rc_image_front: string | null;
    rc_image_back: string | null;
    owner_name: string;
    insurance_company: string;
    insurance_idv_value: string | number;
    insurance_image: string | null;
    rc_number: string;
    rc_valid_till: string;
    city_of_registration: string;
    fastag_image: string | null;
    trip_start_balance: string | null;
    trip_end_balance: string | null;
  };
}

export interface CarFeatures {
  length: number;
  slice(arg0: number, arg1: number): unknown;
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

export interface CarPhoto {
  id: number;
  photo_url: string;
}

export interface CarDetailsType {
  documents: any;
  price_per_hour: number;
  id: number;
  make: string;
  model: string;
  year: number;
  description: string | null;
  location?: string;
  features: CarFeatures;
  photos: CarPhoto[];
  reviews: string[];
}

interface CarState {
  cars: Car[];
  carDetails: CarDetailsType | null;

  loading: boolean;
  error: string | null;

  getCars: () => Promise<void>;
  getCarDetails: (car_id: number) => Promise<void>;
}

export const useCarStore = create<CarState>((set) => ({
  cars: [],
  carDetails: null,

  loading: false,
  error: null,

  // GET ALL CARS
  getCars: async () => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get<Car[]>(`${API_CONFIG.BASE_URL}/cars`);
      console.log("🚗 Cars API Response:", response.data);

      set({ cars: response.data });
    } catch (error: any) {
      console.error(
        "❌ Get Cars Error:",
        error.response?.data || error.message
      );

      set({
        error: error.response?.data?.message || "Failed to fetch cars",
      });
    } finally {
      set({ loading: false });
    }
  },

  // GET CAR DETAILS BY ID
  getCarDetails: async (car_id: number) => {
    set({ loading: true, error: null });

    try {
      // ⬅️ token taken from Auth Store (NOT localStorage)
      const token = useAuthStore.getState().token;

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/car-details/getCarDetails`,
        { car_id },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      console.log("📥 Car Details Response:", response.data);

      set({ carDetails: response.data });
    } catch (error: any) {
      console.error(
        "❌ Error fetching car details:",
        error.response?.data || error.message
      );

      set({
        error: error.response?.data?.message || "Failed to fetch car details",
        carDetails: null,
      });
    } finally {
      set({ loading: false });
    }
  },
}));
