"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { StrategyForm } from "@/components/custom/strategy/strategy-form";
import { useState } from "react";

export function AddStrategyDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-700 hover:bg-green-800 text-white">
          <PlusIcon className="mr-2 h-4 w-4" />
          Añadir Estrategia
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] bg-black border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Registrar nueva estrategia</DialogTitle>
          <DialogDescription className="text-gray-400">
            Completa el formulario para registrar una nueva estrategia en el sistema.
          </DialogDescription>
        </DialogHeader>
        <div>
          <StrategyForm onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
} 