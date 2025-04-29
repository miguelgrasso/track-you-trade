"use client";

import { useEffect, useMemo, memo } from "react";
import { useStrategiesStore } from "@/app/stores/strategies-store";
import { StrategyCard } from "./strategy-card";
import { AddStrategyDialog } from "./add-strategy-dialog";

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
  
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <h2 className="text-xl font-semibold px-4 lg:px-6 pt-6">Mis Estrategias</h2>
      
      <div className="relative flex-1 rounded-lg bg-muted/50 p-6">
        {/* Grid de Cards - adaptativo para 4/2/1 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {strategiesList.length > 0 
            ? strategiesList 
            : <p className="col-span-full text-center text-muted-foreground">
                No hay estrategias disponibles
              </p>
          }
          {/* Tarjeta con el botón de añadir */}
          <div className="flex items-center justify-center h-full min-h-[200px] border border-dashed border-muted-foreground/30 rounded-lg p-6">
            <div className="text-center">
              <AddStrategyDialog />
              <p className="mt-2 text-sm text-muted-foreground">Añadir estrategia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}