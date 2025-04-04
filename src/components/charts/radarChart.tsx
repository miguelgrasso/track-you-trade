"use client"

import { ArrowUpRight } from "lucide-react"
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useTradeStore } from "@/app/stores/trades-store"
import { Trade } from "@/app/interface/trade.interface"

interface RadarDemoChartProps {
  trades: Trade[];
}

export function RadarDemoChart({ trades }: RadarDemoChartProps) {
  // Contar los resultados de los trades
  const results = trades
    .filter((trade) => trade.result?.result)
    .reduce((acc: Record<string, number>, trade) => {
      acc[trade.result!.result] = (acc[trade.result!.result] || 0) + 1;
      return acc;
    }, {});

  // Preparar los datos para el gráfico
  const chartData = [
    { subject: "win", value: results.win || 0 },
    { subject: "loss", value: results.loss || 0 },
    { subject: "be", value: results.breakeven || 0 },
  ];

  // Mapeo de nombres para el tooltip
  const nameMap: Record<string, string> = {
    win: "Ganancia",
    loss: "Pérdida",
    be: "Punto de equilibrio",
  };

  // Renderizador personalizado para el tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-zinc-800 p-2 rounded-md border border-zinc-700 text-white text-sm">
          <p className="font-medium">{nameMap[dataPoint.subject] || dataPoint.subject}</p>
          <p>{`${payload[0].value} trades`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-black text-white w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Trades por Resultado</CardTitle>
        <CardDescription className="text-gray-400">Mostrando los resultados de trades</CardDescription>
      </CardHeader>
      <CardContent className="p-0 h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "rgba(255, 255, 255, 0.7)" }}
              tickFormatter={(value) => nameMap[value] || value}
            />
            <Radar
              name="Resultados"
              dataKey="value"
              stroke="#22c55e"
              fill="#22c55e"
              fillOpacity={0.6}
              isAnimationActive={false} // Desactivar animación para mejorar la interactividad
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center">
            <span className="text-sm">Trending up by 5.2% this month</span>
            <ArrowUpRight className="h-4 w-4 ml-1 text-green-500" />
          </div>
          <p className="text-xs text-gray-400">Resultados totales</p>
        </div>
      </CardContent>
    </Card>
  )
}
