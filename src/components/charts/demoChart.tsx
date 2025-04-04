"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { Trade } from "@/app/interface/trade.interface";

interface DemoChartProps {
  trades: Trade[];
}

//const COLORS = ["#1a9553", "#27c66f", "#0e7a3c", "#0a5a2c"]

export function DemoChart({ trades }: DemoChartProps) {
  // Consolidar los pares tradeados
  const pairCounts = trades
    .filter((trade) => trade.symbol?.label)
    .reduce((acc: Record<string, number>, trade) => {
      acc[trade.symbol!.label] = (acc[trade.symbol!.label] || 0) + 1;
      return acc;
    }, {});

  // Preparar los datos para el gráfico
  const chartData = Object.keys(pairCounts).map((symbol) => ({
    symbol,
    count: pairCounts[symbol],
    key: symbol,
  }));
  console.log(chartData);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-800 p-2 rounded-md border border-zinc-700 text-white text-sm">
          <p className="font-medium">{`Par: ${label}`}</p>
          <p>{`${payload[0].value} trades`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-black text-white w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Consolidación de Pares Tradeados</CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              /*dataKey="symbol"
              angle={0}
              tick={{ fill: "white", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255, 255, 255, 0.2)" }}*/
              dataKey="symbol"
              tick={{ fill: "white", fontSize: 12 }}
              angle={-45} // Rotar etiquetas
              textAnchor="end" // Alinear etiquetas al final
              interval={0} // Mostrar todas las etiquetas
            />
            <YAxis
              tick={{ fill: "white", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255, 255, 255, 0.2)" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false} // Desactivar animación para mejorar la interactividad
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}