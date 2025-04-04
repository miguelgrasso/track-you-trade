"use client";

import { useEffect, useMemo, memo } from "react";
import { useStrategiesStore } from "@/app/stores/strategies-store";
import { AddStrategyDialog } from "./add-strategy-dialog";
import { StrategyCard } from "./strategy-card";

const MemoizedStrategyCard = memo(StrategyCard);

export function StrategyClient() {
  const { strategies, isLoading, error, refreshStrategies } = useStrategiesStore();

  useEffect(() => {
    refreshStrategies();
  }, [refreshStrategies]);

  const strategiesList = useMemo(() => {
    return strategies.map((strategy) => (
      <MemoizedStrategyCard key={strategy.id} strategy={strategy} />
    ));
  }, [strategies]);

  if (isLoading) return <p>Cargando estrategias...</p>;
  if (error) return <p>Error al cargar las estrategias: {error}</p>;
  console.log("Strategies Client:", strategies);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <h2 className="text-xl font-semibold px-4 lg:px-6 pt-6">Mis Estrategias</h2>
      <div className="relative flex-1 rounded-lg bg-muted/50 p-6">
        {/* Botón flotante */}
        <div className="fixed bottom-4 right-4 z-10">
          <AddStrategyDialog />
        </div>
        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategiesList}
        </div>
      </div>
    </div>
  );
}