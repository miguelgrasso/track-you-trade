import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { ConditionForm } from "./condition-form";

interface AddConditionDialogProps {
  confirmationId: number;
  triggerClassName?: string;
}

export function AddConditionDialog({ confirmationId, triggerClassName }: AddConditionDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 rounded-full ${triggerClassName || ''}`}
          title="Añadir condición"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Añadir Condición</DialogTitle>
          <DialogDescription>
            Define una nueva condición para tu confirmación
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ConditionForm confirmationId={confirmationId} isDialog={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
} 