export interface Trade {
    id: number;
    symbolId: number;
    operationTypeId: number;
    resultId: number;
    statusOperationId: number;
    quantity: number;
    dateEntry: string; // ISO-8601 DateTime string
    priceEntry: number;
    priceExit: number;
    spread: number;
    symbol?: Symbol; // Nested object for symbol
    operationType?: OperationType; // Nested object for operation type
    result?: Result; // Nested object for result
    statusOperation?: StatusOperation; // Nested object for status operation
}

export interface NewTrade{
    symbolId: number;
    operationTypeId: number;
    resultId: number;
    statusOperationId: number;
    quantity: number;
    dateEntry: string; // ISO-8601 DateTime string
    priceEntry: number;
    priceExit: number;
    spread: number;
}

export interface Symbol {
    id: number;
    codeSymbol: string;
    label: string;
    createdAt: string; // ISO-8601 DateTime string
}

export interface OperationType {
    id: number;
    label: string;
    operation: string;
    createdAt: string; // ISO-8601 DateTime string
}

export interface Result {
    id: number;
    label: string;
    result: string;
    createdAt: string; // ISO-8601 DateTime string
}

export interface StatusOperation {
    id: number;
    label: string;
    status: string;
    createdAt: string; // ISO-8601 DateTime string
}