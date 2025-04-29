"use client"

import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { HiBadgeCheck, HiBan, HiOutlineMinusCircle } from "react-icons/hi";
import { IoIosInformationCircle, IoIosTrendingUp, IoMdCloseCircleOutline, IoMdStopwatch } from "react-icons/io";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "../../ui/badge"
import { Trade } from "@/app/interface/trade.interface";

// Función para prevenir la propagación del clic en el menú de acciones
const stopPropagation = (e: React.MouseEvent) => {
  e.stopPropagation();
};

export const columnsTrade: ColumnDef<Trade>[] = [
  {
    id: "actions",
    cell: ({ row }) => {
      const trade = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={stopPropagation}>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={stopPropagation}>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(String(trade.id))}
            >
              Copy Trade ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "symbol.label",
    header: "Symbol",
  },
  {
    accessorKey: "operationType.label",
    header: "Operation Type",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "dateEntry",
    header: "Date",
    cell: ({ row }) => {
        const date = row.original.dateEntry;
        return date ? date.toLocaleString() : '-'; // Format the date as needed
    }
  },
  {
    accessorKey: "priceEntry",
    header: "Price Entry",
  },
  {
    accessorKey: "priceExit",
    header: "Price Exit",
  },
  {
    accessorKey: "spread",
    header: "Spread",
  },
  {
    accessorKey: "result.label",
    header: "Result",
    cell: ({ row }) => {

      console.log("row: "+row.original.result)
      const result = row.original.result?.label as keyof typeof resultConfig || ""; // Asegúrate de que el resultado sea una cadena válida
  
      // Define el ícono y el color según el resultado
      const resultConfig = {
        Win: {
          icon: <HiBadgeCheck className="text-green-400" />, // Ícono para "win"
          color: "text-green-400 border-green-400",
        },
        Loss: {
          icon: <HiBan className="text-red-400" />, // Ícono para "loss"
          color: "text-red-400 border-red-400",
        },
        BreakEven: {
          icon: <HiOutlineMinusCircle className="text-yellow-400" />, // Ícono para "breakeven"
          color: "text-yellow-400 border-yellow-400",
        },
      };
  
      const { icon, color } = resultConfig[result] || {
        icon: <IoIosInformationCircle className="text-gray-400" />, // Ícono por defecto
        }
  
      return (
        <Badge
          variant="outline"
          className={`flex gap-1 px-1.5 ${color} border-gray-700 [&_svg]:size-3`}
        >
          {icon}
          {result}
        </Badge>
      );
    },
  },
  {
    accessorKey: "statusOperation",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.statusOperation?.label as keyof typeof statusConfig || ""; // Asegúrate de que el estado sea una cadena válida
  
      // Define el ícono y el color según el estado
      const statusConfig = {
        Open: {
          icon: <IoIosTrendingUp className="text-blue-400" />, // Ícono para "open"
          color: "text-blue-400 border-blue-400",
        },
        Close: {
          icon: <IoMdCloseCircleOutline className="text-gray-400" />, // Ícono para "closed"
          color: "text-gray-400 border-gray-400",
        },
        Pending: {
          icon: <IoMdStopwatch className="text-yellow-400" />, // Ícono para "pending"
          color: "text-yellow-400 border-yellow-400",
        },
        Canceled: {
          icon: <IoIosInformationCircle className="text-violet-400" />, // Ícono para "canceled"
          color: "text-violet-400 border-violet-400",
        },
      };
  
      const { icon, color } = statusConfig[status] || { icon: null, color: "" };
  
      return (
        <Badge
          variant="outline"
          className={`flex gap-1 px-1.5 ${color} border-gray-700 [&_svg]:size-3`}
        >
          {icon}
          {status}
        </Badge>
      );
    },
  }
];
