import { Condition, CreateConditionData } from "@/app/interface/condition.interface";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { 
  getConditionsByConfirmation, 
  getCondition,
  createCondition, 
  updateCondition, 
  deleteCondition 
} from "@/app/api/condition.api";

interface ConditionsStore {
  conditions: Condition[];
  isLoading: boolean;
  error: string | null;
  
  refreshConditionsByConfirmation: (confirmationId: number) => Promise<void>;
  getCondition: (id: number) => Promise<Condition>;
  addCondition: (condition: CreateConditionData) => Promise<Condition>;
  updateCondition: (id: number, condition: CreateConditionData) => Promise<Condition>;
  deleteCondition: (id: number) => Promise<void>;
}

export const useConditionsStore = create<ConditionsStore>()(
  devtools(
    (set, get) => ({
      conditions: [],
      isLoading: false,
      error: null,
      
      refreshConditionsByConfirmation: async (confirmationId: number) => {
        console.log(`Refreshing conditions for confirmation ${confirmationId}`);
        set({ isLoading: true, error: null }, false, "refreshConditionsByConfirmation");
        try {
          const data = await getConditionsByConfirmation(confirmationId);
          console.log("Conditions loaded:", data);
          
          if (!data) {
            console.warn(`No data returned for confirmation ${confirmationId}`);
            set({ isLoading: false }, false, "refreshConditionsByConfirmation/empty");
            return;
          }
          
          if (!Array.isArray(data)) {
            console.error(`Data returned for confirmation ${confirmationId} is not an array:`, data);
            set({ isLoading: false }, false, "refreshConditionsByConfirmation/invalid");
            return;
          }
          
          set((state) => {
            const otherConditions = state.conditions.filter(
              condition => condition.confirmationId !== confirmationId
            );
            
            const updatedConditions = [...otherConditions, ...data];
            
            console.log(`Updated conditions state: ${updatedConditions.length} total conditions`);
            return { conditions: updatedConditions, isLoading: false };
          }, false, "refreshConditionsByConfirmation/success");
        } catch (error) {
          console.error("Error loading conditions:", error);
          set({ error: (error as Error).message, isLoading: false }, false, "refreshConditionsByConfirmation/error");
        }
      },
      
      getCondition: async (id: number) => {
        console.log(`Getting condition ${id}`);
        set({ isLoading: true, error: null }, false, "getCondition");
        try {
          const condition = await getCondition(id);
          set({ isLoading: false }, false, "getCondition/success");
          return condition;
        } catch (error) {
          console.error("Error getting condition:", error);
          set({ error: (error as Error).message, isLoading: false }, false, "getCondition/error");
          throw error;
        }
      },
      
      addCondition: async (conditionData: CreateConditionData) => {
        console.log("Adding condition:", conditionData);
        set({ isLoading: true, error: null }, false, "addCondition");
        try {
          const newCondition = await createCondition(conditionData);
          
          set((state) => {
            const updatedConditions = [...state.conditions, newCondition];
            
            console.log(`Added new condition ${newCondition.id} to state`);
            return { conditions: updatedConditions, isLoading: false };
          }, false, "addCondition/success");
          
          return newCondition;
        } catch (error) {
          console.error("Error adding condition:", error);
          set({ error: (error as Error).message, isLoading: false }, false, "addCondition/error");
          throw error;
        }
      },
      
      updateCondition: async (id: number, conditionData: CreateConditionData) => {
        console.log(`Updating condition ${id}:`, conditionData);
        set({ isLoading: true, error: null }, false, "updateCondition");
        try {
          const updatedCondition = await updateCondition(id, conditionData);
          
          set((state) => {
            const updatedConditions = state.conditions.map((c) =>
              c.id === id ? updatedCondition : c
            );
            
            console.log(`Updated condition ${id} in state`);
            return { conditions: updatedConditions, isLoading: false };
          }, false, "updateCondition/success");
          
          return updatedCondition;
        } catch (error) {
          console.error("Error updating condition:", error);
          set({ error: (error as Error).message, isLoading: false }, false, "updateCondition/error");
          throw error;
        }
      },
      
      deleteCondition: async (id: number) => {
        console.log(`Deleting condition ${id}`);
        set({ isLoading: true, error: null }, false, "deleteCondition");
        try {
          await deleteCondition(id);
          set((state) => ({
            conditions: state.conditions.filter((c) => c.id !== id),
            isLoading: false
          }), false, "deleteCondition/success");
        } catch (error) {
          console.error("Error deleting condition:", error);
          set({ error: (error as Error).message, isLoading: false }, false, "deleteCondition/error");
          throw error;
        }
      }
    }),
    { name: "conditions-store" }
  )
); 