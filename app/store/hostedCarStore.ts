// store/hostedCarsStore.ts
import { create } from "zustand";
import { API_CONFIG } from "../../config/api";
import useAuthStore from "./authStore";

// ────────────────────── EXACT BACKEND CAR TYPE ──────────────────────
export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price_per_hour: number;
  kms_driven?: number;
  available_from?: string;
  available_till?: string;
  documents: {
    rc_image_front?: string;
    rc_image_back?: string;
    owner_name?: string;
    insurance_company?: string;
    insurance_idv_value?: string;
    insurance_image?: string;
    rc_number?: string;
    rc_valid_till?: string;
    city_of_registration?: string;
    fastag_image?: string;
    trip_start_balance?: string;
    trip_end_balance?: string;
  } | null;
  photos: string[];
}

interface HostedCarsState {
  cars: Car[];
  loading: boolean;
  error: string | null;
  fetchMyCars: () => Promise<void>;
}

const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;
  if (!token) throw new Error("Not authenticated");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const useHostedCarsStore = create<HostedCarsState>((set) => ({
  cars: [],
  loading: false,
  error: null,

  fetchMyCars: async () => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(API_CONFIG.HOST_MY_CARS.LIST, {
        method: "POST", // ← REQUIRED
        headers: getAuthHeaders(),
        body: JSON.stringify({}), // ← backend expects POST body (even if empty)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to load cars: ${res.status}`);
      }

      const data = await res.json();

      set({ cars: data.cars || [], loading: false });
    } catch (err: any) {
      console.error("fetchMyCars error:", err);
      set({ error: err.message, loading: false });
    }
  },
}));

export default useHostedCarsStore;
