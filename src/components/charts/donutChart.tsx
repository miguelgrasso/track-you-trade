"use client"

import * as React from "react"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useTradeStore } from "@/app/stores/trades-store"
import { Trade } from "@/app/interface/trade.interface"

interface DonutChartProps {
  trades: Trade[];
}

const COLORS = ["#1a9553", "#27c66f", "#0e7a3c", "#0a5a2c"]

export function DonutChart({ trades }: DonutChartProps) {
  // Consolidar los tipos de operación
  const operationCounts = trades
    .filter((trade) => trade.operationType?.operation)
    .reduce((acc: Record<string, number>, trade) => {
      const operation = trade.operationType?.operation || 'unknown';
      acc[operation] = (acc[operation] || 0) + 1;
      return acc;
    }, {});

  // Preparar los datos para el gráfico
  const chartData = Object.keys(operationCounts).map((operation) => ({
    name: operation,
    value: operationCounts[operation],
  }));

  // Total de trades
  const totalTrades = trades.length;

  // Renderizador personalizado para el tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-800 p-2 rounded-md border border-zinc-700 text-white text-sm">
          <p className="font-medium">{`${payload[0].name}`}</p>
          <p>{`${payload[0].value} trades`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-black text-white w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Trades por tipo de operación</CardTitle>
        <CardDescription className="text-gray-400">January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="p-0 h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              isAnimationActive={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              formatter={(value) => (
                <span style={{ color: "white" }}>
                  {value}: {chartData.find((item) => item.name === value)?.value || 0}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold">{totalTrades}</span>
          <span className="text-sm text-gray-400">Trades</span>
        </div>
      </CardContent>
    </Card>
  )
}
