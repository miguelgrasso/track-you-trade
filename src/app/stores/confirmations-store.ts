import { Confirmation, CreateConfirmationData } from "@/app/interface/confirmation.interface";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { 
  getConfirmations, 
  createConfirmation, 
  updateConfirmation, 
  deleteConfirmation 
} from "@/app/api/confirmation.api";
import { getConfirmationsByStrategy } from "@/app/api/strategyconfirmation.api";

interface ConfirmationsStore {
  confirmations: Confirmation[];
  strategyConfirmations: Confirmation[];
  isLoading: boolean;
  error: string | null;
  
  refreshConfirmations: () => Promise<void>;
  refreshConfirmationsByStrategy: (strategyId: number) => Promise<void>;
  addConfirmation: (confirmation: CreateConfirmationData) => Promise<Confirmation>;
  updateConfirmation: (id: number, confirmation: CreateConfirmationData) => Promise<Confirmation>;
  deleteConfirmation: (id: number) => Promise<void>;
}

export const useConfirmationsStore = create<ConfirmationsStore>()(
  devtools(
    (set, get) => ({
      confirmations: [],
      strategyConfirmations: [],
      isLoading: false,
      error: null,
      
      refreshConfirmations: async () => {
        console.log("Refreshing confirmations");
        set({ isLoading: true, error: null }, false, "refreshConfirmations");
        try {
          const data = await getConfirmations();
          console.log("Confirmations loaded:", data);
          
          // Verificar si data es null o undefined
          if (!data) {
            console.warn("No data returned for confirmations");
            set({ confirmations: [], isLoading: false }, false, "refreshConfirmations/empty");
            return;
          }
          
          // Verificar si data es un array
          if (!Array.isArray(data)) {
            console.error("Data returned for confirmations is not an array:", data);
            set({ confirmations: [], isLoading: false }, false, "refreshConfirmations/invalid");
            return;
          }
          
          set({ confirmations: data, isLoading: false }, false, "refreshConfirmations/success");
        } catch (error) {
          console.error("Error loading confirmations:", error);
          set({ error: (error as Error).message, isLoading: false, confirmations: [] }, false, "refreshConfirmations/error");
        }
      },
      
      refreshConfirmationsByStrategy: async (strategyId: number) => {
        console.log(`Refreshing confirmations for strategy ${strategyId}`);
        set({ isLoading: true, error: null }, false, "refreshConfirmationsByStrategy");
        try {
          console.log("Fetching confirmations for strategy:", strategyId);
          const data = await getConfirmationsByStrategy(strategyId);
          console.log("data store", data);
          console.log("Strategy confirmations loaded:", data);
          // Si data es null o undefined, establecer un array vacío
          const strategyConfirmations = data || [];
          set({ strategyConfirmations, isLoading: false }, false, "refreshConfirmationsByStrategy/success");
        } catch (error) {
          console.error("Error loading strategy confirmations:", error);
          set({ error: (error as Error).message, isLoading: false }, false, "refreshConfirmationsByStrategy/error");
        }
      },
      
      addConfirmation: async (confirmationData: CreateConfirmationData) => {
        console.log("Adding confirmation:", confirmationData);
        set({ isLoading: true, error: null }, false, "addConfirmation");
        try {
          const newConfirmation = await createConfirmation(confirmationData);
          set((state) => ({
            confirmations: [...state.confirmations, newConfirmation],
            isLoading: false
          }), false, "addConfirmation/success");
          return newConfirmation;
        } catch (error) {
          console.error("Error adding confirmation:", error);
          set({ error: (error as Error).message, isLoading: false }, false, "addConfirmation/error");
          throw error;
        }
      },
      
      updateConfirmation: async (id: number, confirmationData: CreateConfirmationData) => {
        console.log(`Updating confirmation ${id}:`, confirmationData);
        set({ isLoading: true, error: null }, false, "updateConfirmation");
        try {
          const updatedConfirmation = await updateConfirmation(id, confirmationData);
          set((state) => ({
            confirmations: state.confirmations.map((c) =>
              c.id === id ? updatedConfirmation : c
            ),
            isLoading: false
          }), false, "updateConfirmation/success");
          return updatedConfirmation;
        } catch (error) {
          console.error("Error updating confirmation:", error);
          set({ error: (error as Error).message, isLoading: false }, false, "updateConfirmation/error");
          throw error;
        }
      },
      
      deleteConfirmation: async (id: number) => {
        console.log(`Deleting confirmation ${id}`);
        set({ isLoading: true, error: null }, false, "deleteConfirmation");
        try {
          await deleteConfirmation(id);
          set((state) => ({
            confirmations: state.confirmations.filter((c) => c.id !== id),
            isLoading: false
          }), false, "deleteConfirmation/success");
        } catch (error) {
          console.error("Error deleting confirmation:", error);
          set({ error: (error as Error).message, isLoading: false }, false, "deleteConfirmation/error");
          throw error;
        }
      }
    }),
    { name: "confirmations-store" }
  )
); 