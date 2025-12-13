import { create } from "zustand";

interface RentalSearchState {
  pickupCity: string;
  dropCity: string;
  pickupDate: string;
  pickupTime: string;
  dropDate: string;
  dropTime: string;
  insureTrip: boolean;
  driverRequired: boolean;
  differentDrop: boolean;

  setField: (key: string, value: any) => void;
  reset: () => void;
}

export const useRentalSearchStore = create<RentalSearchState>((set) => ({
  pickupCity: "",
  dropCity: "",
  pickupDate: "",
  pickupTime: "",
  dropDate: "",
  dropTime: "",
  insureTrip: false,
  driverRequired: false,
  differentDrop: false,

  setField: (key, value) => set((state) => ({ ...state, [key]: value })),

  reset: () =>
    set({
      pickupCity: "",
      dropCity: "",
      pickupDate: "",
      pickupTime: "",
      dropDate: "",
      dropTime: "",
      insureTrip: false,
      driverRequired: false,
      differentDrop: false,
    }),
}));
