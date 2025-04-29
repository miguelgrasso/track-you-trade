import { useState, useEffect } from "react";
import { Trade } from "@/app/interface/trade.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronUp, ChevronDown } from "lucide-react";
import { useConfirmationsStore } from "@/app/stores/confirmations-store";
import { useConditionsStore } from "@/app/stores/conditions-store";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TradeConfirmationCardProps {
  trade: Trade;
}

export function TradeConfirmationCard({ trade }: TradeConfirmationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { strategyConfirmations, refreshConfirmationsByStrategy } = useConfirmationsStore();
  const { conditions, refreshConditionsByConfirmation } = useConditionsStore();
  const [selectedConditions, setSelectedConditions] = useState<Record<number, number>>({});

  // Load confirmations for the trade's strategy
  useEffect(() => {
    if (trade.strategyId) {
      console.log("Loading confirmations for strategy:", trade.strategyId);
      refreshConfirmationsByStrategy(trade.strategyId);
    }
  }, [trade.strategyId, refreshConfirmationsByStrategy]);

  // Load conditions for each confirmation
  useEffect(() => {
    const loadConditions = async () => {
      console.log("Loading conditions for confirmations:", strategyConfirmations);
      for (const confirmation of strategyConfirmations) {
        console.log("Loading conditions for confirmation:", confirmation.id);
        await refreshConditionsByConfirmation(confirmation.id);
      }
    };
    if (strategyConfirmations.length > 0) {
      loadConditions();
    }
  }, [strategyConfirmations, refreshConditionsByConfirmation]);

  const handleConditionChange = (confirmationId: number, conditionId: string) => {
    setSelectedConditions(prev => ({
      ...prev,
      [confirmationId]: parseInt(conditionId)
    }));
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <Button 
          variant="ghost" 
          className="w-full flex justify-between items-center p-0 h-auto"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Confirmaciones
          </CardTitle>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="text-sm space-y-4">
          <p className="text-muted-foreground mb-2">
            Confirma los detalles de tu trade
          </p>
          
          <div className="space-y-4">
            {strategyConfirmations.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No hay confirmaciones asociadas a esta estrategia
              </p>
            ) : (
              strategyConfirmations.map((confirmation) => (
                <div key={confirmation.id} className="flex items-center justify-between gap-4">
                  <Badge variant="outline" className="flex-1">
                    {confirmation.name}
                  </Badge>
                  <Select
                    value={selectedConditions[confirmation.id]?.toString() || ""}
                    onValueChange={(value) => handleConditionChange(confirmation.id, value)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Seleccionar condición" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions
                        .filter(condition => condition.confirmationId === confirmation.id)
                        .map(condition => (
                          <SelectItem key={condition.id} value={condition.id.toString()}>
                            {condition.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              ))
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
} 