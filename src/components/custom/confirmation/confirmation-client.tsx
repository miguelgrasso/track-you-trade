"use client";

import { useEffect, useMemo, memo } from "react";
import { useConfirmationsStore } from "@/app/stores/confirmations-store";
import { useConditionsStore } from "@/app/stores/conditions-store";
import { AddConfirmationDialog } from "./add-confirmation-dialog";
import { ConfirmationCard } from "./confirmation-card";

const MemoizedConfirmationCard = memo(ConfirmationCard);

export function ConfirmationClient() {
  const { 
    confirmations, 
    isLoading, 
    error, 
    refreshConfirmations 
  } = useConfirmationsStore();
  
  const { 
    conditions,
    refreshConditionsByConfirmation
  } = useConditionsStore();

  useEffect(() => {
    console.log("ConfirmationClient: Iniciando carga de confirmaciones");
    refreshConfirmations()
      .then(() => {
        console.log("ConfirmationClient: Confirmaciones cargadas exitosamente");
      })
      .catch((error) => {
        console.error("ConfirmationClient: Error al cargar confirmaciones:", error);
      });
  }, [refreshConfirmations]);

  // Cargar condiciones para cada confirmación
  useEffect(() => {
    const loadConditions = async () => {
      for (const confirmation of confirmations) {
        try {
          await refreshConditionsByConfirmation(confirmation.id);
        } catch (error) {
          console.error(`Error al cargar condiciones para la confirmación ${confirmation.id}:`, error);
        }
      }
    };
    
    if (confirmations.length > 0) {
      loadConditions();
    }
  }, [confirmations, refreshConditionsByConfirmation]);

  const confirmationsList = useMemo(() => {
    return confirmations.map((confirmation) => (
      <MemoizedConfirmationCard 
        key={confirmation.id} 
        confirmation={confirmation} 
      />
    ));
  }, [confirmations]);

  if (isLoading) return <p>Cargando confirmaciones...</p>;
  if (error) return <p>Error al cargar las confirmaciones: {error}</p>;
  
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <h2 className="text-xl font-semibold px-4 lg:px-6 pt-6">
        Mis Confirmaciones
      </h2>
      <div className="relative flex-1 rounded-lg bg-muted/50 p-6">
        {/* Grid de Cards - adaptativo para 4/2/1 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {confirmationsList.length > 0 
            ? confirmationsList 
            : <p className="col-span-full text-center text-muted-foreground">
                No hay confirmaciones disponibles
              </p>
          }
          {/* Tarjeta con el botón de añadir */}
          <div className="flex items-center justify-center h-full min-h-[200px] border border-dashed border-muted-foreground/30 rounded-lg p-6">
            <div className="text-center">
              <AddConfirmationDialog />
              <p className="mt-2 text-sm text-muted-foreground">Añadir confirmación</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 