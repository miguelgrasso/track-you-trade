"use client";

import { Trade } from "@/app/interface/trade.interface";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TradeSummaryCard } from "./trade-summary-card";
import { TradeDetailCard } from "./trade-detail-card";
import { TradeConfirmationCard } from "./trade-confirmation-card";

interface TradeDetailDrawerProps {
  trade: Trade;
  isOpen: boolean;
  onClose: () => void;
}

export function TradeDetailDrawer({ trade, isOpen, onClose }: TradeDetailDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Detalle del Trade</SheetTitle>
        </SheetHeader>
        
        <div className="p-4 space-y-4">
          <TradeSummaryCard trade={trade} />
          <TradeDetailCard trade={trade} />
          <TradeConfirmationCard trade={trade} />
        </div>
      </SheetContent>
    </Sheet>
  );
} 