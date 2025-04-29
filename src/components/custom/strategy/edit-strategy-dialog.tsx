import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { StrategyForm } from "./strategy-form";

interface EditStrategyDialogProps {
  strategyId: number;
  triggerClassName?: string;
}

export function EditStrategyDialog({ strategyId, triggerClassName }: EditStrategyDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 rounded-full hover:bg-white/10 ${triggerClassName || ''}`}
          title="Editar estrategia"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Estrategia</DialogTitle>
          <DialogDescription>
            Modifica los datos de tu estrategia
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <StrategyForm strategyId={strategyId} isDialog={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
} 