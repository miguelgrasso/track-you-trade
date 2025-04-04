import { create } from "zustand";
import { getTrades, createTrade } from "@/app/api/trade.api";
import { NewTrade, Trade } from "../interface/trade.interface";
import { format } from "date-fns";

interface TradeStore {
  trades: Trade[];
  localTrades: Trade[];
  isLoading: boolean;
  error: string | null;
  isDirty: boolean;
  refreshTrades: () => Promise<void>;
  updateLocalTrades: (trades: Trade[]) => void;
  syncWithServer: () => Promise<void>;
  addTrade: (trade: Trade) => void;
  updateTrade: (trade: Trade) => void;
  deleteTrade: (tradeId: number) => void;
};

export const useTradeStore = create<TradeStore>((set, get) => ({
  trades: [],
  localTrades: [],
  isLoading: false,
  error: null,
  isDirty: false,

  // Función para cargar los trades
  refreshTrades: async () => {
    set({ isLoading: true, error: null });
    try {
      const trades = await getTrades();
      set({ trades, localTrades: trades, isLoading: false, isDirty: false });
    } catch (error) {
      set({ error: 'Error al cargar los trades', isLoading: false });
    }
  },

  updateLocalTrades: (trades) => {
    set({ localTrades: trades, isDirty: true });
  },

  syncWithServer: async () => {
    const { isDirty, localTrades } = get();
    if (!isDirty) return;

    set({ isLoading: true });
    try {
      // Aquí iría la lógica para sincronizar con el servidor
      // Por ejemplo, hacer un bulk update o comparar cambios
      set({ trades: localTrades, isDirty: false, isLoading: false });
    } catch (error) {
      set({ error: 'Error al sincronizar con el servidor', isLoading: false });
    }
  },

  // Función para añadir un nuevo trade
  addTrade: (trade) => {
    set((state) => {
      const newLocalTrades = [...state.localTrades, trade];
      return {
        localTrades: newLocalTrades,
        isDirty: true
      };
    });
  },

  updateTrade: (updatedTrade) => {
    set((state) => {
      const newLocalTrades = state.localTrades.map(trade => 
        trade.id === updatedTrade.id ? updatedTrade : trade
      );
      return {
        localTrades: newLocalTrades,
        isDirty: true
      };
    });
  },

  deleteTrade: (tradeId) => {
    set((state) => {
      const newLocalTrades = state.localTrades.filter(trade => trade.id !== tradeId);
      return {
        localTrades: newLocalTrades,
        isDirty: true
      };
    });
  }
}));