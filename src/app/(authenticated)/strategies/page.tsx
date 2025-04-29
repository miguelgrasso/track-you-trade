import { Metadata } from "next";
import { StrategyClient } from "@/components/custom/strategy/strategy-client";

export const metadata: Metadata = {
  title: "Estrategies | Track your Trade",
  description: "Gestiona y visualiza tus estrategias de trading",
};

export default function StrategiesPage() {
  return <StrategyClient />;
}
