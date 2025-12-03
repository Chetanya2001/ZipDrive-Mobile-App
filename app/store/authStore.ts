import { create } from "zustand";
import { API_CONFIG } from "../../config/api";

// Extend User interface with role
interface User {
  id: string;
  name: string;
  email: string;
  role: string; // ⬅️ Added role
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    role?: "guest" | "host", // optional
    phone?: string // optional
  ) => Promise<void>;
  logout: () => void;
}

// Helper → decode JWT safely
const decodeJWT = (token: string) => {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    console.log("🔍 Decoded Token:", decoded);
    return decoded;
  } catch (err) {
    console.log("❌ Error decoding token:", err);
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true });

    try {
      console.log("🔗 Login URL:", API_CONFIG.USERS.LOGIN);

      const res = await fetch(API_CONFIG.USERS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.log("❌ Login Error:", errorText);
        throw new Error(`Login failed: ${res.status}`);
      }

      const data = await res.json();
      console.log("✅ Login Success:", data);

      const decoded = decodeJWT(data.token);

      // Get role from backend OR token
      const role = data.user?.role || decoded?.role || "guest";

      set({
        user: {
          ...data.user,
          role, // ⬅️ stored here
        },
        token: data.token,
        loading: false,
      });
    } catch (error: any) {
      console.error("💥 Login Error:", error);
      set({ loading: false });
      throw error;
    }
  },

  // store/authStore.ts

  signup: async (
    name: string,
    email: string,
    password: string,
    role: "guest" | "host" = "guest", // ← new optional param
    phone: string = "" // ← new optional param
  ) => {
    set({ loading: true });

    try {
      const res = await fetch(API_CONFIG.USERS.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: name.split(" ")[0] || name,
          last_name: name.split(" ").slice(1).join(" ") || "",
          email,
          phone, // ← now sent
          password,
          role, // ← now sent (host or guest)
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Registration failed: ${res.status}`);
      }

      const data = await res.json();
      const decoded = decodeJWT(data.token);
      const finalRole = data.user?.role || decoded?.role || role; // respect what we sent

      set({
        user: {
          ...data.user,
          role: finalRole,
        },
        token: data.token,
        loading: false,
      });
    } catch (error: any) {
      set({ loading: false });
      throw error;
    }
  },

  logout: () => set({ user: null, token: null }),
}));

export default useAuthStore;
