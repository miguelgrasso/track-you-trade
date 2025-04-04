import { NewTrade, Trade } from "../interface/trade.interface";
import { BACKEND_URL } from "../util/constantes";


export async function getTrades(){
    const res = await fetch(`${BACKEND_URL}/trades`, { cache: "no-store" });
    if (!res.ok) {
        console.log("hola: "+res.statusText)
        throw new Error("Failed to fetch trades");
    }
    return res.json();
}

export async function createTrade(trade: NewTrade) {
    console.log("Trade a crear:", trade);
    const res = await fetch(`${BACKEND_URL}/trades`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(trade),
    });
    if (!res.ok) {
        console.error("Error en la respuesta del servidor:", res.statusText);
        throw new Error("Failed to create trade");
    }
    return res.json();
}
