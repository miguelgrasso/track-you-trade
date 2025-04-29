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
import { ConditionForm } from "./condition-form";

interface EditConditionDialogProps {
  conditionId: number;
  confirmationId: number;
  triggerClassName?: string;
}

export function EditConditionDialog({ conditionId, confirmationId, triggerClassName }: EditConditionDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 rounded-full hover:bg-white/10 ${triggerClassName || ''}`}
          title="Editar condición"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Condición</DialogTitle>
          <DialogDescription>
            Modifica los datos de la condición
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ConditionForm conditionId={conditionId} confirmationId={confirmationId} isDialog={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
} 