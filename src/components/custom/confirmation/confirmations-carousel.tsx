import { useState, useEffect } from "react";
import { Confirmation } from "@/app/interface/confirmation.interface";
import { Condition } from "@/app/interface/condition.interface";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, FileText, Settings, ChevronUp, ChevronDown, Edit, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { EditConfirmationDialog } from "./edit-confirmation-dialog";
import { AddConditionDialog } from "../condition/add-condition-dialog";
import { EditConditionDialog } from "../condition/edit-condition-dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ConfirmationsCarouselProps {
  confirmations: Confirmation[];
  conditions: Condition[];
}

export function ConfirmationsCarousel({ confirmations, conditions }: ConfirmationsCarouselProps) {
  const router = useRouter();
  const [currentConfirmationIndex, setCurrentConfirmationIndex] = useState(0);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedConditionId, setSelectedConditionId] = useState<string | null>(null);
  
  const currentConfirmation = confirmations[currentConfirmationIndex];
  
  // Reset selected condition when changing confirmation
  useEffect(() => {
    setSelectedConditionId(null);
  }, [currentConfirmationIndex]);
  
  const handleNextConfirmation = () => {
    setCurrentConfirmationIndex((prev) => (prev === confirmations.length - 1 ? 0 : prev + 1));
  };

  const handlePrevConfirmation = () => {
    setCurrentConfirmationIndex((prev) => (prev === 0 ? confirmations.length - 1 : prev - 1));
  };
  
  const handleNextTab = () => {
    setCurrentTab((prev) => (prev === 2 ? 0 : prev + 1));
  };

  const handlePrevTab = () => {
    setCurrentTab((prev) => (prev === 0 ? 2 : prev - 1));
  };

  const handleCardClick = () => {
    if (currentConfirmation) {
      router.push(`/confirmations/${currentConfirmation.id}`);
    }
  };

  const handleConditionChange = (value: string) => {
    setSelectedConditionId(value);
  };
  
  // Get conditions for current confirmation
  const currentConfirmationConditions = conditions.filter(
    condition => condition.confirmationId === currentConfirmation?.id
  );

  if (!currentConfirmation) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg">No hay confirmaciones disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No hay confirmaciones registradas. Crea una nueva confirmación para comenzar.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg truncate">{currentConfirmation.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={currentConfirmation.status === "active" ? "default" : "secondary"}>
              {currentConfirmation.status}
            </Badge>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <EditConfirmationDialog confirmationId={currentConfirmation.id} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="text-sm space-y-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-muted-foreground">
            Gestiona tus confirmaciones y sus condiciones
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePrevConfirmation}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              {currentConfirmationIndex + 1} de {confirmations.length}
            </span>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNextConfirmation}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute -left-3 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevTab();
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-10 h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              handleNextTab();
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <div className="bg-card rounded-md p-0.5 border border-muted/20">
            {/* Card 1: Información General */}
            {currentTab === 0 && (
              <Card className="rounded-md p-3 border-none shadow-none">
                <CardHeader className="pb-2 px-1">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Información General
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-1 space-y-3">
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Descripción</p>
                      <p className="text-sm">{currentConfirmation.description || "Sin descripción"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Creada</p>
                      <p className="text-sm">{new Date(currentConfirmation.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between pt-2 px-1">
                  <div className="text-xs text-muted-foreground">1 de 3</div>
                </CardFooter>
              </Card>
            )}
            
            {/* Card 2: Condiciones */}
            {currentTab === 1 && (
              <Card className="rounded-md p-3 border-none shadow-none">
                <CardHeader className="pb-2 px-1">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Condiciones
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-1 space-y-3">
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Seleccionar condición</p>
                      <Select onValueChange={handleConditionChange} value={selectedConditionId || ""}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una condición" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentConfirmationConditions.length === 0 ? (
                            <SelectItem value="" disabled>No hay condiciones disponibles</SelectItem>
                          ) : (
                            currentConfirmationConditions.map((condition) => (
                              <SelectItem key={condition.id} value={condition.id.toString()}>
                                {condition.description}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedConditionId && (
                      <div className="mt-2 p-2 border rounded">
                        <p className="text-sm">
                          {currentConfirmationConditions.find(c => c.id.toString() === selectedConditionId)?.description}
                        </p>
                        <div className="mt-2">
                          <EditConditionDialog 
                            conditionId={parseInt(selectedConditionId)} 
                            confirmationId={currentConfirmation.id} 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between pt-2 px-1">
                  <div className="text-xs text-muted-foreground">2 de 3</div>
                  <AddConditionDialog confirmationId={currentConfirmation.id} triggerClassName="h-8 w-8" />
                </CardFooter>
              </Card>
            )}
            
            {/* Card 3: Acciones */}
            {currentTab === 2 && (
              <Card className="rounded-md p-3 border-none shadow-none">
                <CardHeader className="pb-2 px-1">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Acciones
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-1 space-y-3">
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick();
                      }}
                    >
                      Ver detalles completos
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/confirmations/${currentConfirmation.id}/edit`);
                      }}
                    >
                      Editar confirmación
                    </Button>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between pt-2 px-1">
                  <div className="text-xs text-muted-foreground">3 de 3</div>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 