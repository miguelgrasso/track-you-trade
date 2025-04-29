"use client";

import { useEffect, useState, useMemo } from "react";
import { useConfirmationsStore } from "@/app/stores/confirmations-store";
import { useConditionsStore } from "@/app/stores/conditions-store";
import { Confirmation } from "@/app/interface/confirmation.interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConditionDialog } from "@/components/custom/condition/condition-dialog";
import { EditConfirmationDialog } from "./edit-confirmation-dialog";
import { Condition } from "@/app/interface/condition.interface";

interface ConfirmationDetailProps {
  confirmationId: number;
}

export function ConfirmationDetail({ confirmationId }: ConfirmationDetailProps) {
  const router = useRouter();
  const { confirmations } = useConfirmationsStore();
  const { conditions, isLoading: isLoadingConditions, error: conditionsError, refreshConditionsByConfirmation } = useConditionsStore();
  
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConfirmation = async () => {
      if (!confirmationId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const foundConfirmation = confirmations.find(c => c.id === confirmationId);
        if (foundConfirmation) {
          setConfirmation(foundConfirmation);
          await refreshConditionsByConfirmation(confirmationId);
        } else {
          setError("Confirmación no encontrada");
        }
      } catch (error) {
        console.error("Error loading confirmation:", error);
        setError("Error al cargar la confirmación");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConfirmation();
  }, [confirmationId, confirmations, refreshConditionsByConfirmation]);

  // Filtrar condiciones por ID de confirmación
  const filteredConditions = useMemo(() => {
    if (!confirmation) return [];
    console.log(`Filtering conditions for confirmation ID: ${confirmation.id}`);
    return conditions.filter(condition => condition.confirmationId === confirmation.id);
  }, [conditions, confirmation]);

  if (isLoading) return <p className="p-6">Cargando detalles...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!confirmation) return <p className="p-6">Confirmación no encontrada</p>;

  return (
    <div className="flex flex-col p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push("/confirmations")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold truncate">{confirmation.name}</h1>
            <p className="text-muted-foreground">Detalles de la confirmación y sus condiciones</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card className="relative">
            <CardHeader>
              <CardTitle>Descripción</CardTitle>
              <div className="absolute top-2 right-2">
                <EditConfirmationDialog confirmationId={confirmationId} />
              </div>
            </CardHeader>
            <CardContent>
              <p>{confirmation.description}</p>
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">Estado:</span>
                  <Badge variant={confirmation.status === "active" ? "default" : "secondary"}>
                    {confirmation.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm font-medium">Creada:</span>
                  <span className="ml-2 text-sm">
                    {new Date(confirmation.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            <ConditionDialog 
              confirmationId={confirmationId} 
              mode="add"
              triggerClassName="h-12 w-12"
            />
          </div>
          <p className="text-center text-sm text-muted-foreground">Añadir Condición</p>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-4">Condiciones</h3>
        {isLoadingConditions ? (
          <p>Cargando condiciones...</p>
        ) : conditionsError ? (
          <p className="text-red-500">Error al cargar condiciones: {conditionsError}</p>
        ) : filteredConditions.length === 0 ? (
          <p>No hay condiciones registradas</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConditions.map((condition) => (
              <Card key={condition.id} className="relative">
                <CardHeader>
                  <CardTitle>{condition.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{condition.description}</p>
                  <div className="absolute top-2 right-2">
                    <ConditionDialog 
                      conditionId={condition.id} 
                      confirmationId={confirmation.id}
                      mode="edit"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 