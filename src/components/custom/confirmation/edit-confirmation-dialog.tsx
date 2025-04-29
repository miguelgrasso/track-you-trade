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
import { ConfirmationForm } from "./confirmation-form";

interface EditConfirmationDialogProps {
  confirmationId: number;
  triggerClassName?: string;
}

export function EditConfirmationDialog({ confirmationId, triggerClassName }: EditConfirmationDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 rounded-full hover:bg-white/10 ${triggerClassName || ''}`}
          title="Editar confirmación"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Confirmación</DialogTitle>
          <DialogDescription>
            Modifica los datos de tu confirmación
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ConfirmationForm confirmationId={confirmationId} isDialog={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
} 