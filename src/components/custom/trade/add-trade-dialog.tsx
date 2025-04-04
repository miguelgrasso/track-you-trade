"use client"

import { PlusIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TradeForm } from "@/components/custom/trade/trade-form"


  
export function AddTradeDialog() {
    const [open, setOpen] = useState(false);
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-green-700 hover:bg-green-800 text-white">
            <PlusIcon className="mr-2 h-4 w-4" />
            Añadir Trade
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[900px] bg-black border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Registrar nuevo trade</DialogTitle>
            <DialogDescription className="text-gray-400">
              Completa el formulario para registrar un nuevo trade en el sistema.
            </DialogDescription>
          </DialogHeader>
          <div >
          <TradeForm onClose={() => setOpen(false)} />
        </div>
        </DialogContent>
      </Dialog>
    );
  }
