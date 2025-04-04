// Define the 'trade' type
interface trade {
    id: number;
    symbol: string;
    operationType: "buy" | "sell";
    quantity: number;
    dateEntry: Date;
    priceEntry: number;
    priceExit: number;
    spread: number;
    result: "win" | "loss" | "breakeven";
    statusOperation: "open" | "closed" | "pending" | "canceled";
}

export const tradeList: trade[] = [
    {
        id: 1,
        symbol: "EUR/USD",
        operationType: "buy",
        quantity: 1.5,
        dateEntry: new Date(),
        priceEntry: 1.1050,
        priceExit: 1.1150,
        spread: 0.0005,
        result: "win",
        statusOperation: "open",
    },
    {
        id: 2,
        symbol: "GBP/JPY",
        operationType: "sell",
        quantity: 0.75,
        dateEntry: new Date(2024, 0, 15, 8, 30),
        priceEntry: 155.20,
        priceExit: 154.70,
        spread: 0.001,
        result: "loss",
        statusOperation: "closed",
    },
    {
        id: 3,
        symbol: "USD/CHF",
        operationType: "buy",
        quantity: 2.0,
        dateEntry: new Date(2024, 1, 20, 14, 0),
        priceEntry: 0.9800,
        priceExit: 0.9850,
        spread: 0.0008,
        result: "breakeven",
        statusOperation: "pending",
    },
    {
        id: 4,
        symbol: "EUR/USD",
        operationType: "buy",
        quantity: 0.5,
        dateEntry: new Date(2024, 2, 10, 9, 15),
        priceEntry: 0.7200,
        priceExit: 0.7250,
        spread: 0.0006,
        result: "win",
        statusOperation: "canceled",
    },
    {
        id: 5,
        symbol: "USD/CAD",
        operationType: "sell",
        quantity: 1.2,
        dateEntry: new Date(2024, 3, 5, 16, 45),
        priceEntry: 1.3400,
        priceExit: 1.3350,
        spread: 0.0007,
        result: "loss",
        statusOperation: "closed",
    },
];
