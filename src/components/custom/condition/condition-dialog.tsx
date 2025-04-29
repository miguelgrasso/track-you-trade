import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Plus } from "lucide-react";
import { ConditionForm } from "./condition-form";

interface ConditionDialogProps {
  confirmationId: number;
  conditionId?: number;
  mode: "add" | "edit";
  triggerClassName?: string;
}

export function ConditionDialog({ confirmationId, conditionId, mode, triggerClassName }: ConditionDialogProps) {
  const isEdit = mode === "edit";
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 rounded-full ${isEdit ? 'hover:bg-white/10' : ''} ${triggerClassName || ''}`}
          title={isEdit ? "Editar condición" : "Añadir condición"}
        >
          {isEdit ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar" : "Añadir"} Condición</DialogTitle>
          <DialogDescription>
            {isEdit ? "Modifica los datos de la condición" : "Define una nueva condición para tu confirmación"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ConditionForm 
            confirmationId={confirmationId} 
            conditionId={conditionId} 
            isDialog={true} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 