import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminStore {
  userRole: string;
  setUserRole: (role: string) => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      userRole: "customer",
      setUserRole: (role: string) => set({ userRole: role }),
    }),
    {
      name: "admin-storage",
    }
  )
);
