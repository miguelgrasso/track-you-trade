import { create } from "zustand";
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

export const useStrategiesStore = create<StrategiesStore>((set) => ({
  strategies: [],
  isLoading: false,
  error: null,

  refreshStrategies: async () => {
    console.log("Refreshing strategies");
    set({ isLoading: true, error: null });
    try {
      const data = await getStrategies();
      console.log("Strategies loaded:", data);
      set({ strategies: data });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al cargar estrategias";
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  addStrategy: async (strategyData: CreateStrategyData) => {
    try {
      const newStrategy = await createStrategy(strategyData);
      set((state) => ({
        strategies: [...state.strategies, newStrategy],
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al crear estrategia";
      set({ error: errorMessage });
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
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al actualizar estrategia";
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  deleteStrategy: async (id: number) => {
    try {
      await deleteStrategy(id);
      set((state) => ({
        strategies: state.strategies.filter((s) => s.id !== id),
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido al eliminar estrategia";
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },
}));