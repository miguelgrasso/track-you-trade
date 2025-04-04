"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Strategy } from "@/app/interface/strategy.interface";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useStrategiesStore } from "@/app/stores/strategies-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const columnsStrategy: ColumnDef<Strategy>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "descripcion",
    header: "Descripción",
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex items-center">
          <span className={`px-2 py-1 rounded-full text-xs ${
            status === "active" ? "bg-green-100 text-green-800" :
            status === "inactive" ? "bg-red-100 text-red-800" :
            "bg-gray-100 text-gray-800"
          }`}>
            {status === "active" ? "Activa" :
             status === "inactive" ? "Inactiva" :
             status}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de Creación",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const strategy = row.original;
      const router = useRouter();
      const { deleteStrategy } = useStrategiesStore();

      const handleDelete = async () => {
        try {
          await deleteStrategy(strategy.id);
          toast.success("Estrategia eliminada correctamente");
        } catch (error) {
          toast.error("Error al eliminar la estrategia");
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/strategies/${strategy.id}/edit`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]; 