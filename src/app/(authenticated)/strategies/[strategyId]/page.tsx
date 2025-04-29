import { Metadata } from "next";
import { StrategyDetail } from "@/components/custom/strategy/strategy-detail";

export const metadata: Metadata = {
  title: "Detalles de Estrategia | Track your Trade",
  description: "Ver detalles de una estrategia",
};

interface StrategyDetailPageProps {
  params: { strategyId: string };
}

export default async function StrategyDetailPage({ 
  params 
}: StrategyDetailPageProps) {
  // En Next.js 15, debemos esperar los parámetros antes de usarlos
  const resolvedParams = await params;
  const strategyId = parseInt(resolvedParams.strategyId);

  return (
    <div className="flex flex-col min-h-screen">
      <StrategyDetail strategyId={strategyId} />
    </div>
  );
} 