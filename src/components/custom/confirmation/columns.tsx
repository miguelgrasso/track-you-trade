"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Confirmation } from "@/app/interface/confirmation.interface";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useConfirmationsStore } from "@/app/stores/confirmations-store";
import { useState } from "react";

export const columns: ColumnDef<Confirmation>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => {
      const description: string = row.getValue("description");
      return <div className="max-w-[300px] truncate">{description}</div>;
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type: string = row.getValue("type");
      return (
        <Badge variant="outline">
          {type === "price" ? "Precio" : 
           type === "volume" ? "Volumen" : 
           type === "indicator" ? "Indicador" : 
           type === "pattern" ? "Patrón" : "Otro"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      return (
        <Badge variant={status === "active" ? "default" : "secondary"}>
          {status === "active" ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Creado",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return format(date, "PPP", { locale: es });
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const confirmation = row.original;
      const router = useRouter();
      const { deleteConfirmation } = useConfirmationsStore();
      const [isDeleting, setIsDeleting] = useState(false);

      const handleDelete = async () => {
        if (confirm(`¿Estás seguro de que deseas eliminar la confirmación "${confirmation.name}"?`)) {
          setIsDeleting(true);
          try {
            await deleteConfirmation(confirmation.id);
          } catch (error) {
            console.error("Error al eliminar la confirmación:", error);
          } finally {
            setIsDeleting(false);
          }
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
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push(`/confirmations/${confirmation.id}/edit`)}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="cursor-pointer text-red-600 focus:text-red-600"
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]; 