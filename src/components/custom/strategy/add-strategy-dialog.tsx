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
import { PlusCircle } from "lucide-react";
import { StrategyForm } from "./strategy-form";
import { useState } from "react";

export function AddStrategyDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" className="h-12 w-12 rounded-full">
          <PlusCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Estrategia</DialogTitle>
          <DialogDescription>
            Crea una nueva estrategia para tu trading
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <StrategyForm isDialog={true} onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
} 