import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { getStrategies, createStrategy, updateStrategy, deleteStrategy } from "@/app/api/strategy.api";
import { CreateStrategyData, Strategy } from "../interface/strategy.interface";

interface StrategiesStore {
  strategies: Strategy[];
  isLoading: boolean;
  error: string | null;
  refreshStrategies: () => Promise<void>;
  addStrategy: (strategyData: CreateStrategyData) => Promise<void>;
  updateStrategy: (id: number, strategyData: CreateStrategyData) => Promise<void>;
  deleteStrategy: (id: number) => Promise<void>;
}

export const useStrategiesStore = create<StrategiesStore>()(
  devtools(
    (set) => ({
      strategies: [],
      isLoading: false,
      error: null,

      refreshStrategies: async () => {
        console.log("Refreshing strategies");
        set({ isLoading: true, error: null }, false, "refreshStrategies");
        try {
          const data = await getStrategies();
          console.log("Strategies loaded:", data);
          set({ strategies: data }, false, "refreshStrategies/success");
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Error desconocido al cargar estrategias";
          set({ error: errorMessage }, false, "refreshStrategies/error");
        } finally {
          set({ isLoading: false }, false, "refreshStrategies/complete");
        }
      },

      addStrategy: async (strategyData: CreateStrategyData) => {
        try {
          const newStrategy = await createStrategy(strategyData);
          set((state) => ({
            strategies: [...state.strategies, newStrategy],
          }), false, "addStrategy");
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Error desconocido al crear estrategia";
          set({ error: errorMessage }, false, "addStrategy/error");
          throw new Error(errorMessage);
        }
      },

      updateStrategy: async (id: number, strategyData: CreateStrategyData) => {
        try {
          const updatedStrategy = await updateStrategy(id, strategyData);
          set((state) => ({
            strategies: state.strategies.map((s) =>
              s.id === id ? updatedStrategy : s
            ),
          }), false, "updateStrategy");
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Error desconocido al actualizar estrategia";
          set({ error: errorMessage }, false, "updateStrategy/error");
          throw new Error(errorMessage);
        }
      },

      deleteStrategy: async (id: number) => {
        try {
          await deleteStrategy(id);
          set((state) => ({
            strategies: state.strategies.filter((s) => s.id !== id),
          }), false, "deleteStrategy");
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Error desconocido al eliminar estrategia";
          set({ error: errorMessage }, false, "deleteStrategy/error");
          throw new Error(errorMessage);
        }
      },
    }),
    { name: "strategies-store" }
  )
);