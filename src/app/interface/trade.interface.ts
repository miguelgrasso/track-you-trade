import { OperationType } from "./operatiotype.interface";
import { Result } from "./result.interface";
import { StatusOperation } from "./statusoperation.interface";
import { Strategy } from "./strategy.interface";
import { Symbol } from "./symbol.interface";

export interface Trade {
    id: number;
    symbolId: number;
    operationTypeId: number;
    resultId: number;
    statusOperationId: number;
    strategyId?: number; // Estrategia asociada (opcional)
    quantity: number;
    dateEntry: string; // ISO-8601 DateTime string
    priceEntry: number;
    priceExit: number;
    spread: number;
    symbol?: Symbol; // Nested object for symbol
    operationType?: OperationType; // Nested object for operation type
    result?: Result; // Nested object for result
    statusOperation?: StatusOperation; // Nested object for status operation
    strategy?: Strategy; // Nested object for strategy
}