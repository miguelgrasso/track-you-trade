"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { ComboboxForm } from "@/components/custom/combobox-form";
import DateTimePicker from "@/components/custom/datetimepicker-form";
import { NewTrade, Trade } from "@/app/interface/trade.interface";
import { createTrade } from "@/app/api/trade.api";
import { getSymbols } from "@/app/api/symbol.api";
import { getResults } from "@/app/api/result.api";
import { getOperationTypes } from "@/app/api/operationtype.api";
import { getStatusOperations } from "@/app/api/statusoperation.api";
import { getStrategies } from "@/app/api/strategy.api";
import { useTradeStore } from "@/app/stores/trades-store";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export function TradeForm({ trade, onClose }: { trade?: NewTrade; onClose: () => void }) {
  const { addTrade, refreshTrades } = useTradeStore();
 
    const { register, handleSubmit, formState, reset } = useForm<NewTrade>({
        defaultValues: {
            symbolId: trade?.symbolId || 0,
            operationTypeId: trade?.operationTypeId || 0,
            quantity: trade?.quantity || 0,
            dateEntry: trade?.dateEntry || new Date().toISOString(),
            priceEntry: trade?.priceEntry || 0,
            priceExit: trade?.priceExit || 0,
            spread: trade?.spread || 0,
            resultId: trade?.resultId || 0,
            statusOperationId: trade?.statusOperationId || 0,
            strategyId: trade?.strategyId || 0,
        },
    });

    // Estados para los valores seleccionados en los combobox
    const [selectedSymbol, setSelectedSymbol] = useState<number>(trade?.symbolId || 0)
    const [selectedOperationType, setSelectedOperationType] = useState<number>(trade?.operationTypeId || 0)
    const [selectedResult, setSelectedResult] = useState<number>(trade?.resultId || 0)
    const [selectedStatusOperation, setSelectedStatusOperation] = useState<number>(trade?.statusOperationId || 0)
    const [selectedStrategy, setSelectedStrategy] = useState<number>(trade?.strategyId || 0)
    const [selectedDateEntry, setSelectedDateEntry] = useState<Date | undefined>(
        trade?.dateEntry ? new Date(trade.dateEntry) : new Date(),
    );

    // Estados para las opciones de los combobox
    const [symbolOptions, setSymbolOptions] = useState<Array<{ value: string; label: string }>>([])
    const [operationTypeOptions, setOperationTypeOptions] = useState<Array<{ value: string; label: string }>>([])
    const [resultOptions, setResultOptions] = useState<Array<{ value: string; label: string }>>([])
    const [statusOperationOptions, setStatusOperationOptions] = useState<Array<{ value: string; label: string }>>([])
    const [strategyOptions, setStrategyOptions] = useState<Array<{ value: string; label: string }>>([])

    // Cargar datos iniciales
    useEffect(() => {
        const loadInitialData = async () => {
        try {
            // Cargar símbolos
            const symbols = await getSymbols()
            const formattedSymbols = symbols.map((symbol: { id: number; label: string }) => ({
            value: symbol.id.toString(),
            label: symbol.label,
            }))
            setSymbolOptions(formattedSymbols)

            // Cargar tipos de operación
            const operationTypes = await getOperationTypes()
            const formattedOperationTypes = operationTypes.map((operationType: { id: number; label: string }) => ({
            value: operationType.id.toString(),
            label: operationType.label,
            }))
            setOperationTypeOptions(formattedOperationTypes)

            // Cargar resultados
            const results = await getResults()
            const formattedResults = results.map((result: { id: number; label: string }) => ({
            value: result.id.toString(),
            label: result.label,
            }))
            setResultOptions(formattedResults)

            // Cargar estados de operación
            const statusOperations = await getStatusOperations()
            const formattedStatusOperations = statusOperations.map(
            (statusOperation: { id: number; label: string }) => ({
                value: statusOperation.id.toString(),
                label: statusOperation.label,
            }),
            )
            setStatusOperationOptions(formattedStatusOperations)

            // Cargar estrategias
            const strategies = await getStrategies()
            const formattedStrategies = strategies
              .filter((strategy: { status: string }) => strategy.status === "active")
              .map((strategy: { id: number; name: string }) => ({
                value: strategy.id.toString(),
                label: strategy.name,
              }))
            setStrategyOptions(formattedStrategies)

            console.log("Datos iniciales cargados correctamente")
        } catch (error) {
            console.error("Error al cargar datos iniciales:", error)
        }
        }

        loadInitialData()
    }, [])

    // Actualizar estados cuando se proporciona un trade para editar
    useEffect(() => {
        if (trade) {
        setSelectedSymbol(trade.symbolId || 0)
        setSelectedOperationType(trade.operationTypeId || 0)
        setSelectedResult(trade.resultId || 0)
        setSelectedStatusOperation(trade.statusOperationId || 0)
        setSelectedStrategy(trade.strategyId || 0)
        setSelectedDateEntry(trade.dateEntry ? new Date(trade.dateEntry) : new Date())
        }
    }, [trade])

    const onSubmit = handleSubmit(async (data) => {
        try {

            console.log("Datos del formulario:", data)
            console.log("Fecha seleccionada:", selectedDateEntry);
            console.log("fecha:", data.dateEntry)
            console.log("fecha state:", selectedDateEntry?.toISOString())    
          await addTrade({
              symbolId: selectedSymbol,
              operationTypeId: selectedOperationType,
              resultId: selectedResult,
              statusOperationId: selectedStatusOperation,
              strategyId: selectedStrategy || undefined,
              dateEntry: selectedDateEntry?.toISOString() || "",
              quantity: data.quantity ?? 0,
              priceEntry: data.priceEntry ?? 0,
              priceExit: data.priceExit ?? 0,
              spread: data.spread ?? 0,
          })
    
          console.log("Trade creado exitosamente")
          await refreshTrades();
          toast.success("Trade creado exitosamente");
          onClose();
          reset()
          setSelectedSymbol(0)
          setSelectedOperationType(0)
          setSelectedResult(0)
          setSelectedStatusOperation(0)
          setSelectedStrategy(0)
          setSelectedDateEntry(new Date())

        } catch (error) {
          console.error("Error al crear el trade:", error)
          toast.error("Error al crear el trade. Por favor, inténtalo de nuevo.");
        }
      })

    return (
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-black text-white p-3 flex flex-col">
            <Label>Símbolo</Label>
            <ComboboxForm
              options={symbolOptions}
              value={selectedSymbol.toString()}

              onChange={(val) => setSelectedSymbol(Number(val))}
              placeholder="Ingrese el símbolo"
            />
    
            <Label>Tipo Operación</Label>
            <ComboboxForm
              options={operationTypeOptions}
              value={selectedOperationType.toString()}
              onChange={(val) => setSelectedOperationType(Number(val))}
              placeholder="Seleccione la operación"
            />
    
            <Label>Cantidad</Label>
            <Input type="number" step="0.01" min="0" {...register("quantity", { valueAsNumber: true })} />
    
            <Label>Fecha Entrada</Label>
            <DateTimePicker date={selectedDateEntry || new Date()} setDate={(date) => setSelectedDateEntry(date)}  />
    
            <Label>Precio de Entrada</Label>
            <Input type="number" step="0.01" min="0" {...register("priceEntry", { valueAsNumber: true })} />
    
            <Label>Precio de Salida</Label>
            <Input type="number" step="0.01" min="0" {...register("priceExit", { valueAsNumber: true })} />
    
            <Label>Spread/Comisión</Label>
            <Input type="number" step="0.01" min="0" {...register("spread", { valueAsNumber: true })} />
    
            <Label>Resultado</Label>
            <ComboboxForm
              options={resultOptions}
              value={selectedResult.toString()}
              onChange={(val) => setSelectedResult(Number(val))}
              placeholder="Seleccione el resultado"
            />
    
            <Label>Estado Operación</Label>
            <ComboboxForm
              options={statusOperationOptions}
              value={selectedStatusOperation.toString()}
              onChange={(val) => setSelectedStatusOperation(Number(val))}
              placeholder="Seleccione el estado"
            />
            
            <Label>Estrategia</Label>
            <ComboboxForm
              options={strategyOptions}
              value={selectedStrategy.toString()}
              onChange={(val) => setSelectedStrategy(Number(val))}
              placeholder="Seleccione la estrategia"
            />
    
            <Button type="submit" disabled={!formState.isValid}>
              Grabar
            </Button>
    
            <Button variant="destructive" type="button" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
        
      );
}
