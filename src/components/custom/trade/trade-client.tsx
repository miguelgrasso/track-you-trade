"use client";

import { useEffect, useMemo, memo, useCallback } from "react";
import { useTradeStore } from "@/app/stores/trades-store";
import { DataTable } from "@/components/custom/table/data-table";
import { DemoChart } from "@/components/charts/demoChart";
import { DonutChart } from "@/components/charts/donutChart";
import { RadarDemoChart } from "@/components/charts/radarChart";
import { AddTradeDialog } from "@/components/custom/trade/add-trade-dialog";
import { columnsTrade } from "./columns";
import { Trade } from "@/app/interface/trade.interface";

const MemoizedDemoChart = memo(DemoChart);
const MemoizedDonutChart = memo(DonutChart);
const MemoizedRadarChart = memo(RadarDemoChart);
const MemoizedDataTable = memo(DataTable) as typeof DataTable;

export function TradeClient() {
  const { localTrades, trades, isLoading, error, refreshTrades, syncWithServer, isDirty } = useTradeStore();

  // Cargar los trades al montar el componente
  useEffect(() => {
    refreshTrades();
  }, [refreshTrades]);

  // Sincronizar con el servidor cuando hay cambios locales
  useEffect(() => {
    if (isDirty) {
      const syncTimer = setTimeout(() => {
        syncWithServer();
      }, 2000);

      return () => clearTimeout(syncTimer);
    }
  }, [isDirty, syncWithServer]);

  const handleDataChange = useCallback((newData: Trade[]) => {
    useTradeStore.getState().updateLocalTrades(newData);
  }, []);

  const memoizedCharts = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MemoizedDemoChart trades={localTrades} />
      <MemoizedDonutChart trades={localTrades} />
      <MemoizedRadarChart trades={localTrades} />
    </div>
  ), [localTrades]);

  const memoizedTable = useMemo(() => (
    <MemoizedDataTable 
      columns={columnsTrade} 
      data={localTrades}
      onDataChange={handleDataChange}
    />
  ), [localTrades, handleDataChange]);

  if (isLoading && trades.length === 0) return <p>Cargando datos...</p>;
  if (error) return <p>Error al cargar los datos: {error}</p>;

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 pt-0">
      {/* Sección de Gráficos */}
      <section className="space-y-4">
        <div className="px-4 lg:px-6 pt-6">
          <h2 className="text-xl font-semibold">Dashboard</h2>
        </div>
        <div className="rounded-lg bg-muted/50 p-6">
          {memoizedCharts}
        </div>
      </section>

      {/* Sección de Listado de Trades */}
      <section className="space-y-4">
        <div className="px-4 lg:px-6">
          <h2 className="text-xl font-semibold">Historial de Trades</h2>
        </div>
        <div className="rounded-lg bg-muted/50 p-6">
          {memoizedTable}
        </div>
      </section>

      {/* Botón flotante de Añadir Trade */}
      <div className="fixed bottom-8 right-8">
        <AddTradeDialog />
      </div>
    </div>
  );
}