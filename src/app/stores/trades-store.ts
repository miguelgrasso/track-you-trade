import { create } from "zustand";
import { getTrades, createTrade, updateTrade, deleteTrade } from "@/app/api/trade.api";
import { NewTrade, Trade } from "../interface/trade.interface";

interface TradeStore {
  trades: Trade[];
  localTrades: Trade[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  isDirty: boolean;
  lastFetch: number | null;
  
  // Request cancellation
  abortController: AbortController | null;
  
  // Actions
  refreshTrades: () => Promise<void>;
  updateLocalTrades: (trades: Trade[]) => void;
  syncWithServer: () => Promise<void>;
  addTrade: (trade: NewTrade) => Promise<void>;
  updateTrade: (id: number, trade: Partial<NewTrade>) => Promise<void>;
  deleteTrade: (tradeId: number) => Promise<void>;
  clearError: () => void;
  cancelPendingRequests: () => void;
}

export const useTradeStore = create<TradeStore>((set, get) => ({
  trades: [],
  localTrades: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  isDirty: false,
  lastFetch: null,
  abortController: null,

  // Cancelar requests pendientes
  cancelPendingRequests: () => {
    const { abortController } = get();
    if (abortController) {
      abortController.abort();
      set({ abortController: null });
    }
  },

  // Limpiar errores
  clearError: () => set({ error: null }),

  // Función para cargar los trades con protección contra race conditions
  refreshTrades: async () => {
    const state = get();
    
    // Si ya hay una operación en progreso, cancelarla
    if (state.isLoading) {
      state.cancelPendingRequests();
    }

    // Verificar cache (5 minutos)
    const now = Date.now();
    if (state.lastFetch && (now - state.lastFetch) < 5 * 60 * 1000 && state.trades.length > 0) {
      return; // Usar datos del cache
    }

    const controller = new AbortController();
    set({ 
      isLoading: true, 
      error: null, 
      abortController: controller 
    });

    try {
      const trades = await getTrades();
      
      // Verificar si la operación fue cancelada
      if (controller.signal.aborted) {
        return;
      }

      set({ 
        trades, 
        localTrades: trades, 
        isLoading: false, 
        isDirty: false,
        lastFetch: now,
        abortController: null,
        error: null
      });
    } catch (error) {
      if (controller.signal.aborted) {
        return; // Ignorar errores de requests cancelados
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar los trades';
      set({ 
        error: errorMessage, 
        isLoading: false, 
        abortController: null 
      });
    }
  },

  updateLocalTrades: (trades) => {
    set({ localTrades: trades, isDirty: true });
  },

  syncWithServer: async () => {
    const { isDirty, localTrades, trades } = get();
    if (!isDirty) return;

    set({ isLoading: true, error: null });
    try {
      // Comparar cambios locales con servidor
      const changedTrades = localTrades.filter(localTrade => {
        const serverTrade = trades.find(t => t.id === localTrade.id);
        return !serverTrade || JSON.stringify(localTrade) !== JSON.stringify(serverTrade);
      });

      // Sincronizar cambios (implementar lógica específica según necesidades)
      for (const trade of changedTrades) {
        if (trade.id) {
          await updateTrade(trade.id, trade);
        }
      }

      // Actualizar estado después de sincronizar
      await get().refreshTrades();
      set({ isDirty: false, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al sincronizar con el servidor';
      set({ error: errorMessage, isLoading: false });
    }
  },

  // Función para añadir un nuevo trade con optimistic updates
  addTrade: async (trade: NewTrade) => {
    set({ isCreating: true, error: null });
    
    // Optimistic update
    const optimisticTrade = {
      ...trade,
      id: Date.now(), // ID temporal
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Trade;

    set((state) => ({
      localTrades: [...state.localTrades, optimisticTrade],
      isDirty: true
    }));

    try {
      const savedTrade = await createTrade(trade);
      
      set((state) => ({
        // Reemplazar el trade optimistic con el real
        localTrades: state.localTrades.map(t => 
          t.id === optimisticTrade.id ? savedTrade : t
        ),
        trades: [...state.trades, savedTrade],
        isCreating: false,
        isDirty: false,
        lastFetch: null // Forzar refresh en próxima consulta
      }));
    } catch (error) {
      // Revertir optimistic update en caso de error
      set((state) => ({
        localTrades: state.localTrades.filter(t => t.id !== optimisticTrade.id),
        error: error instanceof Error ? error.message : 'Error al guardar el trade',
        isCreating: false,
        isDirty: false
      }));
    }
  },

  updateTrade: async (id: number, updatedData: Partial<NewTrade>) => {
    set({ isUpdating: true, error: null });

    // Optimistic update
    const originalTrades = get().localTrades;
    set((state) => ({
      localTrades: state.localTrades.map(trade => 
        trade.id === id ? { ...trade, ...updatedData } : trade
      ),
      isDirty: true
    }));

    try {
      const updatedTrade = await updateTrade(id, updatedData);
      
      set((state) => ({
        localTrades: state.localTrades.map(trade => 
          trade.id === id ? updatedTrade : trade
        ),
        trades: state.trades.map(trade => 
          trade.id === id ? updatedTrade : trade
        ),
        isUpdating: false,
        isDirty: false
      }));
    } catch (error) {
      // Revertir optimistic update
      set({
        localTrades: originalTrades,
        error: error instanceof Error ? error.message : 'Error al actualizar el trade',
        isUpdating: false,
        isDirty: false
      });
    }
  },

  deleteTrade: async (tradeId: number) => {
    set({ isDeleting: true, error: null });

    // Optimistic update
    const originalTrades = get().localTrades;
    set((state) => ({
      localTrades: state.localTrades.filter(trade => trade.id !== tradeId),
      isDirty: true
    }));

    try {
      await deleteTrade(tradeId);
      
      set((state) => ({
        trades: state.trades.filter(trade => trade.id !== tradeId),
        isDeleting: false,
        isDirty: false
      }));
    } catch (error) {
      // Revertir optimistic update
      set({
        localTrades: originalTrades,
        error: error instanceof Error ? error.message : 'Error al eliminar el trade',
        isDeleting: false,
        isDirty: false
      });
    }
  }
}));