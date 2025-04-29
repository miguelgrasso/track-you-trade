import { Trade } from "@/app/interface/trade.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Info, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface TradeSummaryCardProps {
  trade: Trade;
}

export function TradeSummaryCard({ trade }: TradeSummaryCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatDate = (dateStr: string | Date) => {
    if (!dateStr) return "-";
    const date = dateStr instanceof Date ? dateStr : new Date(dateStr);
    return date.toLocaleString();
  };

  const getResultColor = (result: string | undefined) => {
    if (!result) return "bg-gray-100 text-gray-800";
    
    switch (result) {
      case "Win":
        return "bg-green-100 text-green-800";
      case "Loss":
        return "bg-red-100 text-red-800";
      case "BreakEven":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800";
      case "Close":
        return "bg-gray-100 text-gray-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Canceled":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
            <Info className="h-4 w-4" />
            Resumen del Trade
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
          {/* Symbol and Operation Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground">Símbolo</p>
              <p className="font-medium">{trade.symbol?.label || "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Operación</p>
              <p className="font-medium">{trade.operationType?.label || "-"}</p>
            </div>
          </div>
          
          <Separator className="my-1" />
          
          {/* Price Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground">Precio entrada</p>
              <p className="font-medium">{formatCurrency(trade.priceEntry)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Precio salida</p>
              <p className="font-medium">{formatCurrency(trade.priceExit)}</p>
            </div>
          </div>
          
          {/* Quantity and Date Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground">Cantidad</p>
              <p className="font-medium">{trade.quantity}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Fecha</p>
              <p className="font-medium">{formatDate(trade.dateEntry)}</p>
            </div>
          </div>
          
          <Separator className="my-1" />
          
          {/* Result Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground">Resultado</p>
              <Badge 
                variant="outline" 
                className={getResultColor(trade.result?.label)}
              >
                {trade.result?.label || "-"}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground">P&L</p>
              <p className={`font-medium ${trade.result?.label === "Win" ? "text-green-500" : trade.result?.label === "Loss" ? "text-red-500" : ""}`}>
                {formatCurrency((trade.priceExit - trade.priceEntry) * trade.quantity)}
              </p>
            </div>
          </div>
          
          {/* Strategy Row (if exists) */}
          {trade.strategyId && (
            <>
              <Separator className="my-1" />
              <div>
                <p className="text-muted-foreground">Estrategia</p>
                <p className="font-medium">{trade.strategy?.name || `Estrategia #${trade.strategyId}`}</p>
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
} 