import { Metadata } from "next";
import { TradeClient } from "@/components/custom/trade/trade-client";

export const metadata: Metadata = {
  title: "Lista de Operaciones | My Journal Trading",
  description: "Gestiona y visualiza tus operaciones de trading",
};

export default function ListTradesPage() {
  return <TradeClient />;
} 