"use client";

import { useEffect, useState, useRef } from "react";
import { useStrategiesStore } from "@/app/stores/strategies-store";
import { Strategy } from "@/app/interface/strategy.interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { EditStrategyDialog } from "./edit-strategy-dialog";
import { useConfirmationsStore } from "@/app/stores/confirmations-store";
import { Confirmation } from "@/app/interface/confirmation.interface";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { associateConfirmationToStrategy, removeConfirmationFromStrategy } from "@/app/api/strategyconfirmation.api";

interface StrategyDetailProps {
  strategyId: number;
}

// Tipo de item para el drag and drop
interface DragItem {
  type: string;
  id: number;
  confirmation: Confirmation;
}

// Componente para tarjeta de confirmación arrastrable
const DraggableConfirmationCard = ({ confirmation, isAssociated = false }: { confirmation: Confirmation, isAssociated?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>(() => ({
    type: "confirmation",
    item: { type: "confirmation", id: confirmation.id, confirmation },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Aplicar la ref
  drag(ref);

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: "move" }}
      className={`mb-2 ${isAssociated ? "bg-zinc-800" : "bg-zinc-900"}`}
    >
      <Card className="hover:border-blue-500 transition-colors">
        <CardHeader className="p-3">
          <CardTitle className="text-sm">{confirmation.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <p className="text-xs text-muted-foreground line-clamp-2">{confirmation.description}</p>
          <div className="mt-2 flex justify-between items-center">
            <Badge variant={confirmation.status === "active" ? "default" : "secondary"} className="text-xs">
              {confirmation.status}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {confirmation.conditions?.length || 0} condiciones
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export function StrategyDetail({ strategyId }: StrategyDetailProps) {
  const router = useRouter();
  const { strategies } = useStrategiesStore();
  const { confirmations, strategyConfirmations, refreshConfirmationsByStrategy, refreshConfirmations, updateConfirmation } = useConfirmationsStore();
  
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar estrategia y todas las confirmaciones
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Encontrar la estrategia en el store
        const found = strategies.find(s => s.id === strategyId);
        if (found) {
          setStrategy(found);
        } else {
          setError("Estrategia no encontrada");
        }
        
        // Cargar todas las confirmaciones disponibles
        await refreshConfirmations();

        // Cargar las confirmaciones asociadas a la estrategia
        await refreshConfirmationsByStrategy(strategyId);
      } catch (err) {
        setError("Error al cargar los datos");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [strategyId, strategies, refreshConfirmations, refreshConfirmationsByStrategy]);

  // Define handlers inside DndProvider to ensure drag context is available
  if (isLoading) return <p className="p-6">Cargando detalles...</p>;
  if (error || !strategy) return <p className="p-6 text-red-500">Error: {error}</p>;

  return (
    <DndProvider backend={HTML5Backend}>
      <StrategyDetailContent 
        strategy={strategy} 
        strategyId={strategyId}
        router={router}
        selectedConfirmations={strategyConfirmations}
        allConfirmations={confirmations}
        updateConfirmation={updateConfirmation}
        refreshConfirmationsByStrategy={refreshConfirmationsByStrategy}
      />
    </DndProvider>
  );
}

// Create a separate component for the content to ensure all drag and drop is within DndProvider context
function StrategyDetailContent({
  strategy,
  strategyId,
  router,
  selectedConfirmations,
  allConfirmations,
  updateConfirmation,
  refreshConfirmationsByStrategy
}: {
  strategy: Strategy;
  strategyId: number;
  router: any;
  selectedConfirmations: Confirmation[];
  allConfirmations: Confirmation[];
  updateConfirmation: any; // Solución temporal para el error de tipado
  refreshConfirmationsByStrategy: (strategyId: number) => Promise<void>;
}) {
  
  // Refs para drop zones
  const dropRef = useRef<HTMLDivElement>(null);
  const dropRemoveRef = useRef<HTMLDivElement>(null);
  
  // Define handlers for drag and drop
  const handleAddConfirmation = async (confirmation: Confirmation) => {
    if (!strategy) return;
    
    try {
      // Ya está asignada a esta estrategia
      if (confirmation.strategyId === strategyId) return;
      
      // Asociar confirmación a la estrategia usando el endpoint POST de strategy-confirmation
      await associateConfirmationToStrategy(strategyId, confirmation.id);
      
      // Recargar las confirmaciones de la estrategia
      await refreshConfirmationsByStrategy(strategyId);
      toast.success("Confirmación añadida", {
        description: `${confirmation.name} ha sido añadida a esta estrategia`,
      });
    } catch (err) {
      console.error("Error al añadir la confirmación:", err);
      toast.error("Error", {
        description: "No se pudo añadir la confirmación a la estrategia",
      });
    }
  };

  const handleRemoveConfirmation = async (confirmation: Confirmation) => {
    if (!strategy) return;
    
    try {
      // Desasociar confirmación de la estrategia usando el endpoint DELETE de strategy-confirmation
      await removeConfirmationFromStrategy(strategyId, confirmation.id);
      
      // Recargar las confirmaciones de la estrategia
      await refreshConfirmationsByStrategy(strategyId);
      toast.success("Confirmación eliminada", {
        description: `${confirmation.name} ha sido eliminada de esta estrategia`,
      });
    } catch (err) {
      console.error("Error al eliminar la confirmación:", err);
      toast.error("Error", {
        description: "No se pudo eliminar la confirmación de la estrategia",
      });
    }
  };
  
  // Drop zone para las confirmaciones asociadas
  const [{ isOver }, drop] = useDrop<DragItem, unknown, { isOver: boolean }>(() => ({
    accept: "confirmation",
    drop: (item: DragItem) => {
      handleAddConfirmation(item.confirmation);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Drop zone para quitar confirmaciones
  const [{ isOverRemove }, dropRemove] = useDrop<DragItem, unknown, { isOverRemove: boolean }>(() => ({
    accept: "confirmation",
    drop: (item: DragItem) => {
      handleRemoveConfirmation(item.confirmation);
    },
    collect: (monitor) => ({
      isOverRemove: !!monitor.isOver(),
    }),
  }));
  
  // Aplicar refs
  drop(dropRef);
  dropRemove(dropRemoveRef);

  return (
    <div className="flex flex-col p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push("/strategies")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{strategy.name}</h1>
            <p className="text-muted-foreground">Detalles de la estrategia y confirmaciones asociadas</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="relative">
          <CardHeader>
            <CardTitle>Descripción</CardTitle>
            <div className="absolute top-2 right-2">
              <EditStrategyDialog strategyId={strategyId} />
            </div>
          </CardHeader>
          <CardContent>
            <p>{strategy.description}</p>
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">Estado:</span>
                <Badge variant={strategy.status === "active" ? "default" : "secondary"}>
                  {strategy.status}
                </Badge>
              </div>
              <div>
                <span className="text-sm font-medium">Creada:</span>
                <span className="ml-2 text-sm">
                  {new Date(strategy.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Panel izquierdo - Confirmaciones asociadas */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Confirmaciones Asociadas</h2>
            <Badge variant="outline">
              {selectedConfirmations.length} confirmaciones
            </Badge>
          </div>
          
          <div 
            ref={dropRef}
            className={`min-h-[300px] p-4 rounded-lg border-2 border-dashed transition-colors ${
              isOver ? "border-blue-500 bg-blue-500/10" : "border-gray-700"
            }`}
          >
            {selectedConfirmations.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <p className="text-muted-foreground mb-2">Arrastra confirmaciones aquí para asociarlas</p>
                <ArrowRight className="h-8 w-8 text-muted-foreground" />
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {selectedConfirmations.map((confirmation) => (
                    <DraggableConfirmationCard 
                      key={confirmation.id} 
                      confirmation={confirmation}
                      isAssociated={true}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
        
        {/* Panel derecho - Confirmaciones disponibles */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Confirmaciones Disponibles</h2>
            <Badge variant="outline">
              {allConfirmations.filter(conf => conf.status === "active" && !selectedConfirmations.some(selected => selected.id === conf.id)).length} disponibles
            </Badge>
          </div>
          
          <Card className="bg-zinc-900">
            <CardContent className="p-4">
              <ScrollArea className="h-[400px] pr-4">
                <div>
                  {allConfirmations.length === 0 ? (
                    <div className="text-center p-6">
                      <p className="text-muted-foreground mb-2">No hay confirmaciones disponibles</p>
                      <Button 
                        variant="outline" 
                        onClick={() => router.push("/confirmations")}
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Crear confirmación
                      </Button>
                    </div>
                  ) : allConfirmations.filter(conf => conf.status === "active" && !selectedConfirmations.some(selected => selected.id === conf.id)).length === 0 ? (
                    <div className="text-center p-6">
                      <p className="text-muted-foreground mb-2">No hay confirmaciones activas disponibles</p>
                      <Button 
                        variant="outline" 
                        onClick={() => router.push("/confirmations")}
                        className="mt-2"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Crear confirmación
                      </Button>
                    </div>
                  ) : (
                    allConfirmations
                      .filter(conf => 
                        conf.status === "active" && !selectedConfirmations.some(selected => selected.id === conf.id)
                      )
                      .map((confirmation) => (
                        <DraggableConfirmationCard 
                          key={confirmation.id} 
                          confirmation={confirmation} 
                        />
                      ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        {/* Zona para eliminar confirmaciones */}
        <div 
          ref={dropRemoveRef}
          className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 p-4 rounded-lg border-2 border-dashed ${
            isOverRemove 
              ? "border-red-500 bg-red-500/10" 
              : "border-gray-700 bg-zinc-800/80"
          } transition-colors w-64 text-center ${selectedConfirmations.length > 0 ? "block" : "hidden"}`}
        >
          <p className="text-sm font-medium">Arrastra aquí para eliminar</p>
        </div>
      </div>
    </div>
  );
}