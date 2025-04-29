import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { ConfirmationForm } from "./confirmation-form";

export function AddConfirmationDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" className="h-12 w-12 rounded-full">
          <PlusCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Confirmación</DialogTitle>
          <DialogDescription>
            Crea una nueva confirmación para tu estrategia de trading
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ConfirmationForm />
        </div>
      </DialogContent>
    </Dialog>
  );
} 